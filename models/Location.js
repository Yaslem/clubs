import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const locationSchema = new Schema(
    {
        locationId: {
            type: Number,
            default: null,
        },
        name: {
            type: String,
            required: true
        },
        des: {
            type: String,
            default: null
        }
    }
);

locationSchema.virtual('activitiesCount', {
    ref: 'Activity',
    localField: '_id',
    foreignField: 'location',
    count: true,
});
locationSchema.virtual('activities', {
    ref: 'Activity',
    localField: '_id',
    foreignField: 'location',
});
locationSchema.plugin(mongoosePaginate);
locationSchema.set('toObject', { virtuals: true });
locationSchema.set('toJSON', { virtuals: true });

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);
export default Location;
