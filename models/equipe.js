const mongoose = require("mongoose");

const { Schema } = mongoose;

const EquipeSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        pays: {
            type: String,
            trim: true
        },
        ville: {
            type: String,
            trim: true
        },
        coach: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        edition: { type: Schema.Types.ObjectId, ref: "Edition" },
        image: {
            type: Schema.Types.ObjectId,
            ref: "Doc",
        }
    },
    { sparse: true, unique: true, index: true }
);

mongoose.model("Equipe", EquipeSchema);
