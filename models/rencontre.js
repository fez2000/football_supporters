const mongoose = require("mongoose");

const { Schema } = mongoose;

const RencontreSchema = new Schema(
    {
        date: {
            type: Date,
            required: true
        },
        but1: {
            type: Number,
            default: 0
        },
        but2: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["jouer", "wait"],
            default: "wait"
        },
        resumer: {
            type: String,
            trim: true
        },
        edition: { type: Schema.Types.ObjectId, ref: "Edition" },
        equipe1: { type: Schema.Types.ObjectId, ref: "Equipe" },
        equipe2: { type: Schema.Types.ObjectId, ref: "Equipe" }
    },
    { sparse: true, unique: true, index: true }
);

mongoose.model("Rencontre", RencontreSchema);
