const mongoose = require("mongoose");

const { Schema } = mongoose;

const MatchSchema = new Schema(
    {
        point1: {
            type: Number,
            default: 0
        },
        point2: {
            type: Number,
            default: 0
        },
        resumer: {
            type: String,
            trim: true
        },
        edition: { type: Schema.Types.ObjectId, ref: "Edition" },
        recontre1: { type: Schema.Types.ObjectId, ref: "Rencontre" },
        recontre2: { type: Schema.Types.ObjectId, ref: "Rencontre" }
    },
    { sparse: true, unique: true, index: true }
);

mongoose.model("Match", MatchSchema);
