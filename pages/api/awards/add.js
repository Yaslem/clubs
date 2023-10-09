import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import AwardAndActivity from "../../../models/AwardAndActivity";
import Activity from "../../../models/Activity";
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
                && session.user.permissions.addAward.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {activity} = req.body
                    if(activity.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const activityCkeck = await AwardAndActivity.findOne({activityId: activity})
                        if(activityCkeck){
                            res.status(200).json({ mess: "هذا الجائزة موجودة بالفعل." })
                        }else {
                            await AwardAndActivity.create({
                                activityId: activity
                            })
                        }
                        res.status(201).json({ success: true, mess: "تم إنشاء الجائزة بنجاح" })
                    }
                }else {
                    if(session.user.role === 'admin'){
                        const {awardAndActivities} = req.body
                        awardAndActivities.map(async activity => {
                            const activityList = await Activity.findOne({activityId: activity.activityId})
                            if(activityList){
                                const activityCkeck = await AwardAndActivity.findOne({activityId: activityList._id})
                                if(!activityCkeck){
                                    await AwardAndActivity.create({
                                        activityId: activityList._id,
                                        club: activityList.club,
                                        awardId: activity.awardId,
                                        createdAt: activity.createdAt,
                                    })
                                }
                            }
                        })
                        res.status(201).json({ success: true, mess: "تم إنشاء الجوائز بنجاح" })
                    }else {
                        res.status(200).json({ mess: "لا يمكنك إضافة هذه الجوائز." })
                    }
                }
            }else if((session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.addAward.status)
            {
                const {activity} = req.body
                if(activity.length == 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    const activityCkeck = await AwardAndActivity.findOne({activityId: activity})
                    if(activityCkeck){
                        res.status(200).json({ mess: "هذا الجائزة موجودة بالفعل." })
                    }else {
                        await AwardAndActivity.create({
                            activityId: activity,
                            club: session.user.club._id,
                        })
                    }
                    res.status(201).json({ success: true, mess: "تم إنشاء الجائزة بنجاح" })
                }
            }else{
                res.status(200).json({ mess: "لا يمكنك إضافة هذه الجائزة." })
            }
        }
    }
}
