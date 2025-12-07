// All 22 PTE Question Types with sample questions

export interface Question {
  id: string;
  type: string;
  title: string;
  instructions: string;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  options?: string[];
  correctAnswer?: string | string[] | number[];
  timeLimit: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hasAiScoring: boolean;
}

// Speaking Questions (7 types)
export const speakingQuestions: Question[] = [
  {
    id: "ra-001",
    type: "read-aloud",
    title: "Pandemic Response",
    instructions: "Please examine the text provided below. You are required to read it out loud as naturally as you can. Remember, you only have 40 seconds to complete this task.",
    content: "In South Australia, most individuals with a positive COVID-19 test remain in the community, either at home or in supervised care. Health professionals conduct assessments, posing questions about symptoms, medical history, and the feasibility of safe isolation away from others to ensure appropriate care and containment.",
    timeLimit: 40,
    difficulty: "Easy",
    hasAiScoring: true,
  },
  {
    id: "rs-001",
    type: "repeat-sentence",
    title: "Academic Research",
    instructions: "You will hear a sentence. Please repeat the sentence exactly as you heard it. You will hear the sentence only once.",
    content: "The research methodology employed in this study was designed to minimize bias and ensure reproducible results.",
    timeLimit: 15,
    difficulty: "Medium",
    hasAiScoring: true,
  },
  {
    id: "di-001",
    type: "describe-image",
    title: "Population Growth Chart",
    instructions: "Please examine the image provided below. You have 25 seconds to study the image. Then you will need to describe in detail what the image is showing. You will have 40 seconds to give your response.",
    content: "A bar chart showing population growth across five major cities from 2010 to 2023, with New York, Tokyo, London, Sydney, and Mumbai represented. Tokyo shows the highest growth at 15%, followed by Mumbai at 12%.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
    timeLimit: 40,
    difficulty: "Medium",
    hasAiScoring: true,
  },
  {
    id: "rl-001",
    type: "retell-lecture",
    title: "Climate Change Impact",
    instructions: "You will hear a lecture. After listening, you will have 10 seconds to prepare. Then you will need to retell what you heard in your own words. You will have 40 seconds to give your response.",
    content: "Today we'll discuss the profound impact of climate change on global ecosystems. Rising temperatures are causing shifts in animal migration patterns, affecting biodiversity in unprecedented ways. The Arctic ice cap has lost nearly 40% of its volume since 1979, threatening polar bear populations and disrupting traditional food chains. Meanwhile, coral reefs are experiencing mass bleaching events, with the Great Barrier Reef losing half its coral cover in the past three decades.",
    timeLimit: 40,
    difficulty: "Hard",
    hasAiScoring: true,
  },
  {
    id: "asq-001",
    type: "answer-short-question",
    title: "Quick Answer",
    instructions: "You will hear a question. Please give a simple and short answer. Often just one or a few words is enough.",
    content: "What do we call the scientist who studies the stars and planets?",
    timeLimit: 10,
    difficulty: "Easy",
    hasAiScoring: true,
  },
  {
    id: "rts-001",
    type: "respond-situation",
    title: "Workplace Scenario",
    instructions: "Listen to and read a description of a situation. You will have 20 seconds to think about your answer. Then you will hear a beep. After the beep you will have 40 seconds to answer the question.",
    content: "You are a team leader at a marketing company. One of your team members has been consistently missing deadlines, affecting the whole team's performance. You need to address this issue with them in a professional manner. What would you say to this team member?",
    timeLimit: 40,
    difficulty: "Medium",
    hasAiScoring: true,
  },
  {
    id: "sgd-001",
    type: "summarize-discussion",
    title: "Education Reform Discussion",
    instructions: "You will hear three people having a discussion. Listen to and summarize the discussion. You will have 40 seconds to give your response.",
    content: "Speaker A: 'I believe traditional classroom learning is still the most effective method. Students need face-to-face interaction with teachers.' Speaker B: 'I disagree. Online learning offers flexibility and access to global resources. Students can learn at their own pace.' Speaker C: 'Perhaps a hybrid approach works best. Combining both methods allows for personalized learning while maintaining social connections.'",
    timeLimit: 40,
    difficulty: "Hard",
    hasAiScoring: true,
  },
];

