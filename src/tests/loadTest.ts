import http from "k6/http";
import { check } from "k6";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

// Define test options
export const options = {
  scenarios: {
    moderate_load_test: {
      executor: "constant-arrival-rate",
      rate: 50, // 50 requests per second
      timeUnit: "1s",
      duration: "1m",
      preAllocatedVUs: 500,
      maxVUs: 1000, // Scale up to 1000 users
    },
  },
};

// 100 different random messages
const messages = [
  "Let's start a startup?",
  "How do I become successful?",
  "Tell me about Facebook",
  "What's your opinion on coding?",
  "Can we change the world?",
  "What is the future of AI?",
  "How do I learn JavaScript?",
  "Tell me a joke about programmers",
  "What do you think about remote work?",
  "Why is Python so popular?",
  "Explain blockchain to me",
  "Is Elon Musk an alien?",
  "Why do people use React?",
  "Should I invest in crypto?",
  "What's the best programming language?",
  "How do I get better at coding?",
  "What is Web3?",
  "What are some startup ideas?",
  "Can AI replace humans?",
  "What is the metaverse?",
  "How do I become a billionaire?",
  "What's the best way to learn coding?",
  "How do startups get funding?",
  "Why is open-source important?",
  "Can anyone be an entrepreneur?",
  "What is your advice for a new developer?",
  "Should I go to college for CS?",
  "What is the meaning of life?",
  "Why is JavaScript so popular?",
  "How do I get my first coding job?",
  "What's the hardest part about programming?",
  "How do I start freelancing?",
  "Is software development a good career?",
  "What are some underrated programming languages?",
  "How does an API work?",
  "What is an MVP in startups?",
  "How do I scale my business?",
  "Should I learn AI and ML?",
  "What makes a good programmer?",
  "Why are startups risky?",
  "What’s the next big thing in tech?",
  "Should I learn TypeScript?",
  "What’s the difference between frontend and backend?",
  "How do I handle imposter syndrome?",
  "What makes a good leader?",
  "Is entrepreneurship for everyone?",
  "What do you think about hustle culture?",
  "How do I stay productive?",
  "What’s the best tech stack for a startup?",
  "How do I hire the right people?",
  "What is a unicorn startup?",
  "How does funding work in startups?",
  "What’s the biggest mistake startups make?",
  "How do I validate a startup idea?",
  "What’s the role of a CTO?",
  "How do I build a strong team?",
  "Why do most startups fail?",
  "How can I build a personal brand?",
  "What’s the future of work?",
  "How do I negotiate my salary?",
  "Is coding still in demand?",
  "Should I work at a startup or a big company?",
  "How do I deal with failure?",
  "What’s the best tech book to read?",
  "How do I start coding?",
  "What’s the best way to learn SQL?",
  "How do I improve my problem-solving skills?",
  "What’s the best way to stay updated in tech?",
  "Should I learn multiple programming languages?",
  "What’s the difference between a startup and a small business?",
  "How do I deal with stress in tech?",
  "What’s the best way to prepare for a tech interview?",
  "How do I start a YouTube channel?",
  "What are some good side hustle ideas?",
  "Should I build a personal website?",
  "What’s the best way to network in tech?",
  "How do I get clients for my freelance business?",
  "What’s the most valuable skill in tech?",
  "Should I learn data science?",
  "How do I build a strong LinkedIn profile?",
  "What are some essential soft skills for programmers?",
  "What’s the best way to learn Git?",
  "How do I start a blog?",
  "What’s the best free resource for learning coding?",
  "Should I contribute to open source?",
  "How do I become a full-stack developer?",
  "What’s the best online course for coding?",
  "Should I get a coding mentor?",
  "How do I prepare for a coding bootcamp?",
  "What’s the best way to learn algorithms?",
  "Should I learn cloud computing?",
  "How do I become a better public speaker?",
  "What’s the best way to write a resume for tech jobs?",
  "How do I become a CTO?",
  "Should I learn cybersecurity?",
  "What’s the best way to find co-founders?",
  "How do I raise money for my startup?",
  "What’s the best productivity hack?",
  "How do I market my startup?",
  "What’s the best way to get customers?",
  "How do I make my startup stand out?",
];

// Define API URL
const url = "http://localhost:3000/api/chat";

export default function () {
  const payload = JSON.stringify({
    character: "MARK",
    userMessage: randomItem(messages),
    movieName: "The Social Network",
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}
