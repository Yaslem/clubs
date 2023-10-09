import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Report from "../../../models/Report";
import Club from "../../../models/Club";
import Activity from "../../../models/Activity";
import User from "../../../models/User";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(session.user.role === 'admin' && session.user.permissions.addReport.status
            ){
                await connectMongoDB()
                const {reports} = req.body
                reports.map(async report => {
                    const userId = await User.findOne({userId: report.user})
                    const clubId = await Club.findOne({clubId: report.club})
                    const activityId = await Activity.findOne({activityId: report.activity})
                    if(userId && clubId && activityId){
                        await Report.create({
                            reportId: parseInt(report.reportId),
                            summary: report.summary,
                            notes: report.notes,
                            numbers: report.numbers,
                            images: report.images,
                            club: clubId._id,
                            activity: activityId._id,
                            user: userId._id,
                            createdAt: report.createdAt,
                        })
                    }
                })
                return res.status(201).json({ success: true, mess: "تم إضافة التقارير بنجاح" })
            }else {
                res.status(200).json({ mess: "لا يمكنك إضافة هذا التقرير." })
            }
        }
    }
}
