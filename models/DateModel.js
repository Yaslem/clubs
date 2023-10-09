import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const dateSchema = new Schema(
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
dateSchema.plugin(mongoosePaginate);
dateSchema.set('toObject', { virtuals: true });
dateSchema.set('toJSON', { virtuals: true });

const DateModel = mongoose.models.DateModel || mongoose.model('DateModel', dateSchema);
export default DateModel;
