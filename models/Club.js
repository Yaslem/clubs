import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const clubSchema = new Schema(
    {
        clubId: {
            type: Number,
            default: null,
        },
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: "default/club-default-avatar.png"
        },
        cover: {
            type: String,
            default: "default/club-default-cover.png"
        },
        description: String,
        goals: {
            type: String,
            default: '---'
        },
        values: {
            type: String,
            default: '---'
        },
        vision: {
            type: String,
            default: '---'
        },
        message: {
            type: String,
            default: '---'
        },
        whatsapp: {
            type: String,
            default: '---'
        },
        telegram: {
            type: String,
            default: '---'
        },
        isActive: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        },
        manager: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
    },
    {
        timestamps: true,
        strictPopulate: false
    }
);

clubSchema.virtual('students', {
    ref: 'User',
    localField: '_id',
    foreignField: 'club',
});
clubSchema.virtual('studentsCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'club',
    count: true,
});
clubSchema.virtual('activitiesCount', {
    ref: 'Activity',
    localField: '_id',
    foreignField: 'club',
    count: true,
});
clubSchema.virtual('activities', {
    ref: 'Activity',
    localField: '_id',
    foreignField: 'club',
});
clubSchema.virtual('subMembersCount', {
    ref: 'UserClub',
    localField: '_id',
    foreignField: 'club',
    count: true,
});
clubSchema.virtual('subMembers', {
    ref: 'UserClub',
    localField: '_id',
    foreignField: 'club',
});
clubSchema.virtual('discoursesCount', {
    ref: 'Discourse',
    localField: '_id',
    foreignField: 'club',
    count: true,
});
clubSchema.virtual('discourses', {
    ref: 'Discourse',
    localField: '_id',
    foreignField: 'club',
});
clubSchema.virtual('designsCount', {
    ref: 'Design',
    localField: '_id',
    foreignField: 'club',
    count: true,
});
clubSchema.virtual('designs', {
    ref: 'Design',
    localField: '_id',
    foreignField: 'club',
});
clubSchema.virtual('administrativeCount', {
    ref: 'AdministrativeClub',
    localField: '_id',
    foreignField: 'club',
    count: true,
});
clubSchema.virtual('administrative', {
    ref: 'AdministrativeClub',
    localField: '_id',
    foreignField: 'club',
});
clubSchema.virtual('postsCount', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'club',
    count: true,
});
clubSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'club',
});

clubSchema.plugin(mongoosePaginate);
clubSchema.set('toObject', { virtuals: true });
clubSchema.set('toJSON', { virtuals: true });

const Club = mongoose.models.Club || mongoose.model('Club', clubSchema);
export default Club;
