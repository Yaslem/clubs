import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const userClubSchema = new Schema(
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
    },
    {
        timestamps: true,
    }
);

userClubSchema.plugin(mongoosePaginate);
userClubSchema.set('toObject', { virtuals: true });
userClubSchema.set('toJSON', { virtuals: true });

const UserClub = mongoose.models.UserClub || mongoose.model('UserClub', userClubSchema);
export default UserClub;
