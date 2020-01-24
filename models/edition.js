const mongoose = require("mongoose");

const { Schema } = mongoose;

const EditionSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        slogan: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        nombre_participant: {
            type: Number,
            trim: true
        },
        date_debut: {
            type: Date,
            trim: true,
            required: true
        },
        date_fin: {
            type: Date,
            trim: true,
            required: true
        },
        is_end: {
            type: Boolean,
            default: false
        }
    },
    { sparse: true, unique: true, index: true }
);

mongoose.model("Edition", EditionSchema);
