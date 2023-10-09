import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const replySchema = new Schema(
    {
        contact: {
            type: Schema.Types.ObjectId,
            ref: "Contact",
            default: null
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        body: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

replySchema.plugin(mongoosePaginate);
replySchema.set('toObject', { virtuals: true });
replySchema.set('toJSON', { virtuals: true });

const Reply = mongoose.models.Reply || mongoose.model('Reply', replySchema);
export default Reply;
