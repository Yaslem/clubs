import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const awardsAndUserSchema = new Schema(
    {
        awardId : {
            type: Number,
            default: null,
        },
        awardAndActivityId : {
            type: Schema.Types.ObjectId,
            ref: "AwardAndActivity",
        },
        status : {
            type: String,
            enum: ['استلم', 'لم يستلم'],
            default: 'لم يستلم',
        },
        coordinator : {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        award: {
            type: Schema.Types.ObjectId,
            ref: "Award",
        },
        club: {
            type: Schema.Types.ObjectId,
            ref: "Club",
            default: null
        },
    },
    {
        timestamps: true
    }
);
awardsAndUserSchema.plugin(mongoosePaginate);

const AwardAndUser = mongoose.models.AwardAndUser || mongoose.model('AwardAndUser', awardsAndUserSchema);
export default AwardAndUser;