// Writing Questions (2 types)
export const writingQuestions: Question[] = [
  {
    id: "swt-001",
    type: "summarize-written-text",
    title: "Renewable Energy",
    instructions: "Read the passage below and summarize it using one sentence. Type your response in the box at the bottom of the screen. You have 10 minutes to finish this task. Your response will be judged on the quality of your writing and on how well your response presents the key points in the passage.",
    content: "The transition to renewable energy sources represents one of the most significant shifts in human history. Solar and wind power have become increasingly cost-competitive with fossil fuels, with solar panel costs dropping by 89% since 2010. Many countries are now setting ambitious targets for carbon neutrality, with the European Union aiming for net-zero emissions by 2050. However, challenges remain, including energy storage solutions, grid infrastructure upgrades, and the need for rare earth minerals used in battery production. Despite these obstacles, investments in clean energy reached a record $500 billion globally in 2023, signaling strong market confidence in a sustainable future.",
    timeLimit: 600,
    difficulty: "Medium",
    hasAiScoring: true,
  },
  {
    id: "essay-001",
    type: "essay",
    title: "Technology and Education",
    instructions: "You will have 20 minutes to plan, write and revise an essay about the topic below. Your response will be judged on how well you develop a position, organize your ideas, present supporting details, and control the elements of standard written English. You should write 200-300 words.",
    content: "Some people believe that technology has made education more accessible and effective, while others argue that it has created new barriers to learning. Discuss both views and give your opinion.",
    timeLimit: 1200,
    difficulty: "Hard",
    hasAiScoring: true,
  },
];

