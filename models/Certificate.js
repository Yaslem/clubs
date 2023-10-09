import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const certificateSchema = new Schema(
    {
        certificateId : {
            type: Number,
            default: null,
        },
        certificateActivityId : {
            type: Schema.Types.ObjectId,
            ref: "CertificateAndActivity",
        },
        image : {
            type: String,
            default: null,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true
    }
);
certificateSchema.plugin(mongoosePaginate);

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
export default Certificate;
