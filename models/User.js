import mongoose, { Schema } from "mongoose";
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema(
    {
        userId: {
            type: Number,
            default: null,
        },
        name: {
            type: String,
            required: [true, 'الاسم مطلوب.'],
        },
        username: {
            type: Number,
            unique: true,
            required: [true, 'الرقم الجامعي مطلوب.'],
        },
        whatsapp: {
            type: Number,
            default: null,
        },
        password: {
            type: String,
            minLength: [8, 'كلمة المرور يجب أن تكون أطول من 8 أحرف'],
            required: [true, 'كلمة المرور مطلوبة.'],
            select: false,
        },
        role: {
            type: String,
            enum : ['student','admin', 'manager', 'president', 'coordinator', 'officials', 'deputy'],
            default: 'student'
        },
        idNumber: {
            type: Number,
            unique: true,
            required: [true, 'رقم الهوية/الإقامة مطلوب.'],
        },
        avatar: {
            type: String,
            default: "default/avatar.png"
        },
        type: {
            type: String,
            enum : ['basic','subsidiary'],
            default: 'basic'
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'البريد مطلوب.'],
        },
        club: {
            type: Schema.Types.ObjectId,
            ref: "Club",
            required: [true, 'النادي مطلوب.'],
        },
        level: {
            type: Schema.Types.ObjectId,
            ref: "Level",
            required: [true, 'المستوى مطلوب.'],
        },
        college: {
            type: Schema.Types.ObjectId,
            ref: "College",
            required: [true, 'الكلية مطلوبة.'],
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: "Country",
            required: [true, 'الدولة مطلوبة.'],
        },
        permissions: {
            addActivity: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "إضافة الفعاليات"
                },
            },
            editActivity: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل الفعاليات"
                },
            },
            showActivity: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "عرض الفعاليات"
                },
            },
            deleteActivity: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف الفعاليات"
                },
            },
            addDesign: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "إضافة التصاميم"
                },
            },
            editDesign: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل التصاميم"
                },
            },
            showDesign: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "عرض التصاميم"
                },
            },
            deleteDesign: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف التصاميم"
                },
            },
            addDiscourse: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "إضافة الخطابات"
                },
            },
            editDiscourse: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل الخطابات"
                },
            },
            showDiscourse: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "عرض الخطابات"
                },
            },
            deleteDiscourse: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف الخطابات"
                },
            },
            addComment: {
                status: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    default: "إضافة التعليقات/الردود"
                },
            },
            editComment: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل التعليقات/الردود"
                },
            },
            showComment: {
                status: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    default: "عرض التعليقات/الردود"
                },
            },
            deleteComment: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف التعليقات/الردود"
                },
            },
            addPermission: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "إضافة الصلاحيات"
                },
            },
            editPermission: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل الصلاحيات"
                },
            },
            showPermission: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "عرض الصلاحيات"
                },
            },
            deletePermission: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف الصلاحيات"
                },
            },
            addAttend: {
                status: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    default: "إضافة التحضيرات"
                },
            },
            editAttend: {
                status: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    default: "تعديل التحضيرات"
                },
            },
            showAttend: {
                status: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    default: "عرض التحضيرات"
                },
            },
            deleteAttend: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف التحضيرات"
                },
            },
            addClub: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "إضافة الأندية"
                },
            },
            editClub: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل الأندية"
                },
            },
            showClub: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "عرض الأندية"
                },
            },
            deleteClub: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف الأندية"
                },
            },
            addStudent: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "إضافة الطلاب"
                },
            },
            editStudent: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل الطلاب"
                },
            },
            showStudent: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "عرض الطلاب"
                },
            },
            deleteStudent: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف الطلاب"
                },
            },
            addContact: {
                status: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    default: "إضافة الطلبات"
                },
            },
            editContact: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل الطلبات"
                },
            },
            showContact: {
                status: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    default: "عرض الطلبات"
                },
            },
            deleteContact: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف الطلبات"
                },
            },
            addPost: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "إضافة المنشورات"
                },
            },
            editPost: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل المنشورات"
                },
            },
            showPost: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "عرض المنشورات"
                },
            },
            deletePost: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف المنشورات"
                },
            },
            addReport: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "إضافة التقارير"
                },
            },
            editReport: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل التقارير"
                },
            },
            showReport: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "عرض التقارير"
                },
            },
            deleteReport: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف التقارير"
                },
            },
            addAward: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "إضافة الجوائز"
                },
            },
            editAward: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل الجوائز"
                },
            },
            showAward: {
                status: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    default: "عرض الجوائز"
                },
            },
            deleteAward: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل الجوائز"
                },
            },
            addCertificate: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "إضافة الشهادات"
                },
            },
            downloadCertificate: {
                status: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    default: "تحميل الشهادات"
                },
            },
            editCertificate: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "تعديل الشهادات"
                },
            },
            showCertificate: {
                status: {
                    type: Boolean,
                    default: true
                },
                label: {
                    type: String,
                    default: "عرض الشهادات"
                },
            },
            deleteCertificate: {
                status: {
                    type: Boolean,
                    default: false
                },
                label: {
                    type: String,
                    default: "حذف الشهادات"
                },
            },
        },
    },
    {
        timestamps: true,
    }
);
userSchema.virtual('awards', {
    ref: 'AwardAndUser',
    localField: '_id',
    foreignField: 'user',
});
userSchema.virtual('awardsCount', {
    ref: 'AwardAndUser',
    localField: '_id',
    foreignField: 'user',
    count: true,
});
userSchema.virtual('certificates', {
    ref: 'Certificate',
    localField: '_id',
    foreignField: 'user',
});
userSchema.virtual('certificatesCount', {
    ref: 'Certificate',
    localField: '_id',
    foreignField: 'user',
    count: true,
});
userSchema.virtual('clubs', {
    ref: 'UserClub',
    localField: '_id',
    foreignField: 'user',
});
userSchema.virtual('clubsCount', {
    ref: 'UserClub',
    localField: '_id',
    foreignField: 'user',
    count: true,
});
userSchema.plugin(mongoosePaginate);
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
