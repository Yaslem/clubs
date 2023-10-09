import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const commentSchema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            default: null
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        club: {
            type: Schema.Types.ObjectId,
            ref: "Club",
            default: null
        },
        body: {
            type: String,
            required: true
        },
        isPublished: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

commentSchema.plugin(mongoosePaginate);
commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
export default Comment;
