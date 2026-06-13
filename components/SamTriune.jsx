import { useState } from "react";

// ─── BUSINESS GUIDE DATA ────────────────────────────────────────────────────

const BIZ_PHASES = [
  {
    phase: "Phase 1", title: "Define the exact customer", color: "#22d3ee", duration: "Week 1", hours: 2,
    items: [
      "Write one sentence: who suffers most without Triune Intelligence today? Not 'SMEs' — 'UK security consultancies with 3–20 staff trying to win public-sector tenders without a bid team.'",
      "List 20 real organisations by name. Use LinkedIn, Contracts Finder, Google. 20 named targets before anything else.",
      "Rank them: pain intensity × ease of reach × ability to pay. Score each 1–3. Top 5 become your first outreach list.",
    ],
    output: "A ranked list of 5 named target organisations with contact names.",
  },
  {
    phase: "Phase 2", title: "Craft the opening message", color: "#22d3ee", duration: "Week 2", hours: 1.5,
    items: [
      "Write a 4-line outreach message — problem, Triune, proof, ask. Line 1: name their specific pain. Line 2: what Triune does. Line 3: one proof point. Line 4: 'worth a 20-min call this week?'",
      "Send to your top 5 targets via LinkedIn DM or direct email. Personalise line 1 for each.",
      "Track: sent / replied / call booked.",
    ],
    output: "5 outreach messages sent.",
  },
  {
    phase: "Phase 3", title: "Run discovery calls", color: "#22d3ee", duration: "Weeks 3–4", hours: 2,
    items: [
      "Use the BANT framework you built into your AI agent: Budget · Authority · Need · Timeline.",
      "Ask: 'What does winning this kind of work cost you today?' — surfaces their real budget anchor.",
      "End every call with a defined next step and a date. Never 'I'll follow up.' Always 'Shall we do a demo Thursday at 2pm?'",
    ],
    output: "At least 2 discovery calls completed with notes.",
  },
  {
    phase: "Phase 4", title: "Close your first customer", color: "#22d3ee", duration: "Weeks 4–6", hours: 2,
    items: [
      "Offer a 30-day paid pilot at a reduced rate — not free. £99–£299/month pilot qualifies them and validates pricing.",
      "Send a one-page proposal — problem, solution, pilot terms, price. Under 400 words.",
      "Follow up exactly 48 hours after sending: 'Just checking this landed — any questions before you decide?'",
    ],
    output: "First paying customer signed.",
  },
  {
    phase: "Phase 5", title: "Build the content engine", color: "#22d3ee", duration: "Ongoing · 30 min/week", hours: 0.5,
    items: [
      "Post one LinkedIn update per week from Samuel's personal account — founder posts build trust faster than company posts.",
      "Share one real platform feature or result each fortnight. Screenshot of the proposal generator, tender search in action.",
      "Collect one testimonial per new customer. One real sentence from a user outweighs any marketing copy.",
    ],
    output: "4 LinkedIn posts published. 1 testimonial collected.",
  },
];

const BIZ_MODELS = [
  { name: "AI Consulting", rev: "£500–£5k/project", diff: "Low", time: "Fast", icon: "🎯" },
  { name: "Human Eval / AI Ops", rev: "£3k–£30k/mo", diff: "Medium", time: "Medium", icon: "🔍" },
  { name: "Micro-SaaS", rev: "$5k–$50k MRR", diff: "Medium", time: "6–18 mo", icon: "⚡" },
  { name: "AI Agency", rev: "£20k–£200k/yr", diff: "Medium", time: "6–12 mo", icon: "🏢" },
  { name: "Platform / VC-backed", rev: "VC-backed", diff: "High", time: "2–5 yrs", icon: "🚀" },
];

const WEEK_PLAN = [
  { day: "Mon", track: "sales", task: "Outreach — 1 personalised message sent", mins: 20 },
  { day: "Tue", track: null, task: "Buffer / rest", mins: 0 },
  { day: "Wed", track: "learning", task: "Learning block — one lesson or notebook", mins: 45 },
  { day: "Thu", track: "sales", task: "Discovery call or follow-up", mins: 30 },
  { day: "Fri", track: "product", task: "Product task — one item from Track C", mins: 30 },
  { day: "Sat", track: "learning", task: "Build session — apply what you learned", mins: 45 },
  { day: "Sun", track: "review", task: "Weekly review — what shipped? what's next?", mins: 15 },
];

const TRACK_COLORS = { sales: "#22d3ee", learning: "#a78bfa", product: "#34d399", review: "#f59e0b" };

