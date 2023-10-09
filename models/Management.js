import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const managementSchema = new Schema(
    {
        club: { type: Schema.Types.ObjectId, ref: 'Club'},
        user: { type: Schema.Types.ObjectId, ref: 'User'},
    }
);

managementSchema.plugin(mongoosePaginate);
managementSchema.set('toObject', { virtuals: true });
managementSchema.set('toJSON', { virtuals: true });

const Management = mongoose.models.Management || mongoose.model('Management', managementSchema);
export default Management;
