import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const timeSchema = new Schema(
    {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        },
    }
);
timeSchema.plugin(mongoosePaginate);
timeSchema.set('toObject', { virtuals: true });
timeSchema.set('toJSON', { virtuals: true });

const Time = mongoose.models.Time || mongoose.model('Time', timeSchema);
export default Time;
