import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_QUESTION_TYPES = [
  "read-aloud", "repeat-sentence", "describe-image", "retell-lecture",
  "answer-short-question", "respond-situation", "summarize-discussion",
  "summarize-written-text", "essay", "summarize-spoken-text", "write-from-dictation"
];

const MAX_QUESTION_TEXT_LENGTH = 5000;
const MAX_USER_RESPONSE_LENGTH = 10000;
const MAX_AUDIO_TRANSCRIPT_LENGTH = 5000;

interface ScoreRequest {
  questionType: string;
  questionText: string;
  userResponse: string;
  audioTranscript?: string;
}

function sanitizeInput(input: string): string {
  // Remove potential prompt injection patterns
  return input
    .replace(/\b(system|assistant|user)\s*:/gi, '')
    .replace(/```/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
    .trim();
}

function validateRequest(data: ScoreRequest): { valid: boolean; error?: string } {
  if (!data.questionType || typeof data.questionType !== 'string') {
    return { valid: false, error: 'Missing or invalid questionType' };
  }
  
  if (!ALLOWED_QUESTION_TYPES.includes(data.questionType)) {
    return { valid: false, error: `Invalid questionType. Must be one of: ${ALLOWED_QUESTION_TYPES.join(', ')}` };
  }
  
  if (!data.questionText || typeof data.questionText !== 'string') {
    return { valid: false, error: 'Missing or invalid questionText' };
  }
  
  if (data.questionText.length > MAX_QUESTION_TEXT_LENGTH) {
    return { valid: false, error: `questionText exceeds maximum length of ${MAX_QUESTION_TEXT_LENGTH} characters` };
  }
  
  if (!data.userResponse || typeof data.userResponse !== 'string') {
    return { valid: false, error: 'Missing or invalid userResponse' };
  }
  
  if (data.userResponse.length > MAX_USER_RESPONSE_LENGTH) {
    return { valid: false, error: `userResponse exceeds maximum length of ${MAX_USER_RESPONSE_LENGTH} characters` };
  }
  
  if (data.audioTranscript && typeof data.audioTranscript !== 'string') {
    return { valid: false, error: 'Invalid audioTranscript format' };
  }
  
  if (data.audioTranscript && data.audioTranscript.length > MAX_AUDIO_TRANSCRIPT_LENGTH) {
    return { valid: false, error: `audioTranscript exceeds maximum length of ${MAX_AUDIO_TRANSCRIPT_LENGTH} characters` };
  }
  
  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Authenticated user: ${user.id} requesting score`);

    const requestData = await req.json() as ScoreRequest;
    
    // Validate input
    const validation = validateRequest(requestData);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize inputs
    const questionType = requestData.questionType;
    const questionText = sanitizeInput(requestData.questionText);
    const userResponse = sanitizeInput(requestData.userResponse);
    const audioTranscript = requestData.audioTranscript ? sanitizeInput(requestData.audioTranscript) : undefined;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = getSystemPrompt(questionType);
    const userPrompt = getUserPrompt(questionType, questionText, userResponse, audioTranscript);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "score_response",
            description: "Return scoring for PTE response",
            parameters: {
              type: "object",
              properties: {
                overallScore: { type: "number", description: "Overall score out of 90" },
                contentScore: { type: "number", description: "Content score out of 90" },
                pronunciationScore: { type: "number", description: "Pronunciation score out of 90 (speaking only)" },
                fluencyScore: { type: "number", description: "Fluency score out of 90 (speaking only)" },
                grammarScore: { type: "number", description: "Grammar score out of 90 (writing only)" },
                spellingScore: { type: "number", description: "Spelling score out of 90 (writing only)" },
                feedback: { type: "string", description: "Detailed feedback and suggestions" },
                suggestions: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "List of improvement suggestions" 
                }
              },
              required: ["overallScore", "contentScore", "feedback", "suggestions"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "score_response" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI scoring failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const scoreData = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(scoreData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid AI response format");
  } catch (error) {
    console.error("Score response error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Scoring failed" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getSystemPrompt(questionType: string): string {
  const basePrompt = `You are an expert PTE Academic examiner. Score responses accurately according to official PTE scoring criteria.`;
  
  const typePrompts: Record<string, string> = {
    "read-aloud": `${basePrompt} For Read Aloud, evaluate: Content (pronunciation of words), Oral Fluency (rhythm, phrasing, stress), and Pronunciation (vowels, consonants, word stress).`,
    "repeat-sentence": `${basePrompt} For Repeat Sentence, evaluate: Content (word accuracy), Oral Fluency (natural speech flow), and Pronunciation (clear articulation).`,
    "describe-image": `${basePrompt} For Describe Image, evaluate: Content (key features described), Oral Fluency (coherent description), and Pronunciation.`,
    "retell-lecture": `${basePrompt} For Retell Lecture, evaluate: Content (main points covered), Oral Fluency (coherent retelling), and Pronunciation.`,
    "answer-short-question": `${basePrompt} For Answer Short Question, evaluate: whether the answer is correct and appropriately brief.`,
    "respond-situation": `${basePrompt} For Respond to Situation, evaluate: appropriateness of response, tone, and language use.`,
    "summarize-discussion": `${basePrompt} For Summarize Group Discussion, evaluate: coverage of main points, coherence, and language.`,
    "summarize-written-text": `${basePrompt} For Summarize Written Text, evaluate: Content (key points in one sentence), Form (word count 5-75), Grammar, and Vocabulary.`,
    "essay": `${basePrompt} For Essay, evaluate: Content (relevant ideas), Form (200-300 words), Development (logical structure), Grammar, Spelling, Vocabulary, and Linguistic Range.`,
    "summarize-spoken-text": `${basePrompt} For Summarize Spoken Text, evaluate: Content (main points), Form (50-70 words), Grammar, Spelling, and Vocabulary.`,
    "write-from-dictation": `${basePrompt} For Write from Dictation, evaluate: exact word match accuracy.`,
  };

  return typePrompts[questionType] || basePrompt;
}

function getUserPrompt(questionType: string, questionText: string, userResponse: string, audioTranscript?: string): string {
  let prompt = `Question Type: ${questionType}\n\nOriginal Text/Question:\n${questionText}\n\n`;
  
  if (audioTranscript) {
    prompt += `User's Speech Transcript:\n${audioTranscript}\n\n`;
  }
  
  prompt += `User's Response:\n${userResponse}\n\nPlease score this response according to PTE Academic criteria and provide detailed feedback.`;
  
  return prompt;
}
