import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const awardsAndActivitySchema = new Schema(
    {
        awardId : {
            type: Number,
            default: null,
        },
        activityId : {
            type: Schema.Types.ObjectId,
            ref: 'Activity',
            default: null,
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
awardsAndActivitySchema.plugin(mongoosePaginate);

const AwardAndActivity = mongoose.models.AwardAndActivity || mongoose.model('AwardAndActivity', awardsAndActivitySchema);
export default AwardAndActivity;
