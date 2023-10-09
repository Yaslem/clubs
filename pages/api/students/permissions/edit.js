import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import User from "../../../../models/User";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
            ){
                const {studentId, status, label} = req.body
                if(studentId.toString().length == 0 || status.toString().length == 0 || label.toString().length == 0){
                    return  res.status(200).json({mess: "لا توجد بيانات.", success: false })
                }else {
                    await connectMongoDB()
                    switch (label) {
                        case "addActivity":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addActivity.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editActivity":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editActivity.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showActivity":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showActivity.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteActivity":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteActivity.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addDesign":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addDesign.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editDesign":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editDesign.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showDesign":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showDesign.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteDesign":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteDesign.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addDiscourse":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addDiscourse.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editDiscourse":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editDiscourse.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showDiscourse":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showDiscourse.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteDiscourse":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteDiscourse.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addComment":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addComment.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editComment":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editComment.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showComment":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showComment.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteComment":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteComment.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addPermission":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addPermission.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editPermission":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editPermission.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showPermission":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showPermission.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deletePermission":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deletePermission.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addAttend":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addAttend.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editAttend":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editAttend.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showAttend":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showAttend.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteAttend":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteAttend.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addClub":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addClub.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editClub":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editClub.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showClub":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showClub.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteClub":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteClub.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addStudent":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addStudent.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editStudent":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editStudent.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showStudent":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showStudent.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteStudent":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteStudent.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addContact":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addContact.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editContact":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editContact.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showContact":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showContact.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteContact":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteContact.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addPost":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addPost.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editPost":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editPost.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showPost":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showPost.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deletePost":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deletePost.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addReport":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addReport.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editReport":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editReport.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showReport":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showReport.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteReport":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteReport.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addAward":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addAward.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editAward":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editAward.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showAward":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showAward.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteAward":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteAward.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addCertificate":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addCertificate.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "editCertificate":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.editCertificate.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showCertificate":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showCertificate.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showAward":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showAward.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "downloadCertificate":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.downloadCertificate.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "deleteCertificate":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.deleteCertificate.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        default:
                            return res.status(200).json({mess: "غير مسموح لك بتعديل هذه الصلاحية.", success: true })

                    }
                }
            }else if(session.user.role === 'manager'){
                const {studentId, status, label} = req.body
                if(studentId.toString().length == 0 || status.toString().length == 0 || label.toString().length == 0){
                    return  res.status(200).json({mess: "لا توجد بيانات.", success: false })
                }else {
                    await connectMongoDB()
                    switch (label) {
                        case "addActivity":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addActivity.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showActivity":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showActivity.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addDiscourse":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addDiscourse.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showDiscourse":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showDiscourse.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addDesign":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addDesign.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showDesign":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showDesign.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addStudent":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addStudent.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showStudent":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showStudent.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addContact":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addContact.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showContact":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showContact.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addPost":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addPost.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showPost":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showPost.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "addReport":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.addReport.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showReport":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showReport.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "downloadCertificate":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.downloadCertificate.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        case "showCertificate":
                            await User.findByIdAndUpdate(studentId, {
                                "permissions.showCertificate.status": status
                            })
                            return res.status(201).json({mess: "تم تعديل الصلاحية بنجاح.", success: true })
                            break
                        default:
                            return res.status(200).json({mess: "غير مسموح لك بتعديل هذه الصلاحية.", success: true })
                    }
                }
            }else {
                res.status(200).json({mess: 'عفوا، غير مسموح لك بحذف هذا الطالب.'})
            }
        }
    }
}
