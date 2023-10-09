import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const designSchema = new Schema(
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
designSchema.plugin(mongoosePaginate);

const Design = mongoose.models.Design || mongoose.model('Design', designSchema);
export default Design;
