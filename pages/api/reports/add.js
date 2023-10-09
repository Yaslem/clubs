import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Report from "../../../models/Report";
import {uploadFiles} from "../../../libs/UploadReportFiles";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.addReport.status
            ){
                await connectMongoDB()
                const {inputs} = await uploadFiles(req);
                const {summary, notes, numbers, images, club, isEdit, activity, user, reportId} = inputs
                if(isEdit == "false"){
                    if(summary.length == 0 || numbers.length == 0 || images.length == 0 || user.length == 0 || activity.length == 0 || club.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const reportCkeck = await Report.count({user, activity, club})
                        if(reportCkeck > 0){
                            res.status(200).json({ success: false, mess: "هذا التقرير موجود بالفعل." })
                        }else {
                            await Report.create({
                                summary: summary,
                                notes: notes,
                                numbers: numbers,
                                images: images,
                                club: club,
                                activity: activity,
                                user: user,
                            })
                            res.status(201).json({ success: true, mess: "تم إنشاء التقرير بنجاح" })
                        }
                    }
                }else {
                    if(summary.length == 0 || numbers.length == 0 || reportId.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const reportCkeck = await Report.findById(reportId)
                        if(reportCkeck){
                            if(images){
                                await Report.findByIdAndUpdate(reportId, {
                                    summary: summary,
                                    notes: notes,
                                    numbers: numbers,
                                    images: images,
                                })
                            }else {
                                await Report.findByIdAndUpdate(reportId, {
                                    summary: summary,
                                    notes: notes,
                                    numbers: numbers,
                                })
                            }
                            res.status(201).json({ success: true, mess: "تم تحديث التقرير بنجاح." })
                        }else {
                            res.status(200).json({ success: true, mess: "التقرير غير موجود." })
                        }
                    }
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.addReport.status
            ){
                await connectMongoDB()
                const {inputs} = await uploadFiles(req);
                const {summary, notes, numbers, images, club, isEdit, activity, user, reportId} = inputs
                if(isEdit == "false"){
                    if(summary.length == 0 || numbers.length == 0 || images.length == 0 || activity.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const reportCkeck = await Report.find({user, activity, club})
                        if(reportCkeck){
                            res.status(200).json({ success: true, mess: "هذا التقرير موجود بالفعل." })
                        }else {
                            await Report.create({
                                summary: summary,
                                notes: notes,
                                numbers: numbers,
                                images: images,
                                club: session.user.club._id,
                                activity: activity,
                                user: session.user.id,
                            })
                            res.status(201).json({ success: true, mess: "تم إنشاء التقرير بنجاح" })
                        }
                    }
                }else {
                    if(summary.length == 0 || numbers.length == 0 || reportId.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const reportCkeck = await Report.findById(reportId)
                        if(reportCkeck){
                            if(images){
                                await Report.findByIdAndUpdate(reportId, {
                                    summary: summary,
                                    notes: notes,
                                    numbers: numbers,
                                    images: images,
                                })
                            }else {
                                await Report.findByIdAndUpdate(reportId, {
                                    summary: summary,
                                    notes: notes,
                                    numbers: numbers,
                                })
                            }
                            res.status(201).json({ success: true, mess: "تم تحديث التقرير بنجاح." })
                        }else {
                            res.status(200).json({ success: true, mess: "التقرير غير موجود." })
                        }
                    }
                }
            }else {
                res.status(200).json({ mess: "لا يمكنك إضافة هذا التقرير." })
            }
        }
    }
}