// Reading Questions (5 types)
export const readingQuestions: Question[] = [
  {
    id: "fib-dd-001",
    type: "fill-blanks-dropdown",
    title: "Economic Theory",
    instructions: "Below is a text with blanks. Click on each blank, a list of choices will appear. Select the appropriate answer choice for each blank.",
    content: "The fundamental principles of economics ___1___ on the concept of scarcity. Resources are ___2___ while human wants are unlimited. This creates a need for efficient ___3___ of resources. Governments often intervene in markets to ___4___ market failures and ensure equitable distribution.",
    options: ["rely|depend|focus|base", "limited|abundant|increasing|stable", "allocation|production|consumption|distribution", "address|create|ignore|celebrate"],
    correctAnswer: ["rely", "limited", "allocation", "address"],
    timeLimit: 120,
    difficulty: "Medium",
    hasAiScoring: false,
  },
  {
    id: "mcma-r-001",
    type: "mc-multiple-reading",
    title: "Scientific Method",
    instructions: "Read the text and answer the question by selecting all the correct responses. More than one response is correct.",
    content: "The scientific method is a systematic approach to understanding the natural world. It begins with observation and the formulation of questions. Scientists then develop hypotheses—testable predictions based on existing knowledge. Through experimentation and data collection, these hypotheses are either supported or refuted. The process is iterative, with results leading to new questions and refined understanding. Peer review ensures that findings are scrutinized by other experts before publication.\n\nQuestion: Which of the following are essential components of the scientific method?",
    options: [
      "Observation and questioning",
      "Hypothesis formation",
      "Emotional interpretation",
      "Experimentation",
      "Peer review"
    ],
    correctAnswer: [0, 1, 3, 4],
    timeLimit: 120,
    difficulty: "Medium",
    hasAiScoring: false,
  },
  {
    id: "rop-001",
    type: "reorder-paragraphs",
    title: "Industrial Revolution",
    instructions: "The text boxes below have been placed in a random order. Restore the original order by dragging the text boxes from the left panel to the right panel.",
    content: JSON.stringify([
      "The Industrial Revolution began in Britain in the late 18th century.",
      "It marked a major turning point in history, as every aspect of daily life was influenced in some way.",
      "The textile industry was among the first to be industrialized, with the invention of the spinning jenny and power loom.",
      "This transformation spread to other countries throughout the 19th century.",
      "The revolution led to unprecedented urbanization and changes in working conditions."
    ]),
    correctAnswer: [0, 1, 2, 4, 3],
    timeLimit: 120,
    difficulty: "Hard",
    hasAiScoring: false,
  },
  {
    id: "fib-drag-001",
    type: "fill-blanks-drag",
    title: "Environmental Science",
    instructions: "In the text below some words are missing. Drag words from the box below to the appropriate place in the text.",
    content: "Biodiversity refers to the variety of life on Earth. It encompasses the ___1___ of species, genetic variation within species, and the diversity of ___2___. Human activities have led to a significant ___3___ in biodiversity, primarily through habitat destruction, pollution, and climate change. Conservation efforts aim to ___4___ endangered species and restore damaged ecosystems.",
    options: ["diversity", "ecosystems", "decline", "protect", "increase", "damage", "organisms"],
    correctAnswer: ["diversity", "ecosystems", "decline", "protect"],
    timeLimit: 120,
    difficulty: "Medium",
    hasAiScoring: false,
  },
  {
    id: "mcsa-r-001",
    type: "mc-single-reading",
    title: "Artificial Intelligence",
    instructions: "Read the text and answer the multiple-choice question by selecting the correct response. Only one response is correct.",
    content: "Artificial intelligence (AI) has evolved rapidly over the past decade, moving from a theoretical concept to a practical tool used in everyday applications. Machine learning, a subset of AI, enables computers to learn from data without being explicitly programmed. Deep learning, which uses neural networks with many layers, has achieved remarkable success in image recognition, natural language processing, and game playing. However, concerns about AI ethics, job displacement, and algorithmic bias continue to spark debate among policymakers and technologists.\n\nQuestion: According to the passage, what is the relationship between machine learning and AI?",
    options: [
      "Machine learning is the same as AI",
      "Machine learning is a subset of AI",
      "AI is a subset of machine learning",
      "They are unrelated concepts"
    ],
    correctAnswer: [1],
    timeLimit: 90,
    difficulty: "Easy",
    hasAiScoring: false,
  },
];

