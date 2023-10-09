import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new Schema(
    {
        contactId : {
            type: Number,
            default: null,
        },
        title : {
            type: String,
            required: true
        },
        body : {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['completed', 'canceled', 'pending'],
            default: 'pending',
            required: true
        },
        image: {
            type: String,
            default: null
        },
        type: {
            type: String,
            default: null
        },
        club: {
            type: Schema.Types.ObjectId,
            ref: "Club",
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
contactSchema.virtual('repliesCount', {
    ref: 'Reply',
    localField: '_id',
    foreignField: 'contact',
    count: true,
});
contactSchema.virtual('replies', {
    ref: 'Reply',
    localField: '_id',
    foreignField: 'contact',
});
contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export default Contact;
