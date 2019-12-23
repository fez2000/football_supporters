/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema(
    {
        creator_id: { type: Schema.Types.ObjectId },
        text: { type: String, trim: true },
        title: { type: String, trim: true },
        documents: [{ type: Schema.Types.ObjectId, ref: 'Doc' }],
        time_create: { type: Date },
        time_update: { type: Date },
        tags: { type: String, trim: true }
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Post', PostSchema);
