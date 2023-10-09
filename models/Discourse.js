import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const discourseSchema = new Schema(
    {
        status: {
            type: String,
            enum: ['completed', 'canceled', 'pending'],
            default: 'pending',
            required: true
        },
        notes: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            required: true,
        },
        side: {
            type: String,
            required: true,
        },
        numbers: {
            type: Number,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        activity : {
            type: Schema.Types.ObjectId,
            ref: "Activity",
            required: true
        },
        club : {
            type: Schema.Types.ObjectId,
            ref: "Club",
            required: true
        },
    },
    {
        timestamps: true
    }
);
discourseSchema.plugin(mongoosePaginate);

const Discourse = mongoose.models.Discourse || mongoose.model('Discourse', discourseSchema);
export default Discourse;