// Listening Questions (8 types)
export const listeningQuestions: Question[] = [
  {
    id: "sst-001",
    type: "summarize-spoken-text",
    title: "Urban Planning Lecture",
    instructions: "You will hear a short lecture. Write a summary for a fellow student who was not present at the lecture. You should write 50-70 words. You have 10 minutes to finish this task.",
    content: "Today's lecture focused on sustainable urban planning. The professor discussed how cities are redesigning transportation networks to reduce carbon emissions. Key strategies include expanding public transit, creating bike-friendly infrastructure, and implementing congestion pricing. Singapore was cited as a successful example, having reduced car ownership through high registration fees and an efficient metro system. The lecture also touched on green building standards and the importance of urban green spaces for residents' well-being.",
    timeLimit: 600,
    difficulty: "Hard",
    hasAiScoring: true,
  },
  {
    id: "mcma-l-001",
    type: "mc-multiple-listening",
    title: "Business Strategy",
    instructions: "Listen to the recording and answer the question by selecting all the correct responses. More than one response is correct.",
    content: "The recording discusses key elements of successful business strategy: market analysis, competitive positioning, resource allocation, and adaptability to change. The speaker emphasizes that understanding customer needs is paramount, and that companies must continuously innovate to stay relevant. Risk management and building a strong organizational culture were also highlighted as critical success factors.\n\nQuestion: Which elements of business strategy were mentioned in the recording?",
    options: [
      "Market analysis",
      "Product pricing",
      "Competitive positioning",
      "Customer needs understanding",
      "Stock market performance"
    ],
    correctAnswer: [0, 2, 3],
    timeLimit: 90,
    difficulty: "Medium",
    hasAiScoring: false,
  },
  {
    id: "fib-l-001",
    type: "fill-blanks-listening",
    title: "Scientific Discovery",
    instructions: "You will hear a recording. Type the missing words in each blank.",
    content: "The discovery of penicillin by Alexander ___1___ in 1928 revolutionized medicine. This ___2___ antibiotic has saved countless lives by fighting bacterial ___3___. Fleming noticed that a mold had contaminated one of his ___4___ plates and was killing the bacteria around it.",
    correctAnswer: ["Fleming", "remarkable", "infections", "culture"],
    timeLimit: 60,
    difficulty: "Medium",
    hasAiScoring: false,
  },
  {
    id: "hcs-001",
    type: "highlight-correct-summary",
    title: "Economic Policy",
    instructions: "You will hear a recording. Click on the paragraph that best relates to the recording.",
    content: "The recording discussed how central banks use interest rate adjustments as their primary tool for managing inflation and economic growth. When inflation rises above target levels, banks typically raise rates to cool spending. Conversely, during recessions, lower rates encourage borrowing and investment. The speaker noted the challenges of this approach in the current global economic climate.",
    options: [
      "Central banks have limited tools for managing the economy, relying solely on government fiscal policy to control inflation and growth.",
      "Interest rates are adjusted by central banks to manage inflation and economic growth, with higher rates cooling spending and lower rates encouraging investment.",
      "Economic growth is primarily determined by consumer confidence, with central bank policies having minimal impact on inflation rates.",
      "The global economic climate has made interest rate adjustments obsolete as a tool for economic management."
    ],
    correctAnswer: [1],
    timeLimit: 60,
    difficulty: "Hard",
    hasAiScoring: false,
  },
  {
    id: "mcsa-l-001",
    type: "mc-single-listening",
    title: "Historical Event",
    instructions: "Listen to the recording and answer the multiple-choice question by selecting the correct response.",
    content: "The speaker describes the significance of the printing press invention by Johannes Gutenberg around 1440. This innovation enabled mass production of books, democratizing knowledge that was previously available only to the wealthy and clergy. The recording emphasizes how this led to increased literacy rates and contributed to major historical movements including the Renaissance and Reformation.\n\nQuestion: According to the recording, what was the main impact of the printing press?",
    options: [
      "It made books more expensive",
      "It reduced literacy rates",
      "It democratized access to knowledge",
      "It was only used by the wealthy"
    ],
    correctAnswer: [2],
    timeLimit: 60,
    difficulty: "Easy",
    hasAiScoring: false,
  },
  {
    id: "smw-001",
    type: "select-missing-word",
    title: "Environmental Science",
    instructions: "You will hear a recording. At the end of the recording, the last word or group of words has been replaced by a beep. Select the correct option to complete the recording.",
    content: "Ocean acidification is a growing concern among marine biologists. As the ocean absorbs more carbon dioxide from the atmosphere, its pH level decreases. This affects marine life, particularly organisms that build shells from calcium carbonate. Scientists predict that if current trends continue, many coral reefs could dissolve by the end of this [BEEP].",
    options: ["decade", "century", "year", "month"],
    correctAnswer: [1],
    timeLimit: 30,
    difficulty: "Medium",
    hasAiScoring: false,
  },
  {
    id: "hiw-001",
    type: "highlight-incorrect-words",
    title: "Technology Lecture",
    instructions: "You will hear a recording. Below is a transcript of the recording. Some words in the transcript differ from what the speaker said. Click on the words that are different.",
    content: "Quantum computing represents a fundamental shift in computational power. Unlike classical computers that use bits, quantum computers utilize qubits, which can exist in multiple states simultaneously. This property, known as superposition, allows quantum machines to process vast amounts of information in parallel. Major technology companies are investing heavily in quantum research, hoping to achieve quantum supremacy—the point at which quantum computers outperform classical ones.",
    options: ["fundamental", "classical", "utilize", "simultaneously", "property", "parallel", "investing", "supremacy"],
    correctAnswer: [2, 5], // "utilize" should be "use", "parallel" should be "parallelism"
    timeLimit: 60,
    difficulty: "Hard",
    hasAiScoring: false,
  },
  {
    id: "wfd-001",
    type: "write-from-dictation",
    title: "Academic Sentence",
    instructions: "You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.",
    content: "The professor emphasized the importance of critical thinking in academic research.",
    timeLimit: 30,
    difficulty: "Easy",
    hasAiScoring: true,
  },
];

