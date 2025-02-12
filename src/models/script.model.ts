import mongoose, { Schema } from "mongoose";
import { IScript } from "@/types/model";

const ScriptSchema: Schema = new Schema({
  character: { type: String, required: true },
  dialog: { type: String },
  movieTitle: { type: String, required: true },
});

const Script = mongoose.model<IScript>("Script", ScriptSchema);

export default Script;
