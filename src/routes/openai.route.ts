import openaiController from "@/controllers/openai.controller";
import express from "express";

const router = express.Router();

router.post("/chat", openaiController.chatWithBot);

export default router;
