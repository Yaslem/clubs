import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const levelSchema = new Schema(
    {
        levelId: {
            type: Number,
            default: null,
        },
        name: {
            type: String,
            required: true
        },
    }
);

levelSchema.virtual('studentsCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'level',
    count: true,
});
levelSchema.virtual('students', {
    ref: 'User',
    localField: '_id',
    foreignField: 'level',
});
levelSchema.plugin(mongoosePaginate);
levelSchema.set('toObject', { virtuals: true });
levelSchema.set('toJSON', { virtuals: true });

const Level = mongoose.models.Level || mongoose.model('Level', levelSchema);
export default Level;
