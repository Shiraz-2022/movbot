# 🔥 AI Movie Character Chatbot - Internship Ladder Challenge 🚀

## 📌 Project Overview

This project is a **chatbot** that interacts as movie characters based on real movie scripts. It progressively improves by integrating **database storage, RAG (Retrieval-Augmented Generation), vector search, caching, scaling, and deployment**.

### 🎯 **Goals:**

- Allow users to chat with movie characters in a realistic manner.
- Retrieve dialogues from movie scripts before generating AI responses.
- Scale the system to handle high traffic efficiently.
- Deploy a production-ready chatbot with **WebSocket support** for real-time interaction.

---

## 🚀 **Setup & Installation**

### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/Shiraz-2022/movbot.git
cd movie-chatbot
```

### 2️⃣ **Install Dependencies**

```bash
npm install
```

### 3️⃣ **Run in Development Mode**

```bash
npm run dev
```

### 4️⃣ **Run in Production Mode**

```bash
npm start
```

---

## 🌍 **Deployment Details**

- **Production URL:** `http://ec2-13-200-15-25.ap-south-1.compute.amazonaws.com`
- **Localhost:** `http://localhost:3000`

**Switch Base URL in API Requests Accordingly!**

---

## 🏗️ **Tech Stack**

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Model:** OpenAI GPT API
- **Vector Search:** Pinecone
- **Caching & Scaling:** Redis
- **WebSockets:** Socket.io
- **Deployment:** AWS EC2

---

## 📜 **Movie Script Handling**

- Scripts are **scraped & stored** in a database.
- Dialogue retrieval is **prioritized** over AI-generated responses.
- **Script source:** [The Social Network](https://imsdb.com/scripts/Social-Network,-The.html)

---

## 🔥 **Ladder Challenge Implementation**

| Level | Task                                | Status  |
| ----- | ----------------------------------- | ------- |
| 1️⃣    | Basic API Chatbot                   | ✅ Done |
| 2️⃣    | Store & Retrieve Movie Script Data  | ✅ Done |
| 3️⃣    | Implement RAG with Vector Search    | ✅ Done |
| 4️⃣    | Scale System to Handle High Traffic | ✅ Done |
| 5️⃣    | Optimize for Latency & Deploy       | ✅ Done |
| 🎁    | Bonus: WebSockets                   | ✅ Done |

---

## 🔗 **Additional Resources**

- **API Documentation:** See [`API_DOCS.md`](./API_DOCS.md)
- **Movie Script Source:**
  - [IMSDb](https://www.imsdb.com/)
