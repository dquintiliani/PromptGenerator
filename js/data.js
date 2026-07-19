/**
 * PROMPT_DATA is the single source of truth for the rule-based generator.
 * Every dropdown/checkbox group below is rendered dynamically by js/app.js.
 * To add a new selector: add a group here. To add a new option to an
 * existing selector: add an entry to that group's `options` array.
 * Nothing in app.js needs to change for either kind of addition.
 */
const PROMPT_DATA = {
  meta: {
    title: "Prompt Toolkit Generator",
    subtitle:
      "Pick from each list below. Every choice maps to a ready-made prompt component — mix and match to build a plug-and-play prompt.",
  },

  // Single-select groups rendered as <select> dropdowns.
  // Each option's `text` is the prompt component that gets inserted
  // when that option's `key` is selected.
  selectGroups: [
    {
      id: "role",
      label: "Role / Persona",
      help: "Who should the AI act as?",
      placeholder: "— None —",
      options: [
        { key: "expert_consultant", label: "Expert Consultant", text: "You are a seasoned expert consultant in this field, known for precise, well-reasoned advice." },
        { key: "teacher", label: "Teacher", text: "You are a patient, encouraging teacher who explains concepts clearly." },
        { key: "editor", label: "Editor", text: "You are a meticulous editor focused on clarity, grammar, and structure." },
        { key: "coach", label: "Coach", text: "You are a supportive coach who motivates while giving honest feedback." },
        { key: "analyst", label: "Data Analyst", text: "You are a data-driven analyst who backs claims with evidence." },
        { key: "engineer", label: "Software Engineer", text: "You are a senior software engineer who writes clean, maintainable code." },
        { key: "creative_writer", label: "Creative Writer", text: "You are an imaginative creative writer with a distinctive voice." },
        { key: "researcher", label: "Researcher", text: "You are a thorough researcher who verifies facts before stating them." },
        { key: "product_manager", label: "Product Manager", text: "You are a pragmatic product manager balancing user needs and business goals." },
        { key: "lawyer", label: "Lawyer", text: "You are a detail-oriented lawyer who reasons carefully about implications and risk." },
        { key: "therapist", label: "Therapist", text: "You are an empathetic, non-judgmental listener focused on understanding." },
        { key: "devils_advocate", label: "Devil's Advocate", text: "You are a devil's advocate who challenges assumptions and pokes holes in weak arguments." },
      ],
    },
    {
      id: "task",
      label: "Task / Goal",
      help: "What should the AI actually do?",
      placeholder: "— Select a task —",
      options: [
        { key: "decide", label: "Decide", text: "Produce a clear decision as a result." },
        { key: "summarize", label: "Summarize", text: "Condense the input into its most essential points." },
        { key: "brainstorm", label: "Brainstorm", text: "Generate a wide range of creative ideas or options." },
        { key: "explain", label: "Explain", text: "Break the topic down into clear, understandable terms." },
        { key: "analyze", label: "Analyze", text: "Examine the subject in depth and surface key insights." },
        { key: "compare", label: "Compare", text: "Identify similarities and differences between the given items." },
        { key: "critique", label: "Critique", text: "Evaluate the work and provide constructive feedback." },
        { key: "plan", label: "Plan", text: "Lay out a structured, actionable plan to achieve the goal." },
        { key: "debug", label: "Debug", text: "Identify the root cause of the problem and propose a fix." },
        { key: "draft", label: "Draft", text: "Write a first version of the requested content." },
        { key: "translate", label: "Translate", text: "Convert the content into the target language or format while preserving meaning." },
        { key: "teach", label: "Teach", text: "Guide the reader step-by-step toward understanding the topic." },
        { key: "predict", label: "Predict", text: "Forecast likely outcomes based on the available information." },
        { key: "classify", label: "Classify", text: "Sort the input into clearly defined categories." },
        { key: "optimize", label: "Optimize", text: "Improve the input for greater efficiency or effectiveness." },
        { key: "persuade", label: "Persuade", text: "Construct a compelling argument that moves the reader toward a viewpoint." },
        { key: "research", label: "Research", text: "Gather and synthesize relevant information on the topic." },
      ],
    },
    {
      id: "audience",
      label: "Audience",
      help: "Who is the response for?",
      placeholder: "— None —",
      options: [
        { key: "general", label: "General Public", text: "Write for a general audience with no specialized background." },
        { key: "beginners", label: "Beginners", text: "Assume the reader is a complete beginner to this topic." },
        { key: "experts", label: "Experts", text: "Assume the reader is an expert and skip basic explanations." },
        { key: "executives", label: "Executives", text: "Write for busy executives who want the bottom line first." },
        { key: "students", label: "Students", text: "Write for students who are actively learning the subject." },
        { key: "children", label: "Children", text: "Explain in simple terms a child could understand." },
        { key: "developers", label: "Developers", text: "Write for a technical audience of software developers." },
        { key: "investors", label: "Investors", text: "Write for investors evaluating risk and opportunity." },
        { key: "customers", label: "Customers", text: "Write for customers, prioritizing clarity and reassurance." },
        { key: "peers", label: "Peers", text: "Write as if addressing knowledgeable peers in the field." },
      ],
    },
    {
      id: "tone",
      label: "Tone",
      help: "How should it sound?",
      placeholder: "— None —",
      options: [
        { key: "formal", label: "Formal", text: "Maintain a formal, professional tone throughout." },
        { key: "casual", label: "Casual", text: "Keep the tone casual and conversational." },
        { key: "friendly", label: "Friendly", text: "Use a warm, friendly tone." },
        { key: "confident", label: "Confident", text: "Write with a confident, assured tone." },
        { key: "empathetic", label: "Empathetic", text: "Use an empathetic, understanding tone." },
        { key: "humorous", label: "Humorous", text: "Add light humor where appropriate." },
        { key: "technical", label: "Technical", text: "Use precise, technical language suited for a knowledgeable audience." },
        { key: "persuasive", label: "Persuasive", text: "Adopt a persuasive, compelling tone." },
        { key: "neutral", label: "Neutral", text: "Stay neutral and objective, avoiding strong opinions." },
        { key: "enthusiastic", label: "Enthusiastic", text: "Convey genuine enthusiasm and energy." },
        { key: "direct", label: "Direct", text: "Be direct and to the point, avoiding hedging language." },
        { key: "encouraging", label: "Encouraging", text: "Use an encouraging, supportive tone." },
      ],
    },
    {
      id: "format",
      label: "Output Format",
      help: "How should the response be structured?",
      placeholder: "— None —",
      options: [
        { key: "bullets", label: "Bullet Points", text: "Present the response as concise bullet points." },
        { key: "numbered", label: "Numbered Steps", text: "Present the response as a numbered, step-by-step list." },
        { key: "table", label: "Table", text: "Present the response as a well-organized table." },
        { key: "paragraphs", label: "Short Paragraphs", text: "Present the response in short, easy-to-read paragraphs." },
        { key: "essay", label: "Essay", text: "Present the response as a structured essay with an introduction, body, and conclusion." },
        { key: "qa", label: "Q&A", text: "Present the response in a question-and-answer format." },
        { key: "code", label: "Code Block", text: "Present any code in a properly formatted code block." },
        { key: "json", label: "JSON", text: "Return the response as valid, well-structured JSON." },
        { key: "email", label: "Email", text: "Format the response as a professional email." },
        { key: "exec_summary", label: "Executive Summary First", text: "Begin with a brief executive summary before the details." },
        { key: "dialogue", label: "Dialogue", text: "Present the response as a dialogue or conversation." },
        { key: "outline", label: "Outline", text: "Present the response as a hierarchical outline." },
      ],
    },
    {
      id: "length",
      label: "Length / Detail",
      help: "How much detail should it include?",
      placeholder: "— None —",
      options: [
        { key: "one_liner", label: "One-Liner", text: "Respond in a single sentence." },
        { key: "brief", label: "Brief", text: "Keep the response brief — no more than a few sentences." },
        { key: "concise", label: "Concise", text: "Be concise; avoid unnecessary elaboration." },
        { key: "moderate", label: "Moderate", text: "Provide a moderately detailed response." },
        { key: "detailed", label: "Detailed", text: "Provide a thorough, detailed response." },
        { key: "comprehensive", label: "Comprehensive", text: "Be comprehensive and cover the topic exhaustively." },
      ],
    },
  ],

  // Multi-select group rendered as checkboxes. Any number of these
  // components can be combined into the "Additional requirements" list.
  checkGroups: [
    {
      id: "constraints",
      label: "Additional Requirements",
      help: "Stack as many of these as you need.",
      options: [
        { key: "no_jargon", label: "No jargon", text: "Avoid jargon and technical terms." },
        { key: "cite_sources", label: "Cite sources", text: "Cite sources or reasoning for any claims." },
        { key: "no_opinions", label: "No opinions", text: "Avoid personal opinions; stick to facts." },
        { key: "ask_clarifying", label: "Ask clarifying questions first", text: "Ask clarifying questions if the request is ambiguous before answering." },
        { key: "give_examples", label: "Include examples", text: "Include concrete examples to illustrate key points." },
        { key: "avoid_repetition", label: "Avoid repetition", text: "Avoid repeating the same idea in different words." },
        { key: "show_reasoning", label: "Show reasoning", text: "Show your reasoning step-by-step before giving the final answer." },
        { key: "final_answer_only", label: "Final answer only", text: "Give only the final answer, without showing intermediate steps." },
        { key: "highlight_risks", label: "Highlight risks", text: "Explicitly call out risks, caveats, or limitations." },
        { key: "use_analogies", label: "Use analogies", text: "Use analogies to make complex ideas more relatable." },
        { key: "stay_on_topic", label: "Stay on topic", text: "Stay strictly on topic and avoid tangents." },
        { key: "same_language", label: "Match input language", text: "Respond only in the language the input is written in." },
        { key: "no_preamble", label: "No preamble", text: "Skip any preamble or restatement of the request — get straight to the answer." },
        { key: "step_by_step", label: "One step at a time", text: "Work through the task one step at a time, checking in before moving to the next." },
      ],
    },
  ],
};