export const allQuestions = {
  speaking: speakingQuestions,
  writing: writingQuestions,
  reading: readingQuestions,
  listening: listeningQuestions,
};

export const questionTypeInfo: Record<string, { name: string; description: string; section: string; hasAiScoring: boolean }> = {
  "read-aloud": { name: "Read Aloud", description: "Read text aloud naturally", section: "speaking", hasAiScoring: true },
  "repeat-sentence": { name: "Repeat Sentence", description: "Repeat the sentence you hear", section: "speaking", hasAiScoring: true },
  "describe-image": { name: "Describe Image", description: "Describe an image in detail", section: "speaking", hasAiScoring: true },
  "retell-lecture": { name: "Retell Lecture", description: "Retell a lecture in your words", section: "speaking", hasAiScoring: true },
  "answer-short-question": { name: "Answer Short Question", description: "Give a brief answer", section: "speaking", hasAiScoring: true },
  "respond-situation": { name: "Respond to a Situation", description: "Respond appropriately to a scenario", section: "speaking", hasAiScoring: true },
  "summarize-discussion": { name: "Summarize Group Discussion", description: "Summarize a group discussion", section: "speaking", hasAiScoring: true },
  "summarize-written-text": { name: "Summarize Written Text", description: "Summarize in one sentence", section: "writing", hasAiScoring: true },
  "essay": { name: "Essay", description: "Write a 200-300 word essay", section: "writing", hasAiScoring: true },
  "fill-blanks-dropdown": { name: "Fill in the Blanks (Dropdown)", description: "Select correct words from dropdown", section: "reading", hasAiScoring: false },
  "mc-multiple-reading": { name: "MC Multiple Answers (Reading)", description: "Select multiple correct answers", section: "reading", hasAiScoring: false },
  "reorder-paragraphs": { name: "Re-order Paragraphs", description: "Arrange paragraphs in order", section: "reading", hasAiScoring: false },
  "fill-blanks-drag": { name: "Fill in the Blanks (Drag & Drop)", description: "Drag words to fill blanks", section: "reading", hasAiScoring: false },
  "mc-single-reading": { name: "MC Single Answer (Reading)", description: "Select one correct answer", section: "reading", hasAiScoring: false },
  "summarize-spoken-text": { name: "Summarize Spoken Text", description: "Write a 50-70 word summary", section: "listening", hasAiScoring: true },
  "mc-multiple-listening": { name: "MC Multiple Answers (Listening)", description: "Select multiple correct answers", section: "listening", hasAiScoring: false },
  "fill-blanks-listening": { name: "Fill in the Blanks (Listening)", description: "Type missing words", section: "listening", hasAiScoring: false },
  "highlight-correct-summary": { name: "Highlight Correct Summary", description: "Select the correct summary", section: "listening", hasAiScoring: false },
  "mc-single-listening": { name: "MC Single Answer (Listening)", description: "Select one correct answer", section: "listening", hasAiScoring: false },
  "select-missing-word": { name: "Select Missing Word", description: "Complete the recording", section: "listening", hasAiScoring: false },
  "highlight-incorrect-words": { name: "Highlight Incorrect Words", description: "Click words that differ", section: "listening", hasAiScoring: false },
  "write-from-dictation": { name: "Write from Dictation", description: "Type the sentence you hear", section: "listening", hasAiScoring: true },
};
