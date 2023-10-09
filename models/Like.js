import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const likeSchema = new Schema(
    {
        post: { type: Schema.Types.ObjectId, ref: 'Post'},
        user: { type: Schema.Types.ObjectId, ref: 'User'},
    }
);

likeSchema.plugin(mongoosePaginate);
likeSchema.set('toObject', { virtuals: true });
likeSchema.set('toJSON', { virtuals: true });

const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);
export default Like;