const OS_TRACKS = {
  sales: {
    id: "sales", label: "Track A", title: "First Customers", subtitle: "GTM · Sales · Marketing",
    color: "#22d3ee", glow: "rgba(34,211,238,0.18)", weeklyHours: 2.5,
    phases: [
      {
        id: "s1", title: "Define the exact customer", duration: "Week 1", hours: 2, priority: "critical",
        tasks: [
          { id: "s1a", text: "Write one sentence describing your exact target customer", detail: "Not 'SMEs' — 'UK security consultancies with 3–20 staff trying to win public-sector tenders without a bid team.'" },
          { id: "s1b", text: "List 20 real organisations by name", detail: "Use LinkedIn, Contracts Finder, Google. 20 named targets before anything else." },
          { id: "s1c", text: "Rank them: pain × reach × ability to pay", detail: "Score each 1–3 on each axis. Top 5 become your first outreach list." },
        ],
        output: "A ranked list of 5 named target organisations with contact names.",
      },
      {
        id: "s2", title: "Craft the opening message", duration: "Week 2", hours: 1.5, priority: "critical",
        tasks: [
          { id: "s2a", text: "Write a 4-line outreach message — problem, Triune, proof, ask", detail: "Line 1: name their pain. Line 2: what Triune does. Line 3: one proof point. Line 4: 'worth a 20-min call?'" },
          { id: "s2b", text: "Paste your draft in chat — I'll stress-test it", detail: "Paste your message and I'll sharpen it." },
          { id: "s2c", text: "Send to your top 5 targets", detail: "Personalise line 1 for each. Everything else stays the same." },
        ],
        output: "5 outreach messages sent. Track: sent / replied / call booked.",
      },
      {
        id: "s3", title: "Run discovery calls", duration: "Weeks 3–4", hours: 2, priority: "high",
        tasks: [
          { id: "s3a", text: "Use BANT: Budget · Authority · Need · Timeline", detail: "Get answers to all four before pitching anything." },
          { id: "s3b", text: "Ask: 'What does winning this kind of work cost you today?'", detail: "Surfaces their real budget anchor." },
          { id: "s3c", text: "End every call with a defined next step and a date", detail: "Never 'I'll follow up.' Always a specific time booked." },
        ],
        output: "At least 2 discovery calls completed with notes.",
      },
      {
        id: "s4", title: "Close your first customer", duration: "Weeks 4–6", hours: 2, priority: "high",
        tasks: [
          { id: "s4a", text: "Offer a 30-day paid pilot — not free", detail: "£99–£299/month pilot qualifies them and validates pricing." },
          { id: "s4b", text: "Send a one-page proposal", detail: "Problem, solution, pilot terms, price. Under 400 words." },
          { id: "s4c", text: "Follow up exactly 48 hours after sending", detail: "'Just checking this landed — any questions before you decide?'" },
        ],
        output: "First paying customer signed.",
      },
    ],
  },
  learning: {
    id: "learning", label: "Track B", title: "AI Mastery", subtitle: "Structured Learning Path",
    color: "#a78bfa", glow: "rgba(167,139,250,0.18)", weeklyHours: 1.5,
    phases: [
      {
        id: "l1", title: "Python & data fluency", duration: "Weeks 1–4", hours: 1.5, priority: "critical",
        tasks: [
          { id: "l1a", text: "Complete Python basics on fast.ai (free)", detail: "Notebooks 1–3. Run every cell. Don't just read — type the code." },
          { id: "l1b", text: "Load a real CSV dataset and describe it with Pandas", detail: "Use UK Contracts Finder data. Make it relevant to Triune." },
          { id: "l1c", text: "Plot 3 charts with Matplotlib", detail: "Bar chart, line chart, scatter. Export as PNG." },
        ],
        output: "A working Colab notebook with your own dataset analysis.",
      },
      {
        id: "l2", title: "How ML actually works", duration: "Weeks 5–10", hours: 1.5, priority: "high",
        tasks: [
          { id: "l2a", text: "Watch Andrew Ng's Supervised Learning lectures (Coursera, free audit)", detail: "Weeks 1–3. Take notes by hand. Focus on intuition, not proofs." },
          { id: "l2b", text: "Train a text classifier on tender descriptions", detail: "'Relevant to security sector' vs 'not relevant'. Use scikit-learn." },
          { id: "l2c", text: "Build a confusion matrix and document results", detail: "Understand precision vs recall for tender filtering." },
        ],
        output: "A trained text classifier with documented evaluation metrics.",
      },
      {
        id: "l3", title: "Transformers & LLMs applied", duration: "Weeks 11–18", hours: 1.5, priority: "high",
        tasks: [
          { id: "l3a", text: "Read 'The Illustrated Transformer' by Jay Alammar", detail: "Free online. Read it twice. The clearest visual explanation of attention." },
          { id: "l3b", text: "Use Hugging Face pipeline to summarise a tender document", detail: "One function call. Experiment with prompting the summary differently." },
          { id: "l3c", text: "Prompt-engineer a better proposal draft than your current generator", detail: "Direct product improvement disguised as a learning exercise." },
        ],
        output: "A prompt that outperforms your current proposal generator.",
      },
      {
        id: "l4", title: "Build something real", duration: "Weeks 19–26", hours: 1.5, priority: "medium",
        tasks: [
          { id: "l4a", text: "Fine-tune a small model on UK government tender language", detail: "Use LoRA via Hugging Face PEFT. Gives Triune a proprietary model layer." },
          { id: "l4b", text: "Read 2 arxiv papers per month relevant to your domain", detail: "Search: 'document summarisation', 'opportunity matching', 'risk extraction'." },
          { id: "l4c", text: "Publish one technical post about what you built", detail: "LinkedIn or a simple blog. Founder technical credibility compounds." },
        ],
        output: "A fine-tuned model in production or a documented experiment.",
      },
    ],
  },
  product: {
    id: "product", label: "Track C", title: "Platform Roadmap", subtitle: "Product · Positioning · Moat",
    color: "#34d399", glow: "rgba(52,211,153,0.18)", weeklyHours: 1,
    phases: [
      {
        id: "p1", title: "Sharpen positioning", duration: "Week 1–2", hours: 1, priority: "critical",
        tasks: [
          { id: "p1a", text: "Rewrite homepage headline as: '[Persona] uses Triune to [outcome] in [timeframe]'", detail: "Current headline is strong but abstract. A concrete outcome headline converts better at this stage." },
          { id: "p1b", text: "Add one real use-case story above the fold", detail: "'A security consultancy used Triune to find and submit a £240k MoD tender in 4 hours.'" },
          { id: "p1c", text: "Add trust signals: logos, numbers, or a beta user quote", detail: "Even 'used by 3 organisations in beta' is better than nothing." },
        ],
        output: "Updated homepage live with sharper headline + one use-case story.",
      },
      {
        id: "p2", title: "Validate the feature set", duration: "Weeks 3–6", hours: 1, priority: "high",
        tasks: [
          { id: "p2a", text: "Ask every discovery call: 'Which of these 6 modules would you pay for first?'", detail: "AI Assistant · Tender Search · Proposal Generator · CRM · Projects & Risk · Grants. Rank by frequency." },
          { id: "p2b", text: "Identify your killer feature — the reason someone signs up", detail: "Probably Proposal Generator + Tender Search combo. Confirm with real users." },
          { id: "p2c", text: "Audit your competitor set for gaps", detail: "Check Procore, RFPIO, Salesforce. What do they NOT do that Triune does?" },
        ],
        output: "A ranked feature priority list based on real prospect input.",
      },
      {
        id: "p3", title: "Build your data moat", duration: "Weeks 7–16", hours: 1, priority: "high",
        tasks: [
          { id: "p3a", text: "Log every tender search and proposal generation as structured data", detail: "What sectors search for what. Which tender types get most proposals. This data trains better models." },
          { id: "p3b", text: "Build a win-rate metric per customer", detail: "If Triune customers win more work, that stat is your most powerful sales asset." },
          { id: "p3c", text: "Design a feedback loop: users rate AI proposal quality (1–5)", detail: "Generates labelled training data. Your generator improves over time." },
        ],
        output: "Data schema designed. Logging active. Feedback loop live.",
      },
      {
        id: "p4", title: "Investor-ready narrative", duration: "Month 4–6", hours: 1, priority: "medium",
        tasks: [
          { id: "p4a", text: "Define your seed raise: how much, at what valuation, for what milestones", detail: "Typical pre-seed UK SaaS: £150k–£500k. Milestone: 10 paying customers, £5k MRR." },
          { id: "p4b", text: "Build a one-slide traction summary: users, MRR, key wins, pipeline", detail: "Update it monthly. Pull it out in 10 seconds when you meet an investor." },
          { id: "p4c", text: "Research 10 UK angel investors or funds focused on govtech / AI / SaaS", detail: "Entrepreneur First, Innovate UK, Angel Investment Network UK, Fuel Ventures." },
        ],
        output: "Investor one-pager drafted. 10 target investors researched.",
      },
    ],
  },
};

// ─── ACADEMY CURRICULUM ──────────────────────────────────────────────────────

