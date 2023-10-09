import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const certificateAndActivitySchema = new Schema(
    {
        certificateId : {
            type: Number,
            default: null,
        },
        activityId : {
            type: Schema.Types.ObjectId,
            ref: 'Activity',
            default: null,
        },
    },
    {
        timestamps: true
    }
);
certificateAndActivitySchema.virtual('studentsCount', {
    ref: 'Certificate',
    localField: '_id',
    foreignField: 'certificateActivityId',
    count: true,
});
certificateAndActivitySchema.virtual('certificatesCount', {
    ref: 'Certificate',
    localField: '_id',
    foreignField: 'certificateActivityId',
    count: true,
});
certificateAndActivitySchema.virtual('students', {
    ref: 'Certificate',
    localField: '_id',
    foreignField: 'certificateActivityId',
});
certificateAndActivitySchema.plugin(mongoosePaginate);

const CertificateAndActivity = mongoose.models.CertificateAndActivity || mongoose.model('CertificateAndActivity', certificateAndActivitySchema);
export default CertificateAndActivity;
