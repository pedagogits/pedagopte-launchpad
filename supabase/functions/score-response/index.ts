import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScoreRequest {
  questionType: string;
  questionText: string;
  userResponse: string;
  audioTranscript?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionType, questionText, userResponse, audioTranscript } = await req.json() as ScoreRequest;
    
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
