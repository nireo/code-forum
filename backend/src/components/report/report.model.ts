import mongoose from "mongoose";
import Report from "./report.interface";

const reportSchema: mongoose.Schema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const report = mongoose.model<Report & mongoose.Document>(
  "Report",
  reportSchema
);
export default report;
