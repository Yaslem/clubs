import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const countrySchema = new Schema(
    {
        countryId: {
            type: Number,
            default: null,
        },
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            default: null
        },
    }
);

countrySchema.virtual('studentsCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'country',
    count: true,
});
countrySchema.virtual('students', {
    ref: 'User',
    localField: '_id',
    foreignField: 'country',
});
countrySchema.plugin(mongoosePaginate);
countrySchema.set('toObject', { virtuals: true });
countrySchema.set('toJSON', { virtuals: true });

const Country = mongoose.models.Country || mongoose.model('Country', countrySchema);
export default Country;
