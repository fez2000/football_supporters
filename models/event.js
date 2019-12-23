const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventSchema = new Schema(
    {
        time_create: { type: Date },
        time_update: { type: Date },
        tags: {
            type: String,
        },
        link: {
            type: String, trim: true,
        },
        title: {
            type: String, trim: true, required: true,
        },
        type: {
            type: String, trim: true, required: true, lowercase: true,
        },
        description: {
            type: String, trim: true, required: true, lowercase: true,
        },
        document: { type: Schema.Types.ObjectId, ref: 'Doc' },

       
    },
    { sparse: true, unique: true, index: true },
);

mongoose.model('Event', EventSchema);