const CURRICULUM = [
  {
    stage: 1, stageTitle: "Foundations", color: "#6366f1",
    lessons: [
      {
        id: "1-1", title: "What is AI? A real explanation", duration: "8 min read", xp: 50,
        content: [
          { type: "heading", text: "AI is not magic. It's pattern matching at scale." },
          { type: "para", text: "Artificial Intelligence is software that learns from examples rather than being explicitly programmed with rules. Instead of writing 'if the email contains FREE then it's spam', an AI looks at 10,000 spam emails and 10,000 real emails and figures out the patterns itself." },
          { type: "callout", color: "#6366f1", text: "Key insight: AI doesn't understand anything. It finds statistical patterns. A model identifying cancer in X-rays doesn't 'know' what cancer is — it knows certain pixel patterns in training data were labelled 'cancer' by doctors." },
          { type: "heading", text: "The three types you'll use" },
          { type: "list", items: [
            { title: "Machine Learning (ML)", desc: "Algorithms that improve from data. Powers spam filters, fraud detection, tender matching." },
            { title: "Deep Learning (DL)", desc: "ML using neural networks with many layers. Better at images, audio, text. Requires more data and compute." },
            { title: "Generative AI (GenAI)", desc: "Models that create content — text, images, code. Claude, GPT-4, Gemini. Powers Triune's Proposal Generator." },
          ]},
          { type: "callout", color: "#22d3ee", text: "Business application: Tell any prospect exactly how it works. 'Our AI processed millions of procurement documents — when you paste a tender, it draws on patterns from thousands of similar winning bids.' More convincing than 'it uses advanced AI.'" },
        ],
        quiz: [
          { q: "What does an AI model learn from data?", options: ["Rules written by programmers", "Statistical patterns and correlations", "The meaning of words", "Internet facts"], answer: 1, explain: "AI finds statistical patterns — not rules, not meaning. A spam filter learns certain word combinations correlate with spam labels." },
          { q: "Which layer of the AI stack is Triune Intelligence built on?", options: ["Foundation model layer", "Training infrastructure", "Application layer", "Hardware layer"], answer: 2, explain: "Triune is an application built on foundation model APIs. Most commercial AI value is created at the application layer." },
          { q: "Main difference between ML and Generative AI?", options: ["GenAI is more expensive", "ML predicts/classifies, GenAI creates content", "ML requires more data", "No difference"], answer: 1, explain: "Traditional ML focuses on predictions and classifications. Generative AI produces new content — text, images, code." },
        ],
        resources: [
          { title: "fast.ai — Practical Deep Learning (free)", url: "https://course.fast.ai", type: "course" },
          { title: "3Blue1Brown — Neural Networks (YouTube)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "video" },
          { title: "Google ML Crash Course (free)", url: "https://developers.google.com/machine-learning/crash-course", type: "course" },
        ],
      },
      {
        id: "1-2", title: "Python in 45 minutes — enough to start", duration: "12 min read", xp: 75,
        content: [
          { type: "heading", text: "Why Python? The entire AI ecosystem runs on it." },
          { type: "para", text: "Every major AI library — PyTorch, TensorFlow, Hugging Face, LangChain — is Python-first. You need to be fluent enough to read, run, and adapt code. Not a software engineer." },
          { type: "code", lang: "python", code: `# 6 concepts that unlock everything

# 1. Variables
name = "Triune Intelligence"
price = 29.99

# 2. Lists
sectors = ["security", "healthcare", "charity"]
sectors.append("govtech")

# 3. Dictionaries
customer = {"name": "SecureGuard Ltd", "mrr": 149}
print(customer["name"])  # → SecureGuard Ltd

# 4. Loops
for sector in sectors:
    print(f"Targeting: {sector}")

# 5. Functions
def calculate_arr(mrr, customers):
    return mrr * customers * 12

arr = calculate_arr(149, 10)  # → 17880

# 6. If/else
if arr > 10000:
    print("Seed-fundable traction")` },
          { type: "callout", color: "#6366f1", text: "Run this free at colab.research.google.com — no install. Open a new notebook, paste it in, press Shift+Enter. Working in 60 seconds." },
          { type: "code", lang: "python", code: `# Reading real data in 5 lines
import pandas as pd

df = pd.read_csv("contracts.csv")
print(df.shape)       # (rows, columns)
print(df.head())      # first 5 rows
print(df.describe())  # statistics

security = df[df["sector"] == "Security"]
print(f"Found {len(security)} contracts")` },
        ],
        quiz: [
          { q: "What Python structure stores a customer's name, plan, and MRR together?", options: ["A list", "A dictionary", "A variable", "A loop"], answer: 1, explain: "Dictionaries store key-value pairs — perfect for records with named fields." },
          { q: "What does df.head() return?", options: ["Column names only", "The first 5 rows", "Statistics", "The last row"], answer: 1, explain: "df.head() shows the first 5 rows — useful for quickly inspecting data." },
          { q: "Where can you run Python with zero installation?", options: ["Only locally", "Google Colab (colab.research.google.com)", "Only paid servers", "Python.org"], answer: 1, explain: "Google Colab gives you a free notebook in your browser — no setup required." },
        ],
        resources: [
          { title: "Google Colab — free Python notebooks", url: "https://colab.research.google.com", type: "tool" },
          { title: "Kaggle Python Course — free, interactive", url: "https://www.kaggle.com/learn/python", type: "course" },
          { title: "Find a Tender Service — real UK contract data", url: "https://www.find-tender.service.gov.uk", type: "data" },
        ],
      },
      {
        id: "1-3", title: "The maths you actually need", duration: "10 min read", xp: 60,
        content: [
          { type: "heading", text: "4 concepts. Nothing more." },
          { type: "para", text: "Most courses front-load calculus until people quit. As an AI application builder, you need intuition for these 4 things — not the ability to derive them." },
          { type: "list", items: [
            { title: "Probability (0 to 1)", desc: "Models output probabilities. '87% likely to be a security tender.' 0 = impossible, 1 = certain." },
            { title: "Averages and distributions", desc: "Mean, median, variance. Know if your model is wrong by £5k every time, or mostly right with occasional £50k errors." },
            { title: "Vectors and similarity", desc: "Text converts to lists of numbers. Similar texts have similar vectors. This is how Triune's tender matching works." },
            { title: "Loss functions", desc: "During training, the model predicts, measures how wrong it was (loss), and adjusts. Lower loss = better model." },
          ]},
          { type: "code", lang: "python", code: `# Why accuracy alone is misleading

# 99% of tenders are irrelevant to your niche.
# A model that says "not relevant" to EVERYTHING = 99% accurate.
# But completely useless.

# Precision = of flagged tenders, what % were actually relevant?
# Recall    = of all relevant tenders, what % did the model catch?

# For Triune: high RECALL matters more.
# Missing a £500k opportunity > reviewing one irrelevant tender.` },
        ],
        quiz: [
          { q: "A tender model has 95% accuracy but misses 40% of relevant tenders. Problem?", options: ["Model is too accurate", "High accuracy masks low recall — missing real opportunities", "Training data too large", "Nothing — 95% is excellent"], answer: 1, explain: "Accuracy is misleading with imbalanced classes. Recall measures how many real opportunities are caught — critical for tender matching." },
          { q: "How does text get represented mathematically in AI?", options: ["Colour codes", "Audio waveforms", "Vectors (lists of numbers)", "Compressed images"], answer: 2, explain: "Text converts to vectors where similar meanings produce similar numbers — enabling semantic search and matching." },
          { q: "What does 'loss' measure during training?", options: ["Memory usage", "How wrong the model's predictions are", "Data size", "Parameter count"], answer: 1, explain: "Loss quantifies how far a prediction is from the correct answer. Training minimises loss across all examples." },
        ],
        resources: [
          { title: "Khan Academy — Statistics and Probability (free)", url: "https://www.khanacademy.org/math/statistics-probability", type: "course" },
          { title: "3Blue1Brown — Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type: "video" },
          { title: "Seeing Theory — visual probability", url: "https://seeing-theory.brown.edu", type: "interactive" },
        ],
      },
    ],
  },
  {
    stage: 2, stageTitle: "Core Machine Learning", color: "#8b5cf6",
    lessons: [
      {
        id: "2-1", title: "How models actually learn", duration: "10 min read", xp: 80,
        content: [
          { type: "heading", text: "Gradient descent — the engine of all learning" },
          { type: "para", text: "Every AI model learns the same way: predict, measure error, adjust slightly toward lower error, repeat millions of times. Like finding the lowest point in a hilly landscape while blindfolded — feel the slope, step downhill, repeat." },
          { type: "callout", color: "#8b5cf6", text: "For Triune: when users rate proposal quality (1–5), you're creating labelled data. Fine-tuning on this runs gradient descent on tender-writing quality. Your model measurably improves with each rating." },
          { type: "list", items: [
            { title: "Training set (70%)", desc: "Data the model learns from. Adjusts parameters to minimise loss on these examples." },
            { title: "Validation set (15%)", desc: "Held back during training. Checks if the model is generalising or memorising (overfitting)." },
            { title: "Test set (15%)", desc: "Seen only once at the end. Honest estimate of real-world performance." },
          ]},
          { type: "code", lang: "python", code: `# Detecting overfitting
# Training accuracy:   98%  ← memorising training data
# Validation accuracy: 71%  ← failing on new examples

# Solutions:
# 1. More training data (best)
# 2. Simpler model
# 3. Regularisation
# 4. Early stopping` },
        ],
        quiz: [
          { q: "What is gradient descent doing at each step?", options: ["Randomly adjusting weights", "Moving parameters toward lower loss", "Adding training data", "Increasing complexity"], answer: 1, explain: "Gradient descent calculates the direction of steepest loss reduction and takes a small step that way — repeated until convergence." },
          { q: "97% training, 63% validation accuracy. What's happening?", options: ["Performing well", "Overfitting — memorised training examples", "Validation set too small", "Learning rate too low"], answer: 1, explain: "A large gap between training and validation accuracy is the classic sign of overfitting." },
          { q: "Why never make decisions based on test set performance?", options: ["Too small", "It contaminates the test set — you'd implicitly train on it", "Always lower", "Takes too long"], answer: 1, explain: "Using test performance to choose between models makes it a validation set. You lose your honest real-world estimate." },
        ],
        resources: [
          { title: "Andrew Ng — ML Specialisation (Coursera, audit free)", url: "https://www.coursera.org/specializations/machine-learning-introduction", type: "course" },
          { title: "Kaggle — Intro to Machine Learning (free)", url: "https://www.kaggle.com/learn/intro-to-machine-learning", type: "course" },
          { title: "Scikit-learn tutorials", url: "https://scikit-learn.org/stable/tutorial/", type: "docs" },
        ],
      },
      {
        id: "2-2", title: "LLMs and Transformers — what's actually happening", duration: "12 min read", xp: 100,
        content: [
          { type: "heading", text: "The transformer changed everything in 2017" },
          { type: "para", text: "Google's 'Attention Is All You Need' introduced the Transformer — the architecture behind Claude, GPT-4, and Gemini. The attention mechanism lets a model look at every word in relation to every other word simultaneously, solving the 'forgetting' problem of older models." },
          { type: "callout", color: "#8b5cf6", text: "For Triune's proposal generator: attention is why the model can read a 15-page tender and generate a response correctly referencing scope, budget ceiling, and evaluation criteria from different sections — holding all of it in view at once." },
          { type: "list", items: [
            { title: "Tokens", desc: "Models read tokens, not words. 'Triune Intelligence' ≈ 3 tokens. Cost scales with tokens — important for your API budget." },
            { title: "Context window", desc: "Maximum tokens processed at once. Claude's window is very large — Triune can feed in an entire tender without losing context." },
            { title: "Temperature", desc: "0 = deterministic (best for data extraction). 0.3 = slight variation (best for proposals). 1.0 = very random." },
          ]},
          { type: "code", lang: "python", code: `# High-quality Triune prompt anatomy

SYSTEM_PROMPT = """
You are an expert UK public sector bid writer with 15+ years 
experience. You write compliant proposals scoring highly against 
MEAT criteria. Flag missing info as [NEEDS INPUT: description].
"""

USER_PROMPT = f"""
Tender: {tender_text}
Organisation: {org_name}
Capabilities: {capabilities}

Write a complete proposal. Use [NEEDS INPUT] for missing info.
"""

# Temperature 0.3 — consistent but not robotic` },
        ],
        quiz: [
          { q: "What does attention allow a Transformer to do?", options: ["Process faster", "Look at every word in relation to every other simultaneously", "Use less memory", "Generate images"], answer: 1, explain: "Attention weighs the relevance of every token against every other — so references in long documents resolve correctly regardless of distance." },
          { q: "Best temperature for extracting structured data from a tender?", options: ["0.9", "0.0 — fully deterministic", "0.3", "1.5"], answer: 1, explain: "Temperature 0 is best for structured extraction — consistent, accurate output every time." },
          { q: "Why does a specific system prompt produce better results?", options: ["Longer prompts confuse models", "A specific context makes high-quality output statistically more likely", "Models respond to keywords", "System prompts override safety filters"], answer: 1, explain: "LLMs predict likely next tokens given context. A detailed expert persona makes the expert, well-structured response far more probable." },
        ],
        resources: [
          { title: "The Illustrated Transformer — Jay Alammar (free)", url: "https://jalammar.github.io/illustrated-transformer/", type: "article" },
          { title: "Andrej Karpathy — Let's build GPT (YouTube)", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", type: "video" },
          { title: "Hugging Face NLP Course (free)", url: "https://huggingface.co/learn/nlp-course/", type: "course" },
          { title: "OpenAI Tokenizer — visualise tokenisation", url: "https://platform.openai.com/tokenizer", type: "tool" },
        ],
      },
    ],
  },
  {
    stage: 3, stageTitle: "Building with AI", color: "#c026d3",
    lessons: [
      {
        id: "3-1", title: "Prompt engineering that actually works", duration: "11 min read", xp: 90,
        content: [
          { type: "heading", text: "The highest ROI skill in AI right now" },
          { type: "para", text: "A well-engineered prompt can double LLM output quality. No code, no training, no GPU. For Triune — better prompts mean better proposals, better risk extraction, better tender matching." },
          { type: "list", items: [
            { title: "1. Role + context", desc: "Give the model a persona. 'You are a senior bid writer at a UK consultancy' outperforms 'write a bid'." },
            { title: "2. Chain-of-thought", desc: "Add 'Think step by step'. Forces reasoning before concluding — improves accuracy on complex tasks." },
            { title: "3. Few-shot examples", desc: "Show 2–3 input→output examples. The model mimics the pattern — effective for consistent formatting." },
            { title: "4. Output format", desc: "'Respond only with a JSON object with keys: title, value, deadline, sector.' Enables reliable parsing." },
            { title: "5. Constraints", desc: "'Never invent numbers. Write [NEEDS INPUT] if information is missing.' Reduces hallucination." },
          ]},
          { type: "code", lang: "python", code: `# BEFORE: vague
prompt_bad = "Summarise this tender."

# AFTER: engineered
prompt_good = """
You are an expert procurement analyst. Extract as JSON:
{
  "title": "contract title",
  "estimated_value": "£X or null",
  "deadline": "YYYY-MM-DD or null",
  "sector": "security/healthcare/charity/govtech/other",
  "key_requirements": ["list"],
  "relevance_score": 1-10
}
Rules: use null if not stated. Never guess.
Respond with ONLY the JSON. No preamble.

TENDER: {tender_text}
"""` },
          { type: "callout", color: "#c026d3", text: "Try this now: go to claude.ai, paste a real tender from find-tender.service.gov.uk, and use the engineered prompt above. Compare to 'summarise this tender'. The difference is immediate." },
        ],
        quiz: [
          { q: "What does 'few-shot prompting' mean?", options: ["Using a small model", "Providing 2–3 input-output examples before the real request", "Low temperature", "Prompting from mobile"], answer: 1, explain: "Few-shot prompting shows the model examples of the pattern you want — it continues that pattern for your real input." },
          { q: "Why use RAG instead of asking the LLM to remember data?", options: ["RAG is cheaper", "LLMs have no memory between calls — RAG provides fresh, accurate context", "RAG needs no API key", "LLMs are too slow"], answer: 1, explain: "LLMs are stateless. RAG retrieves relevant data and injects it into the prompt so the model always has accurate context." },
          { q: "When should you use chain-of-thought prompting?", options: ["All prompts", "Complex reasoning tasks where intermediate steps matter", "Only maths", "Never"], answer: 1, explain: "Chain-of-thought forces explicit reasoning steps before the final answer — improves accuracy on complex, multi-step tasks." },
        ],
        resources: [
          { title: "Anthropic Prompt Engineering Guide (official)", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs" },
          { title: "Prompt Engineering Guide — full reference", url: "https://www.promptingguide.ai", type: "article" },
          { title: "Claude.ai — practice prompts directly", url: "https://claude.ai", type: "tool" },
        ],
      },
    ],
  },
  {
    stage: 4, stageTitle: "Generative AI & Fine-tuning", color: "#f59e0b",
    lessons: [
      {
        id: "4-1", title: "Fine-tuning LLMs — making models yours", duration: "13 min read", xp: 120,
        content: [
          { type: "heading", text: "Prompting gets you 80%. Fine-tuning gets the last 20%." },
          { type: "para", text: "Fine-tuning trains a base model further on your specific data so it internalises your domain's patterns without long instructions every call. The last 20% is often your competitive moat." },
          { type: "list", items: [
            { title: "Faster & cheaper", desc: "Fine-tuned models need shorter prompts — fewer tokens, lower API costs at scale." },
            { title: "Domain accuracy", desc: "A model fine-tuned on UK public sector tender responses outperforms a general model given the same prompt." },
            { title: "Consistent format", desc: "Format instructions in prompts sometimes get ignored. Fine-tuned models reliably reproduce trained structure." },
            { title: "Competitive moat", desc: "Competitors can copy prompts. They cannot copy your proprietary win/loss training data." },
          ]},
          { type: "code", lang: "python", code: `# QLoRA fine-tuning — runs on Google Colab free tier
from transformers import AutoModelForCausalLM
from peft import LoraConfig, get_peft_model
from trl import SFTTrainer

model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-v0.1", load_in_4bit=True
)
lora_config = LoraConfig(r=16, lora_alpha=32,
    target_modules=["q_proj", "v_proj"], task_type="CAUSAL_LM")
model = get_peft_model(model, lora_config)

training_data = [{
    "instruction": "Write an executive summary for this tender",
    "input": tender_text,
    "output": winning_proposal  # ← your proprietary data
}]  # 500+ examples → real moat

trainer = SFTTrainer(model=model, train_dataset=training_data)
trainer.train()
model.save_pretrained("triune-proposal-adapter")` },
          { type: "callout", color: "#f59e0b", text: "Data strategy: Every proposal generated + user rating + whether the tender was won = one labelled training example. 500 of these and you have a dataset no competitor can replicate. Start collecting now." },
        ],
        quiz: [
          { q: "What does LoRA do differently from full fine-tuning?", options: ["Uses less data", "Freezes most weights, trains small adapter matrices", "Compresses the model", "Only fine-tunes the output layer"], answer: 1, explain: "LoRA keeps original weights frozen and adds small trainable matrices — 99% of the benefit at a fraction of the compute cost." },
          { q: "You have 50 examples. Should you fine-tune?", options: ["Yes", "No — 50 causes overfitting. Build to 500+ first", "Yes with full fine-tuning", "Only if examples are long"], answer: 1, explain: "Fine-tuning on too few examples causes severe overfitting. Build to at least 500 diverse examples first." },
          { q: "What makes your fine-tuning dataset a competitive moat?", options: ["Latest architecture", "Proprietary win/loss outcomes competitors can't access", "Larger than competitors", "Made by researchers"], answer: 1, explain: "Capital can buy compute. It cannot buy your historical win/loss data from real customers — that takes time and trust." },
        ],
        resources: [
          { title: "Hugging Face PEFT — LoRA docs", url: "https://huggingface.co/docs/peft/index", type: "docs" },
          { title: "QLoRA paper — fine-tuning on consumer hardware", url: "https://arxiv.org/abs/2305.14314", type: "article" },
          { title: "Google Colab — free GPU", url: "https://colab.research.google.com", type: "tool" },
        ],
      },
      {
        id: "4-2", title: "AI Agents — systems that act", duration: "11 min read", xp: 110,
        content: [
          { type: "heading", text: "From AI that answers to AI that acts" },
          { type: "para", text: "An AI agent can decide to take actions, use tools, and chain multiple steps to complete a goal. You've already built a multi-tier agent orchestrator in your Python backend — this explains the theory behind it." },
          { type: "list", items: [
            { title: "Reason", desc: "The model receives a goal and thinks about the next action." },
            { title: "Act", desc: "The model calls a tool — a database query, API call, calculator. Tools are just Python functions." },
            { title: "Observe", desc: "The tool returns a result. The model reasons again with the new information." },
            { title: "Repeat", desc: "The loop continues until the model has enough to give a final answer." },
          ]},
          { type: "code", lang: "python", code: `# ReAct agent pattern — your FastAPI backend uses this
import anthropic
client = anthropic.Anthropic()

tools = [{"name": "search_tenders",
    "description": "Search live UK government tenders",
    "input_schema": {"type": "object",
        "properties": {"sector": {"type": "string"}}}}]

def run_agent(message):
    messages = [{"role": "user", "content": message}]
    while True:
        resp = client.messages.create(
            model="claude-sonnet-4-6", max_tokens=4096,
            tools=tools, messages=messages)
        if resp.stop_reason == "tool_use":
            tool = next(b for b in resp.content if b.type=="tool_use")
            result = execute_tool(tool.name, tool.input)
            messages.append({"role":"assistant","content":resp.content})
            messages.append({"role":"user","content":[{
                "type":"tool_result","tool_use_id":tool.id,
                "content":str(result)}]})
        else:
            return resp.content[0].text` },
          { type: "callout", color: "#f59e0b", text: "This is exactly what you built — your multi-tier orchestrator with BANT qualification and Brave Search is a ReAct agent. You've already implemented the most sophisticated pattern in applied AI engineering." },
        ],
        quiz: [
          { q: "After the model calls a tool, what happens next?", options: ["Loop ends", "Result is fed back so the model reasons further", "New agent spawned", "Model resets"], answer: 1, explain: "ReAct: Reason → Act → Observe (result) → Reason again. The tool result becomes new context for the next step." },
          { q: "Best memory approach for Triune's AI Assistant?", options: ["Everything in system prompt", "Vector store with semantic retrieval", "No memory", "Simple SQL log"], answer: 1, explain: "A vector store embeds past conversations and retrieves the most semantically relevant ones — efficient without filling the context window." },
          { q: "What is a 'tool' in an AI agent?", options: ["A special AI model", "A Python function the model can invoke", "A prompt template", "An evaluation metric"], answer: 1, explain: "Tools are regular Python functions described to the model. The model outputs the name and parameters; your code executes it." },
        ],
        resources: [
          { title: "Anthropic Tool Use documentation", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", type: "docs" },
          { title: "Building effective agents — Anthropic guide", url: "https://www.anthropic.com/research/building-effective-agents", type: "article" },
          { title: "LangGraph — agent orchestration", url: "https://langchain-ai.github.io/langgraph/", type: "docs" },
        ],
      },
    ],
  },
  {
    stage: 5, stageTitle: "Production & Mastery", color: "#e11d48",
    lessons: [
      {
        id: "5-1", title: "MLOps — shipping AI that stays reliable", duration: "12 min read", xp: 130,
        content: [
          { type: "heading", text: "Most AI projects fail in production, not in notebooks" },
          { type: "para", text: "A model scoring 94% in Colab can perform terribly in production. Data drifts. User behaviour shifts. MLOps is the discipline of making AI systems reliable, monitorable, and improvable in the real world." },
          { type: "list", items: [
            { title: "Version everything", desc: "Code, data, models, prompts, configs. When proposal quality drops, know exactly what changed." },
            { title: "Monitor behaviour", desc: "Track latency, token usage, quality scores, error rates, user ratings. Alert when metrics drift." },
            { title: "Evaluate systematically", desc: "Build an eval set of 50 inputs with expected outputs. Run it on every change before deploying." },
            { title: "Handle failures gracefully", desc: "LLM APIs fail. Every AI call needs retry logic, fallback responses, and error logging." },
            { title: "Continuous improvement loop", desc: "Collect → label → fine-tune → evaluate → deploy. This flywheel is your long-term advantage." },
          ]},
          { type: "code", lang: "python", code: `# Production LLM call with monitoring
import time
from anthropic import Anthropic, APIError
client = Anthropic()

def generate_proposal(tender_text, org_id):
    start = time.time()
    for attempt in range(3):
        try:
            resp = client.messages.create(
                model="claude-sonnet-4-6", max_tokens=4000,
                system=SYSTEM_PROMPT,
                messages=[{"role":"user","content":tender_text}])
            log_event({"org_id":org_id,
                "latency_ms":(time.time()-start)*1000,
                "tokens":resp.usage.output_tokens})
            return {"success":True, "content":resp.content[0].text}
        except APIError:
            if attempt == 2:
                return {"success":False,
                    "error":"Temporarily unavailable. Try again in 2 minutes."}
            time.sleep(2**attempt)` },
          { type: "callout", color: "#e11d48", text: "Do this today: add logging to every AI call. Log timestamp, org_id, input length, output length, latency. When customers report issues this data is the difference between fixing it in 10 minutes and guessing for hours." },
        ],
        quiz: [
          { q: "What practice catches regressions before users see them?", options: ["Larger model", "Systematic eval set run before every deployment", "More training data", "Faster API"], answer: 1, explain: "An eval set catches regressions before they reach users. Running it automatically on every change makes this protection continuous." },
          { q: "API fails at 2am. What should happen?", options: ["Nothing — users report it", "Retry with backoff, graceful error to users, monitoring alert", "Auto-restart", "Log and return empty"], answer: 1, explain: "Production AI needs: retries, graceful degradation, and monitoring alerts. All three together." },
          { q: "What is the AI product flywheel?", options: ["GPU cooling", "Collect data → fine-tune → improve → attract users → collect more data", "Attention mechanism", "Evaluation benchmark"], answer: 1, explain: "The data flywheel: more users → more data → better model → more users. Starting it early creates compounding advantages." },
        ],
        resources: [
          { title: "Made With ML — MLOps course (free)", url: "https://madewithml.com", type: "course" },
          { title: "Weights & Biases — free ML tracking", url: "https://wandb.ai", type: "tool" },
          { title: "LangSmith — LLM observability (free tier)", url: "https://www.langchain.com/langsmith", type: "tool" },
        ],
      },
      {
        id: "5-2", title: "AI strategy for founders — building the moat", duration: "10 min read", xp: 150,
        content: [
          { type: "heading", text: "Technical mastery is table stakes. Strategy is the differentiator." },
          { type: "para", text: "By Stage 5 you can build almost anything with AI. The question shifts from 'can I build this?' to 'should I, and how do I build it so competitors can't easily replicate it?'" },
          { type: "list", items: [
            { title: "Data moat", desc: "Win/loss outcomes, proposal history, sector-specific patterns. Start collecting structured data on every AI interaction today." },
            { title: "Workflow moat", desc: "When a firm runs their entire bid pipeline through Triune — CRM, tenders, proposals, projects, risk — switching means migrating months of data." },
            { title: "Network effects", desc: "Aggregated anonymised outcome data produces benchmarks: 'security firms using Triune win 34% more contracts.' Only possible at scale." },
            { title: "Brand moat", desc: "In regulated sectors, trust is a purchase criterion. Publish, speak, become the reference brand for AI in govtech." },
          ]},
          { type: "callout", color: "#e11d48", text: "Triune's position: You are not building an AI tool. You are building the operating layer for organisations that win public sector work. The AI makes it better. The workflow makes it sticky. The data makes it defensible. Price accordingly." },
        ],
        quiz: [
          { q: "Hardest moat for a competitor to replicate?", options: ["Larger model", "Better UI", "Proprietary training data from real customer outcomes", "Lower price"], answer: 2, explain: "Capital can buy compute. It cannot buy historical win/loss data — that takes time and trust to accumulate." },
          { q: "Competitor launches at half your price. Best response?", options: ["Match price", "Deepen integration and demonstrate ROI — make value undeniable", "Add features fast", "Add free tier"], answer: 1, explain: "Price competition destroys margins. Increase switching cost and demonstrate ROI so clearly the price gap becomes irrelevant." },
          { q: "What does the data flywheel produce at scale?", options: ["Lower costs", "Sector-wide win-rate benchmarks only possible with scale", "Faster responses", "Cheaper training"], answer: 1, explain: "With many customers, Triune can produce 'organisations using Triune win X% more contracts' — a sales asset competitors can't match." },
        ],
        resources: [
          { title: "a16z — AI Canon for founders", url: "https://a16z.com/ai-canon/", type: "article" },
          { title: "Sequoia — AI Primer for founders", url: "https://www.sequoiacap.com/article/ai-primer/", type: "article" },
          { title: "Innovate UK — funding for AI companies", url: "https://www.ukri.org/councils/innovate-uk/", type: "tool" },
        ],
      },
    ],
  },
];

// ─── SHARED CONSTANTS ───────────────────────────────────────────────────────

const R_ICONS = { course: "🎓", video: "▶️", tool: "🛠", data: "📊", article: "📄", interactive: "⚡", docs: "📚" };
const R_COLORS = { course: "#6366f1", video: "#ef4444", tool: "#22d3ee", data: "#34d399", article: "#f59e0b", interactive: "#c026d3", docs: "#8b5cf6" };

const PILL = (label, color) => (
  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: color + "22", color, border: `1px solid ${color}44` }}>{label}</span>
);

// ─── MAIN APP ───────────────────────────────────────────────────────────────

export default function SamTriune() {
  const [tab, setTab] = useState("dashboard");

  // OS state
  const [osChecked, setOsChecked] = useState({});
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [activeTrack, setActiveTrack] = useState("sales");
  const [reviewAnswers, setReviewAnswers] = useState({});

  // Academy state
  const [academyView, setAcademyView] = useState("home");
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completed, setCompleted] = useState({});
  const [quizState, setQuizState] = useState({});

  const toggleTask = (id) => setOsChecked(p => ({ ...p, [id]: !p[id] }));

  const allOsTasks = Object.values(OS_TRACKS).flatMap(t => t.phases.flatMap(p => p.tasks));
  const osDone = allOsTasks.filter(t => osChecked[t.id]).length;
  const osTotal = allOsTasks.length;
  const osPct = Math.round((osDone / osTotal) * 100);

  const trackPct = (track) => {
    const tasks = track.phases.flatMap(p => p.tasks);
    const done = tasks.filter(t => osChecked[t.id]).length;
    return Math.round((done / tasks.length) * 100);
  };

  const allLessons = CURRICULUM.flatMap(s => s.lessons);
  const totalXP = allLessons.reduce((a, l) => a + l.xp, 0);
  const earnedXP = allLessons.filter(l => completed[l.id]).reduce((a, l) => a + l.xp, 0);
  const stage3Done = CURRICULUM.find(s => s.stage === 3).lessons.every(l => completed[l.id]);

  const openLesson = (l) => { setCurrentLesson(l); setAcademyView("lesson"); };
  const closeLesson = () => { setCurrentLesson(null); setAcademyView("home"); };

  const handleQuizAnswer = (lid, qi, ai) => setQuizState(p => ({ ...p, [lid]: { ...p[lid], answers: { ...(p[lid]?.answers || {}), [qi]: ai } } }));
  const submitQuiz = (l) => {
    const answers = quizState[l.id]?.answers || {};
    const allCorrect = l.quiz.every((q, i) => answers[i] === q.answer);
    setQuizState(p => ({ ...p, [l.id]: { ...p[l.id], submitted: true } }));
    if (allCorrect && !completed[l.id]) setCompleted(p => ({ ...p, [l.id]: true }));
  };

  const renderContentBlock = (block, i) => {
    if (block.type === "heading") return <div key={i} style={{ fontSize: 16, fontWeight: 700, color: "#f4f4f5", margin: "22px 0 8px" }}>{block.text}</div>;
    if (block.type === "para") return <p key={i} style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.75, margin: "0 0 12px" }}>{block.text}</p>;
    if (block.type === "callout") return <div key={i} style={{ background: block.color + "11", border: `1px solid ${block.color}33`, borderLeft: `3px solid ${block.color}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", margin: "14px 0", fontSize: 13, color: "#d4d4d8", lineHeight: 1.6 }}>{block.text}</div>;
    if (block.type === "code") return (
      <div key={i} style={{ background: "#0a0a0d", border: "1px solid #1f1f23", borderRadius: 10, padding: "12px 14px", margin: "14px 0", overflowX: "auto" }}>
        <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{block.lang}</div>
        <pre style={{ margin: 0, fontSize: 11, color: "#86efac", fontFamily: "monospace", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{block.code}</pre>
      </div>
    );
    if (block.type === "list") return (
      <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, margin: "12px 0" }}>
        {block.items.map((item, j) => (
          <div key={j} style={{ background: "#0e0e11", border: "1px solid #1f1f23", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f4f4f5", marginBottom: 3 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#71717a", lineHeight: 1.55 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    );
    return null;
  };

  const S = {
    root: { minHeight: "100vh", background: "#07070a", color: "#e4e4e7", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 80 },
    header: { borderBottom: "1px solid #18181b", padding: "22px 20px 0", maxWidth: 880, margin: "0 auto" },
    body: { maxWidth: 880, margin: "0 auto", padding: "0 20px" },
    card: (border) => ({ background: "#0e0e11", border: `1px solid ${border || "#1f1f23"}`, borderRadius: 12, padding: "14px 16px" }),
  };

  // ── DASHBOARD ──
  const Dashboard = () => (
    <div style={{ paddingTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...S.card(), display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 10, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em" }}>OS Progress</div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "#f4f4f5" }}>{osPct}<span style={{ fontSize: 14, color: "#52525b" }}>%</span></div>
          <div style={{ fontSize: 11, color: "#71717a" }}>{osDone}/{osTotal} tasks</div>
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ height: 7, borderRadius: 99, background: "#18181b", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, width: `${osPct}%`, background: "linear-gradient(90deg,#22d3ee,#a78bfa,#34d399)", transition: "width 0.4s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {Object.values(OS_TRACKS).map(t => (
              <div key={t.id} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: t.color, fontWeight: 700 }}>{trackPct(t)}%</div>
                <div style={{ fontSize: 10, color: "#52525b" }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.1em" }}>Academy XP</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#a78bfa" }}>⚡{earnedXP}</div>
          <div style={{ fontSize: 11, color: "#71717a" }}>of {totalXP}</div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, color: "#71717a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>This week · {Object.values(OS_TRACKS).reduce((a, t) => a + t.weeklyHours, 0)} hrs total</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {WEEK_PLAN.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: d.track ? "#0e0e11" : "#07070a", border: `1px solid ${d.track ? "#1f1f23" : "#0e0e11"}`, borderLeft: `3px solid ${d.track ? TRACK_COLORS[d.track] : "#111114"}`, borderRadius: "0 10px 10px 0", padding: "9px 14px" }}>
              <div style={{ width: 30, fontSize: 11, fontWeight: 700, color: d.track ? "#e4e4e7" : "#3f3f46" }}>{d.day}</div>
              <div style={{ flex: 1, fontSize: 12, color: d.track ? "#a1a1aa" : "#3f3f46" }}>{d.task}</div>
              {d.mins > 0 && <div style={{ fontSize: 11, color: d.track ? TRACK_COLORS[d.track] : "#3f3f46", fontWeight: 600 }}>{d.mins}m</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
        {Object.values(OS_TRACKS).map(t => {
          const pct = trackPct(t);
          const next = t.phases.find(ph => ph.tasks.some(tk => !osChecked[tk.id]));
          return (
            <button key={t.id} onClick={() => { setActiveTrack(t.id); setTab("tracks"); }} style={{ ...S.card(pct > 0 ? t.color + "33" : undefined), textAlign: "left", cursor: "pointer", boxShadow: pct > 0 ? `0 0 18px ${t.glow}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 11, color: t.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.label}</div>
                {PILL(`${pct}%`, t.color)}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f4f4f5", marginBottom: 2 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: "#71717a", marginBottom: 8 }}>{t.weeklyHours} hrs/week</div>
              {next && <div style={{ fontSize: 11, color: "#52525b", borderTop: "1px solid #18181b", paddingTop: 6 }}>Next → <span style={{ color: "#a1a1aa" }}>{next.title}</span></div>}
            </button>
          );
        })}
      </div>

      <div style={{ background: "#0a0f1a", border: "1px solid #1e3a5f", borderRadius: 12, padding: "12px 16px" }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Live platform</div>
        <div style={{ fontSize: 13, color: "#60a5fa" }}>intelligence.triunedynamic.com</div>
        <div style={{ fontSize: 12, color: "#4b6fa8", marginTop: 3 }}>CRM · Tender Search · Proposal Generator · Projects & Risk · Grants · AI Assistant — all live. First paying customer is the only gap.</div>
      </div>
    </div>
  );

  // ── TRACKS ──
  const TracksView = () => {
    const track = OS_TRACKS[activeTrack];
    return (
      <div style={{ paddingTop: 18 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto" }}>
          {Object.values(OS_TRACKS).map(t => (
            <button key={t.id} onClick={() => setActiveTrack(t.id)} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 10, border: `1.5px solid ${activeTrack === t.id ? t.color : "#27272a"}`, background: activeTrack === t.id ? t.color + "15" : "#0e0e11", color: activeTrack === t.id ? t.color : "#71717a", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              {t.title} · {trackPct(t)}%
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {track.phases.map((phase, pi) => {
            const phaseDone = phase.tasks.filter(t => osChecked[t.id]).length;
            const allDone = phaseDone === phase.tasks.length;
            const isOpen = expandedPhase === phase.id;
            return (
              <div key={phase.id} style={{ border: `1px solid ${isOpen ? track.color + "55" : allDone ? track.color + "33" : "#1f1f23"}`, borderRadius: 12, overflow: "hidden", background: "#0e0e11" }}>
                <button onClick={() => setExpandedPhase(isOpen ? null : phase.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: allDone ? track.color : "#18181b", border: `2px solid ${allDone ? track.color : "#27272a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: allDone ? "#07070a" : "#52525b", fontWeight: 800, flexShrink: 0 }}>{allDone ? "✓" : pi + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#f4f4f5" }}>{phase.title}</span>
                      <span style={{ fontSize: 11, color: "#52525b" }}>{phase.duration}</span>
                      {PILL(phase.priority, phase.priority === "critical" ? "#ef4444" : phase.priority === "high" ? "#f97316" : "#71717a")}
                    </div>
                    <div style={{ fontSize: 11, color: "#52525b", marginTop: 2 }}>{phaseDone}/{phase.tasks.length} tasks · {phase.hours}h</div>
                  </div>
                  <div style={{ fontSize: 16, color: "#52525b", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</div>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 15px 15px", borderTop: `1px solid ${track.color}22` }}>
                    <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                      {phase.tasks.map(task => (
                        <div key={task.id} style={{ background: osChecked[task.id] ? track.color + "0a" : "#111114", border: `1px solid ${osChecked[task.id] ? track.color + "44" : "#1f1f23"}`, borderRadius: 9, padding: "10px 12px" }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <button onClick={() => toggleTask(task.id)} style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, border: `2px solid ${osChecked[task.id] ? track.color : "#3f3f46"}`, background: osChecked[task.id] ? track.color : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#07070a", fontWeight: 900 }}>{osChecked[task.id] ? "✓" : ""}</button>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: osChecked[task.id] ? "#52525b" : "#e4e4e7", textDecoration: osChecked[task.id] ? "line-through" : "none" }}>{task.text}</div>
                              <div style={{ fontSize: 11, color: "#52525b", marginTop: 3, lineHeight: 1.5 }}>{task.detail}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, padding: "8px 12px", background: track.color + "0d", border: `1px solid ${track.color}22`, borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: track.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Phase output</div>
                      <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>{phase.output}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── BUSINESS GUIDE ──
  const BusinessGuide = () => (
    <div style={{ paddingTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#0a0f1a", border: "1px solid #1e3a5f", borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, color: "#818cf8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Core Insight</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f4f4f5", lineHeight: 1.6 }}>"You don't need Stage 5 mastery to make money from AI. Stage 2–3 skills applied to a specific problem can generate serious revenue. Start earning while you're still learning."</div>
      </div>

      <div>
        <div style={{ fontSize: 10, color: "#71717a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Revenue Models — Compared</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 440 }}>
            <thead>
              <tr style={{ background: "#18181b" }}>
                {["Model", "Revenue", "Difficulty", "Time"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: "#71717a", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #27272a" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {BIZ_MODELS.map((m, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1c1c1e" }}>
                  <td style={{ padding: "10px 12px" }}><span style={{ marginRight: 6 }}>{m.icon}</span><span style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7" }}>{m.name}</span></td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#a3e635", fontWeight: 600 }}>{m.rev}</td>
                  <td style={{ padding: "10px 12px" }}>{PILL(m.diff, m.diff === "Low" ? "#86efac" : m.diff === "Medium" ? "#fdba74" : "#fca5a5")}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#a1a1aa" }}>{m.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {BIZ_PHASES.map((b, i) => (
          <div key={i} style={{ border: "1px solid #27272a", borderLeft: `3px solid ${b.color}`, borderRadius: "0 12px 12px 0", background: "#0e0e11", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: b.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{b.phase}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#f4f4f5" }}>{b.title}</span>
              <span style={{ fontSize: 11, color: "#52525b", marginLeft: "auto" }}>{b.duration}</span>
            </div>
            {b.items.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: b.color, marginTop: 6, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.6 }}>{item}</div>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: "7px 10px", background: b.color + "0d", border: `1px solid ${b.color}22`, borderRadius: 7 }}>
              <div style={{ fontSize: 10, color: b.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Output</div>
              <div style={{ fontSize: 12, color: "#a1a1aa" }}>{b.output}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── WEEKLY REVIEW ──
  const WeeklyReview = () => (
    <div style={{ paddingTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "#0f0b02", border: "1px solid #f59e0b33", borderRadius: 12, padding: "12px 16px" }}>
        <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Weekly Review — Sunday ritual</div>
        <div style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.6 }}>10 minutes. Every Sunday. Non-negotiable. The review is where progress compounds.</div>
      </div>
      {[
        { q: "What did you ship this week?", placeholder: "Outreach sent, lesson completed, homepage updated..." },
        { q: "What's the single most important task for next week?", placeholder: "Be specific — one task, one outcome" },
        { q: "What's blocking you right now?", placeholder: "Technical, time, confidence, unclear next step..." },
      ].map((item, i) => (
        <div key={i} style={S.card()}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7", marginBottom: 8 }}>{item.q}</div>
          <textarea value={reviewAnswers[i] || ""} onChange={e => setReviewAnswers(a => ({ ...a, [i]: e.target.value }))} placeholder={item.placeholder} style={{ width: "100%", background: "#07070a", border: "1px solid #27272a", borderRadius: 8, color: "#a1a1aa", fontSize: 12, padding: "9px 11px", resize: "vertical", minHeight: 64, fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }} />
        </div>
      ))}
      <div style={S.card()}>
        <div style={{ fontSize: 10, color: "#71717a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Rules for every week</div>
        {[
          ["One outreach action per day", "#22d3ee"],
          ["One 45-min learning block", "#a78bfa"],
          ["One product task done", "#34d399"],
          ["Under 5 hours total — protect the constraint", "#71717a"],
        ].map(([rule, color], i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: "#a1a1aa" }}>{rule}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── ACADEMY HOME ──
  const AcademyHome = () => (
    <div style={{ paddingTop: 18 }}>
      <div style={{ background: "#0e0e11", border: "1px solid #1f1f23", borderRadius: 10, padding: "11px 13px", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#f4f4f5" }}>⚡ {earnedXP} / {totalXP} XP</div>
          <div style={{ fontSize: 11, color: "#52525b" }}>{allLessons.filter(l => completed[l.id]).length}/{allLessons.length} lessons</div>
        </div>
        <div style={{ height: 5, background: "#18181b", borderRadius: 99 }}>
          <div style={{ height: "100%", borderRadius: 99, width: `${totalXP > 0 ? (earnedXP / totalXP) * 100 : 0}%`, background: "linear-gradient(90deg,#6366f1,#c026d3)", transition: "width 0.4s" }} />
        </div>
      </div>
      {CURRICULUM.map(stage => {
        const isLocked = stage.stage >= 4 && !stage3Done;
        return (
          <div key={stage.stage} style={{ marginBottom: 26, opacity: isLocked ? 0.4 : 1, pointerEvents: isLocked ? "none" : "auto" }}>
            {isLocked && <div style={{ fontSize: 11, color: "#52525b", marginBottom: 6 }}>🔒 Complete Stage 3 to unlock</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: stage.color + "22", border: `2px solid ${stage.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: stage.color }}>{stage.stage}</div>
              <div>
                <div style={{ fontSize: 10, color: stage.color, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Stage {stage.stage}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f4f4f5" }}>{stage.stageTitle}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stage.lessons.map(l => (
                <button key={l.id} onClick={() => openLesson(l)} style={{ display: "flex", alignItems: "center", gap: 12, background: completed[l.id] ? stage.color + "0a" : "#0e0e11", border: `1px solid ${completed[l.id] ? stage.color + "55" : "#1f1f23"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: completed[l.id] ? stage.color : "#18181b", border: `2px solid ${completed[l.id] ? stage.color : "#27272a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, color: completed[l.id] ? "#fff" : "#52525b" }}>{completed[l.id] ? "✓" : "○"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f4f4f5", marginBottom: 3 }}>{l.title}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "#52525b" }}>📖 {l.duration}</span>
                      <span style={{ fontSize: 11, color: "#52525b" }}>🧪 {l.quiz.length}q</span>
                      <span style={{ fontSize: 11, color: "#52525b" }}>🔗 {l.resources.length}</span>
                      <span style={{ fontSize: 11, color: stage.color, fontWeight: 700 }}>+{l.xp}XP</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: "#3f3f46" }}>→</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── LESSON VIEW ──
  const LessonView = () => {
    if (!currentLesson) return null;
    const stage = CURRICULUM.find(s => s.lessons.some(l => l.id === currentLesson.id));
    const qs = quizState[currentLesson.id] || {};
    const answers = qs.answers || {};
    const submitted = qs.submitted || false;
    const score = submitted ? currentLesson.quiz.filter((q, i) => answers[i] === q.answer).length : 0;
    const allAnswered = currentLesson.quiz.every((_, i) => answers[i] !== undefined);
    return (
      <div style={{ paddingTop: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: "1px solid #18181b", marginBottom: 18 }}>
          <button onClick={closeLesson} style={{ background: "#18181b", border: "1px solid #27272a", color: "#a1a1aa", borderRadius: 7, padding: "5px 11px", cursor: "pointer", fontSize: 12 }}>← Back</button>
          <div style={{ fontSize: 11, color: stage.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", flex: 1 }}>Stage {stage.stage} · {stage.stageTitle}</div>
          {completed[currentLesson.id] && <div style={{ fontSize: 11, color: "#34d399", fontWeight: 700 }}>✓ +{currentLesson.xp}XP</div>}
        </div>
        <h2 style={{ fontSize: "clamp(16px,3vw,22px)", fontWeight: 800, color: "#f4f4f5", letterSpacing: "-0.02em", margin: "0 0 4px" }}>{currentLesson.title}</h2>
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <span style={{ fontSize: 12, color: "#52525b" }}>📖 {currentLesson.duration}</span>
          <span style={{ fontSize: 12, color: stage.color, fontWeight: 700 }}>+{currentLesson.xp} XP on completion</span>
        </div>
        <div style={{ marginBottom: 28 }}>{currentLesson.content.map((b, i) => renderContentBlock(b, i))}</div>
        <div style={{ ...S.card(), marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "#71717a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Free resources</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {currentLesson.resources.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, background: "#07070a", border: `1px solid ${R_COLORS[r.type]}33`, borderRadius: 9, padding: "9px 12px", textDecoration: "none" }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{R_ICONS[r.type]}</span>
                <div style={{ flex: 1, fontSize: 12, color: "#e4e4e7" }}>{r.title}</div>
                <div style={{ fontSize: 9, color: R_COLORS[r.type], fontWeight: 700, textTransform: "uppercase", background: R_COLORS[r.type] + "22", padding: "2px 7px", borderRadius: 99 }}>{r.type}</div>
                <span style={{ fontSize: 13, color: "#52525b" }}>↗</span>
              </a>
            ))}
          </div>
        </div>
        <div style={{ background: "#0e0e11", border: `1px solid ${stage.color}33`, borderRadius: 12, padding: "16px" }}>
          <div style={{ fontSize: 11, color: stage.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Knowledge check</div>
          <div style={{ fontSize: 12, color: "#71717a", marginBottom: 16 }}>Answer all {currentLesson.quiz.length} correctly to earn {currentLesson.xp} XP.</div>
          {currentLesson.quiz.map((q, qi) => {
            const chosen = answers[qi];
            return (
              <div key={qi} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", marginBottom: 8 }}>Q{qi + 1}. {q.q}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {q.options.map((opt, oi) => {
                    const isChosen = chosen === oi;
                    const showRight = submitted && oi === q.answer;
                    const showWrong = submitted && isChosen && oi !== q.answer;
                    return (
                      <button key={oi} onClick={() => !submitted && handleQuizAnswer(currentLesson.id, qi, oi)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${showRight ? "#34d399" : showWrong ? "#ef4444" : isChosen ? stage.color : "#27272a"}`, background: showRight ? "#052e1666" : showWrong ? "#2d0a0a" : isChosen ? stage.color + "15" : "#07070a", cursor: submitted ? "default" : "pointer", textAlign: "left" }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, border: `2px solid ${showRight ? "#34d399" : showWrong ? "#ef4444" : isChosen ? stage.color : "#3f3f46"}`, background: isChosen ? (showRight ? "#34d399" : showWrong ? "#ef4444" : stage.color) : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#07070a", fontWeight: 900 }}>{isChosen ? (showRight ? "✓" : "✗") : ""}</div>
                        <span style={{ fontSize: 12, color: showRight ? "#86efac" : showWrong ? "#fca5a5" : "#d4d4d8" }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <div style={{ marginTop: 6, padding: "7px 10px", background: answers[qi] === q.answer ? "#052e1655" : "#2d0a0a55", borderRadius: 7, border: `1px solid ${answers[qi] === q.answer ? "#34d39933" : "#ef444433"}` }}>
                    <div style={{ fontSize: 11, color: answers[qi] === q.answer ? "#86efac" : "#fca5a5", lineHeight: 1.5 }}>{q.explain}</div>
                  </div>
                )}
              </div>
            );
          })}
          {!submitted ? (
            <button onClick={() => submitQuiz(currentLesson)} disabled={!allAnswered} style={{ padding: "10px 22px", borderRadius: 8, border: "none", background: allAnswered ? stage.color : "#18181b", color: allAnswered ? "#fff" : "#52525b", fontSize: 13, fontWeight: 700, cursor: allAnswered ? "pointer" : "not-allowed" }}>
              {allAnswered ? "Submit answers" : `Answer all ${currentLesson.quiz.length} to submit`}
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ padding: "9px 16px", borderRadius: 8, background: score === currentLesson.quiz.length ? "#052e16" : "#2d0a0a", border: `1px solid ${score === currentLesson.quiz.length ? "#34d399" : "#ef4444"}`, fontSize: 13, fontWeight: 700, color: score === currentLesson.quiz.length ? "#86efac" : "#fca5a5" }}>
                {score}/{currentLesson.quiz.length} {score === currentLesson.quiz.length ? `· +${currentLesson.xp}XP 🎉` : "incorrect"}
              </div>
              {score < currentLesson.quiz.length && <button onClick={() => setQuizState(p => ({ ...p, [currentLesson.id]: {} }))} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #27272a", background: "#18181b", color: "#a1a1aa", fontSize: 13, cursor: "pointer" }}>Try again</button>}
              {completed[currentLesson.id] && <button onClick={closeLesson} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: stage.color, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>← Curriculum</button>}
            </div>
          )}
        </div>
      </div>
    );
  };

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "tracks", label: "Tracks", icon: "⬡" },
    { id: "business", label: "Business", icon: "◎" },
    { id: "academy", label: "Academy", icon: "★" },
    { id: "review", label: "Review", icon: "✦" },
  ];

  return (
    <div style={S.root}>
      <div style={S.header}>
        <div style={{ fontSize: 10, color: "#3f3f46", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 5 }}>Sam · Triune Dynamic · Full OS</div>
        <h1 style={{ margin: "0 0 2px", fontSize: "clamp(20px,4vw,28px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Sam's{" "}
          <span style={{ background: "linear-gradient(90deg,#22d3ee,#a78bfa,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Triune OS</span>
        </h1>
        <p style={{ margin: "0 0 0", fontSize: 12, color: "#52525b" }}>Dashboard · Tracks · Business · Academy · Review — all in one</p>
        <div style={{ display: "flex", gap: 2, marginTop: 16, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); if (t.id !== "academy") setAcademyView("home"); }} style={{ padding: "7px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: tab === t.id ? "#111114" : "transparent", color: tab === t.id ? "#e4e4e7" : "#52525b", borderRadius: "8px 8px 0 0", borderTop: tab === t.id ? "1.5px solid #27272a" : "none", borderLeft: tab === t.id ? "1.5px solid #27272a" : "none", borderRight: tab === t.id ? "1.5px solid #27272a" : "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={S.body}>
        {tab === "dashboard" && <Dashboard />}
        {tab === "tracks" && <TracksView />}
        {tab === "business" && <BusinessGuide />}
        {tab === "academy" && academyView === "home" && <AcademyHome />}
        {tab === "academy" && academyView === "lesson" && <LessonView />}
        {tab === "review" && <WeeklyReview />}
      </div>
    </div>
  );
}
