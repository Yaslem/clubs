import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const administrativeSchema = new Schema(
    {
        administrativeId: {
            type: Number,
            default: null
        },
        name: {
            type: String,
            required: true
        },
    }
);

administrativeSchema.virtual('studentsCount', {
    ref: 'AdministrativeClub',
    localField: '_id',
    foreignField: 'administrative',
    count: true,
});
administrativeSchema.virtual('students', {
    ref: 'AdministrativeClub',
    localField: '_id',
    foreignField: 'administrative',
});
administrativeSchema.plugin(mongoosePaginate);
administrativeSchema.set('toObject', { virtuals: true });
administrativeSchema.set('toJSON', { virtuals: true });

const Administrative = mongoose.models.Administrative || mongoose.model('Administrative', administrativeSchema);
export default Administrative;
