import mongoose, { Schema } from "mongoose";

const clarityStatSchema = new Schema(
  {
    date: { type: String, required: true, unique: true }, // YYYY-MM-DD
    sessions: { type: Number, default: 0 },
    visitors: { type: Number, default: 0 }, // distinct users
    botSessions: { type: Number, default: 0 },
    lastSyncedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const ClarityStat = mongoose.models.ClarityStat || mongoose.model("ClarityStat", clarityStatSchema);

export default ClarityStat;
