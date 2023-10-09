import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const resultSchema = new Schema(
    {
        number: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        result: {
            type: String,
            required: true,
        },
        year : {
            type: Schema.Types.ObjectId,
            ref: "Year",
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
resultSchema.plugin(mongoosePaginate);

const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);
export default Result;
