import mongoose from "mongoose";

const msgSchema = mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Msg = mongoose.model("Msg", msgSchema);
export default Msg;
