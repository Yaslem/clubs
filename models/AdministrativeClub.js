import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const administrativeClubSchema = new Schema(
    {
        club: {
            type: Schema.Types.ObjectId,
            ref: "Club",
            default: null
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        deputy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        administrative: {
            type: Schema.Types.ObjectId,
            ref: "Administrative",
            default: null
        },
    },
    {
        timestamps: true,
    }
);

administrativeClubSchema.plugin(mongoosePaginate);
administrativeClubSchema.set('toObject', { virtuals: true });
administrativeClubSchema.set('toJSON', { virtuals: true });

const AdministrativeClub = mongoose.models.AdministrativeClub || mongoose.model('AdministrativeClub', administrativeClubSchema);
export default AdministrativeClub;
