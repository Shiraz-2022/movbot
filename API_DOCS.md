# 📜 AI Movie Character Chatbot - API Documentation

## 🌐 **Base URLs**

- **Production:** `http://ec2-13-200-15-25.ap-south-1.compute.amazonaws.com`
- **Localhost:** `http://localhost:3000`

---

## 🔥 **REST API Documentation**

### 📌 **1. Chat with Movie Character**

**Endpoint:**

```http
POST /chat
```

**Request Body:**

```json
{
  "character": "MARK",
  "userMessage": "You're going to introduce me, right?",
  "movieName": "The Social Network"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Chat generated successfully",
  "result": {
    "response": "Yeah, I mean, I want to be clear that I think it's important for you to meet these people. It’ll open up so many doors. So, yeah, I’ll introduce you. Just trust me on this."
  }
}
```

---

### 📌 **2. Get Chat History of a User**

**Endpoint:**

```http
GET /api/chat/:userId
```

**Request Example:**

```http
GET {{base_url}}/api/chat/1
```

**Response:**

```json
{
  "success": true,
  "message": "Chats retrieved successfully",
  "result": {
    "chats": [
      {
        "movieName": "The Social Network",
        "characterName": "MARK",
        "messages": [
          {
            "sender": "user",
            "message": "what should we do?",
            "_id": "67b1955a6dec03fe9dca707d",
            "timestamp": "2025-02-16T07:35:54.543Z"
          },
          {
            "sender": "ai",
            "message": "I mean, what do you want to do? Right now. Think about it. I mean, what's the plan? Why not just settle on something?",
            "_id": "67b1955c6dec03fe9dca707f",
            "timestamp": "2025-02-16T07:35:56.371Z"
          }
        ],
        "_id": "67b194e36dec03fe9dca705a"
      }
    ]
  }
}
```

**Notes:**

- Retrieves all past chat conversations for a given `userId`.
- Each conversation contains messages exchanged between the **user** and **AI**.

---

## 🔥 **WebSocket API Documentation**

### 🌐 **Connection Details**

- **WebSocket URL:**
  ```ws
  ws://ec2-13-200-15-25.ap-south-1.compute.amazonaws.com
  ```

### 📌 **Events & Message Format**

| Event Name     | Direction           | Description              |
| -------------- | ------------------- | ------------------------ |
| `userMessage`  | **Client → Server** | Send a chat message      |
| `chatResponse` | **Server → Client** | Receive chatbot response |

---

### 📌 **1. Sending a Message**

**Event:** `userMessage`

**Request Format:**

```json
{
  "userId": 1,
  "character": "MARK",
  "userMessage": "You're going to introduce me, right?",
  "movieName": "The Social Network"
}
```

---

### 📌 **2. Receiving a Response**

**Event:** `chatResponse`

**Response Format:**

```json
{
  "message": "Well, of course! I've always got your back, buddy. Just let me take the lead, and we’ll make a grand entrance. You ready? Let’s do this!"
}
```

---

## 🚀 **How to Use WebSockets in Postman**

### **1️⃣ Establish a WebSocket Connection**

1. Open **Postman** and select **New WebSocket Request**.
2. Enter the WebSocket URL:
   ```
   ws://ec2-13-200-15-25.ap-south-1.compute.amazonaws.com
   ```
3. Click **Connect**.

### **2️⃣ Send a Message**

1. In the **Messages** section, send a message in the following format:
   ```json
   {
     "userId": 1,
     "character": "MARK",
     "userMessage": "You're going to introduce me, right?",
     "movieName": "The Social Network"
   }
   ```
2. Press **Send**.

### **3️⃣ Listen for Chatbot Responses**

- Wait for a response on the `chatResponse` event.

---

## 📌 **Postman Collection**

📥 **[Download Postman Collection](./postman_collection.json)**
