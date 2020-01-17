const mongoose = require("mongoose");

const { Schema } = mongoose;

const EditionSchema = new Schema(
    {
        time_create: { type: Date, default: new Date() },
        time_update: { type: Date, default: new Date() },
        date: {
            type: String,
            trim: true,
            required: true,
            lowercase: true
        },
        time_start: {
            type: Date,
            required: true
        },
        time_end: {
            type: Date,
            required: true
        },
        number_team: {
            type: Number,
            required: true
        },
        is_end: {
            type: Boolean,
            default: false
        },
        rules: {
            type: String,
            required: true
        }
    },
    { sparse: true, unique: true, index: true }
);

mongoose.model("Edition", EditionSchema);
