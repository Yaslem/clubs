import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const attendSchema = new Schema(
    {
        attendId: {
            type: Number,
            default: null,
        },
        benefit: {
            type: String,
            enum: ['1', '2', '3', '4', '5'],
            required: true,
            default: '1',
        },
        lecturer: {
            type: String,
            enum: ['1', '2', '3', '4', '5'],
            required: true,
            default: '1',
        },
        attended: {
            type: String,
            enum: ['جميعها','أغلبها','بعضها','لا شيء منها', 'نصفها'],
            required: true,
            default: 'لا شيء منها',
        },
        suggestions: {
            type: String,
            default: null
        },
        utility: {
            type: String,
            default: null
        },
        activity: {
            type: Schema.Types.ObjectId,
            ref: "Activity",
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        club: {
            type: Schema.Types.ObjectId,
            ref: "Club",
            default: null
        },
    },
    {
        timestamps: true
    }
);
attendSchema.plugin(mongoosePaginate);

const Attend = mongoose.models.Attend || mongoose.model('Attend', attendSchema);
export default Attend;
