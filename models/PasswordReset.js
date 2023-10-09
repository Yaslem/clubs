import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const passwordResetSchema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true
        },
        IsActivated: {
            type: Boolean,
            default: false,
            required: true
        },
    },
    {
        timestamps: true
    }
);
passwordResetSchema.plugin(mongoosePaginate);

const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', passwordResetSchema);
export default PasswordReset;
