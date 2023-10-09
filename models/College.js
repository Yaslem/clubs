import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const collegeSchema = new Schema(
    {
        collegeId: {
            type: Number,
            default: null,
        },
        name: {
            type: String,
            required: true
        },
    }
);

collegeSchema.virtual('studentsCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'college',
    count: true,
});
collegeSchema.virtual('students', {
    ref: 'User',
    localField: '_id',
    foreignField: 'college',
});
collegeSchema.plugin(mongoosePaginate);
collegeSchema.set('toObject', { virtuals: true });
collegeSchema.set('toJSON', { virtuals: true });

const College = mongoose.models.College || mongoose.model('College', collegeSchema);
export default College;
