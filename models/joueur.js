const mongoose = require("mongoose");

const { Schema } = mongoose;

const JoueurSchema = new Schema(
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
        poste: {
            type: String,
            trim: true
        },
        ville: {
            type: String,
            trim: true
        },
        age: {
            type: Number,
            max: 50,
            min: 1
        },
        description: {
            type: String,
            trim: true
        },
        edition: { type: Schema.Types.ObjectId, ref: "Edition" },
        equipe: { type: Schema.Types.ObjectId, ref: "Equipe" },
        image: {
            type: Schema.Types.ObjectId,
            ref: "Doc"
        }
    },
    { sparse: true, unique: true, index: true }
);

mongoose.model("Joueur", JoueurSchema);
