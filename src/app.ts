import express from "express";
import dotenv from "dotenv";

import openaiRoutes from "@/routes/openai.route";
import { errorHandler } from "@/middlewares/errorHandler.middleware";
import routeHandler from "./middlewares/routeHandler.middleware";
import connectMongoDB from "@/configs/mongodb";

const app = express();
dotenv.config();

connectMongoDB();
//middlewares
app.use(express.json());
app.use(routeHandler);

//routes
app.use("/api/openai", openaiRoutes);

app.use(errorHandler);

app.listen(3000, () => console.log("Server is running on port 3000"));

export default app;
