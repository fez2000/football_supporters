const mongoose = require("mongoose");

const { Schema } = mongoose;

const CompetitionSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true
        },
        philosophie: {
            type: String,
            trim: true
        },
        userules: {
            type: String,
            trim: true
        }
    },
    { sparse: true, unique: true, index: true }
);

mongoose.model("Competition", CompetitionSchema);
