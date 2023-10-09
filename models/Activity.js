import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const activitySchema = new Schema(
    {
        activityId : {
            type: Number,
            default: null,
        },
        title : {
            type: String,
            required: true
        },
        presenter : {
            type: String,
            required: true
        },
        notes : String,
        status: {
            type: String,
            enum: ['أقيمت', 'لم تقم', 'ملغاة', 'مؤجلة', 'تم الطلب', 'تم الحجز'],
            default: 'تم الطلب'
        },
        date : {
            type: Date,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to : {
            type: String,
            required: true
        },
        isAttend : {
            type: Boolean,
            default: false,
            required: true
        },
        hospitality : {
            type: Boolean,
            default: false,
            required: true
        },
        isShare: {
            type: Boolean,
            default: false,
            required: true
        },
        isDiscourse: {
            type: Boolean,
            default: false,
            required: true
        },
        isDesign: {
            type: Boolean,
            default: false,
            required: true
        },
        projector: {
            type: Boolean,
            default: false,
            required: true
        },
        location: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true
        },
        club: {
            type: Schema.Types.ObjectId,
            ref: "Club",
            required: true
        },
        clubShare: {
            type: Schema.Types.ObjectId,
            ref: "Club",
            default: null,
        },
        type : {
            type: Schema.Types.ObjectId,
            ref: "Type",
            required: true
        },
    },
    {
        timestamps: true
    }
);
activitySchema.plugin(mongoosePaginate);
activitySchema.set('toObject', { virtuals: true });
activitySchema.set('toJSON', { virtuals: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
export default Activity;
