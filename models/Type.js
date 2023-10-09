import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const typeSchema = new Schema(
    {
        typeId: {
            type: Number,
            default: null,
        },
        name: {
            type: String,
            required: true
        },
    }
);

typeSchema.virtual('activitiesCount', {
    ref: 'Activity',
    localField: '_id',
    foreignField: 'type',
    count: true,
});
typeSchema.virtual('activities', {
    ref: 'Activity',
    localField: '_id',
    foreignField: 'type',
});
typeSchema.plugin(mongoosePaginate);
typeSchema.set('toObject', { virtuals: true });
typeSchema.set('toJSON', { virtuals: true });

const Type = mongoose.models.Type || mongoose.model('Type', typeSchema);
export default Type;
