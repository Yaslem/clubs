import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const awardSchema = new Schema(
    {
        awardId: {
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
awardSchema.virtual('studentsCount', {
    ref: 'AwardAndUser',
    localField: '_id',
    foreignField: 'award',
    count: true,
});
awardSchema.virtual('students', {
    ref: 'AwardAndUser',
    localField: '_id',
    foreignField: 'award',
});
awardSchema.plugin(mongoosePaginate);
awardSchema.set('toObject', { virtuals: true });
awardSchema.set('toJSON', { virtuals: true });

const Award = mongoose.models.Award || mongoose.model('Award', awardSchema);
export default Award;
