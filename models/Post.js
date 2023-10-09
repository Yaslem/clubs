import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const postSchema = new Schema(
    {
        postId : {
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
        image: {
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
postSchema.virtual('likesCount', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'post',
    count: true,
});
postSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'post',
});
postSchema.virtual('commentsCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    count: true,
});
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
});
postSchema.plugin(mongoosePaginate);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;
