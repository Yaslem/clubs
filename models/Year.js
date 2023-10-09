import mongoose, {Schema} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const yearSchema = new Schema(
    {
        nameH: {
            type: String,
            required: true,
            unique: true,
        },
        nameM: {
            type: String,
            required: true,
            unique: true,
        },
    }
);

yearSchema.virtual('countResults', {
    ref: 'Result',
    localField: '_id',
    foreignField: 'year',
});
yearSchema.plugin(mongoosePaginate);

yearSchema.set('toObject', { virtuals: true });
yearSchema.set('toJSON', { virtuals: true });
const Year = mongoose.models.Year || mongoose.model('Year', yearSchema);
export default Year;
