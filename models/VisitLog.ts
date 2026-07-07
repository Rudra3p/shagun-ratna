import mongoose, { Schema } from "mongoose";

const visitLogSchema = new Schema(
  {
    date: { type: String, required: true, unique: true }, // YYYY-MM-DD (UTC)
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const VisitLog = mongoose.models.VisitLog || mongoose.model("VisitLog", visitLogSchema);

export default VisitLog;
