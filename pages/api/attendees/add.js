import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Attend from "../../../models/Attend";
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
            await connectMongoDB()
            const {isFile} = req.body
            if(isFile == false){
                const {benefit, lecturer, attended, suggestions, utility, activity, user} = req.body
                if(benefit.length == 0 || lecturer.length == 0 || attended.length == 0 || activity.length == 0 || user.length == 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    const attend = await Attend.findOne({user, activity})
                    if(attend){
                        res.status(200).json({ mess: "عفوا، لقد حضّرت هذه الفعالية من قبل." })
                    }else {
                        await Attend.create(
                            {
                                benefit,
                                lecturer,
                                attended,
                                suggestions,
                                utility,
                                activity,
                                user,
                                club: session.user.club._id
                            })
                        res.status(201).json({ success: true, mess: "تم التقييم بنجاح" })
                    }
                }
            }else {
                if(session.user.role === 'admin'){
                    const {attendees} = req.body
                    if(attendees.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات" })
                    }
                    attendees.map(async attend => {
                        const activityId = await Activity.findOne({activityId: attend.activity})
                        const userId = await User.findOne({userId: attend.user})
                        if(userId && activityId){
                            await Attend.create({
                                benefit: attend.benefit,
                                lecturer: attend.lecturer,
                                attended: attend.attended,
                                suggestions: attend.suggestions,
                                utility: attend.utility,
                                activity: activityId._id,
                                club: activityId.club,
                                user: userId._id
                            })
                        }
                    })
                    res.status(201).json({ success: true, mess: "تم إنشاء التقييمات بنجاح"})
                }else {
                    res.status(200).json({ success: true, mess: "لا يمكنك إنشاء هذه التقييمات."})
                }
            }
        }
    }
}
