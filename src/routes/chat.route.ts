import openaiController from "@/controllers/chat.controller";
import express from "express";

const router = express.Router();

router.post("/", openaiController.chatWithBot);
router.get("/:userId", openaiController.getChats);

export default router;
