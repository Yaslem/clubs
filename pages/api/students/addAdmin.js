import {hash} from "bcrypt";
import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
import College from "../../../models/College";
import Level from "../../../models/Level";
import Country from "../../../models/Country";
import User from "../../../models/User";
export default async function handler(req, res) {
    const {password} = req.query
    await connectMongoDB()
    const hashedPassword = await hash("Yes.sha.med.49.jem", 12)
    if (password){
        if(password === "41204346349474968"){
            if(await User.count({username: 412043463}) == 0){
                await Club.create({
                    clubId: 1,
                    name: "فريق الإدارة",
                })
                await College.create({
                    collegeId: 1,
                    name: "كلية الشريعة"
                })
                await Level.create({
                    levelId: 10,
                    name: "الثامن"
                })
                await Country.create({
                    countryId: 227,
                    name: "موريتانيا",
                    code: "MR"
                })
                const clubId = await Club.findOne({name: "فريق الإدارة"})
                const collegeId = await College.findOne({name: "كلية الشريعة"})
                const levelId = await Level.findOne({name: "الثامن"})
                const countryId = await Country.findOne({name: "موريتانيا"})

                await User.create({
                    userId: 1,
                    name: "يسلم أحمد ناجم",
                    username: 412043463,
                    password: hashedPassword,
                    role: "admin",
                    idNumber: 2486707066,
                    whatsapp: "0590891262",
                    email: "yeslem.alshanqyti@gmail.com",
                    club: clubId._id,
                    level: levelId._id,
                    college: collegeId._id,
                    country: countryId._id,
                    permissions: {
                        addActivity: {
                            status: true,
                            label: "إضافة الفعاليات"
                        },
                        editActivity: {
                            status: true,
                            label: "تعديل الفعاليات"
                        },
                        showActivity: {
                            status: true,
                            label: "عرض الفعاليات"
                        },
                        deleteActivity: {
                            status: true,
                            label: "حذف الفعاليات"
                        },
                        addComment: {
                            status: true,
                            label: "إضافة التعليقات/الردود"
                        },
                        editComment: {
                            status: true,
                            label: "تعديل التعليقات/الردود"
                        },
                        showComment: {
                            status: true,
                            label: "عرض التعليقات/الردود"
                        },
                        deleteComment: {
                            status: true,
                            label: "حذف التعليقات/الردود"
                        },
                        addPermission: {
                            status: true,
                            label: "إضافة الصلاحيات"
                        },
                        editPermission: {
                            status: true,
                            label: "تعديل الصلاحيات"
                        },
                        showPermission: {
                            status: true,
                            label: "عرض الصلاحيات"
                        },
                        deletePermission: {
                            status: true,
                            label: "حذف الصلاحيات"
                        },
                        addAttend: {
                            status: true,
                            label: "إضافة التحضيرات"
                        },
                        editAttend: {
                            status: true,
                            label: "تعديل التحضيرات"
                        },
                        showAttend: {
                            status: true,
                            label: "عرض التحضيرات"
                        },
                        deleteAttend: {
                            status: true,
                            label: "حذف التحضيرات"
                        },
                        addClub: {
                            status: true,
                            label: "إضافة الأندية"
                        },
                        editClub: {
                            status: true,
                            label: "تعديل الأندية"
                        },
                        showClub: {
                            status: true,
                            label: "عرض الأندية"
                        },
                        deleteClub: {
                            status: true,
                            label: "حذف الأندية"
                        },
                        addStudent: {
                            status: true,
                            label: "إضافة الطلاب"
                        },
                        editStudent: {
                            status: true,
                            label: "تعديل الطلاب"
                        },
                        showStudent: {
                            status: true,
                            label: "عرض الطلاب"
                        },
                        deleteStudent: {
                            status: true,
                            label: "حذف الطلاب"
                        },
                        addContact: {
                            status: true,
                            label: "إضافة الطلبات"
                        },
                        editContact: {
                            status: true,
                            label: "تعديل الطلبات"
                        },
                        showContact: {
                            status: true,
                            label: "عرض الطلبات"
                        },
                        deleteContact: {
                            status: true,
                            label: "حذف الطلبات"
                        },
                        addPost: {
                            status: true,
                            label: "إضافة المنشورات"
                        },
                        editPost: {
                            status: true,
                            label: "تعديل المنشورات"
                        },
                        showPost: {
                            status: true,
                            label: "عرض المنشورات"
                        },
                        deletePost: {
                            status: true,
                            label: "حذف المنشورات"
                        },
                        addReport: {
                            status: true,
                            label: "إضافة التقارير"
                        },
                        editReport: {
                            status: true,
                            label: "تعديل التقارير"
                        },
                        showReport: {
                            status: true,
                            label: "عرض التقارير"
                        },
                        deleteReport: {
                            status: true,
                            label: "حذف التقارير"
                        },
                        addAward: {
                            status: true,
                            label: "إضافة الجوائز"
                        },
                        editAward: {
                            status: true,
                            label: "تعديل الجوائز"
                        },
                        showAward: {
                            status: true,
                            label: "عرض الجوائز"
                        },
                        deleteAward: {
                            status: true,
                            label: "تعديل الجوائز"
                        },
                        addCertificate: {
                            status: true,
                            label: "إضافة الشهادات"
                        },
                        editCertificate: {
                            status: true,
                            label: "تعديل الشهادات"
                        },
                        showCertificate: {
                            status: true,
                            label: "عرض الشهادات"
                        },
                        deleteCertificate: {
                            status: true,
                            label: "حذف الشهادات"
                        }
                    },
                })
                res.status(201).json({ success: true, mess: "تم إنشاء الحساب بنجاح", })
            }else {
                res.status(201).json({ success: false, mess: "لا يمكنك فعل هذا الإجراء.", })
            }
        }else {
            res.status(201).json({ success: false, mess: "لا يمكنك فعل هذا الإجراء.", })
        }
    }else {
        res.status(201).json({ success: false, mess: "لا يمكنك فعل هذا الإجراء.", })
    }
}
