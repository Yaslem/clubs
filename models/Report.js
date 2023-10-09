import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const reportSchema = new Schema(
    {
        reportId : {
            type: Number,
            default: null,
        },
        summary : {
            type: String,
            required: true
        },
        notes : {
            type: String,
        },
        numbers : {
            type: String,
            required: true
        },
        images: {
            type: String,
            default: null
        },
        club: {
            type: Schema.Types.ObjectId,
            ref: "Club",
            required: true
        },
        activity: {
            type: Schema.Types.ObjectId,
            ref: "Activity",
            required: true
        },
        user : {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true
    }
);
reportSchema.plugin(mongoosePaginate);

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;
