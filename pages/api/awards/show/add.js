import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import AwardAndUser from "../../../../models/AwardAndUser";
import AwardAndActivity from "../../../../models/AwardAndActivity";
import Award from "../../../../models/Award";
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
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.addAward.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {awardAndActivityId, coordinator, user, award} = req.body
                    if(awardAndActivityId !== undefined && coordinator !== undefined && user !== undefined && award !== undefined){
                        if(awardAndActivityId.length === 0 || coordinator.length === 0 || user.length === 0 || award.length === 0){
                            res.status(200).json({ mess: "لا توجد بيانات." })
                        }else {
                            const userCheck = await AwardAndUser.findOne({awardAndActivityId: awardAndActivityId, user: user})
                            if(userCheck){
                                res.status(200).json({ mess: "هذا الطالب لديه جائزة بالفعل." })
                            }else {
                                await AwardAndUser.create({
                                    awardAndActivityId: awardAndActivityId,
                                    coordinator: coordinator,
                                    user: user,
                                    award: award,
                                })
                                res.status(201).json({ success: true, mess: "تم إنشاء الجائزة بنجاح" })
                            }
                        }
                    }else {
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }
                }else {
                    if(session.user.role === 'admin'){
                        const {awardAndUsers} = req.body
                        awardAndUsers.map(async user => {
                            const activity = await AwardAndActivity.findOne({awardId: user.awardAndActivityId})
                            const award = await Award.findOne({awardId: user.award})
                            const coordinator = await User.findOne({userId: user.coordinator})
                            const userList = await User.findOne({userId: user.user})
                            if(activity && award && coordinator && userList){
                                await AwardAndUser.create({
                                    awardId: user.awardId,
                                    awardAndActivityId: activity._id,
                                    status: user.status,
                                    coordinator: coordinator._id,
                                    user: userList._id,
                                    award: award._id,
                                    club: activity.club,
                                    createdAt: user.createdAt,
                                })
                            }
                        })
                        res.status(201).json({ success: true, mess: "تم إنشاء الجوائز بنجاح" })
                    }else {
                        res.status(200).json({ success: true, mess: "لا يمكنك إنشاء هذه الجوائز." })
                    }
                }
            }else if ((session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.addAward.status) {
                const {awardAndActivityId, coordinator, user, award} = req.body
                if(awardAndActivityId !== undefined && coordinator !== undefined && user !== undefined && award !== undefined) {
                    if (awardAndActivityId.length === 0 || coordinator.length === 0 || user.length === 0 || award.length === 0) {
                        res.status(200).json({mess: "لا توجد بيانات."})
                    } else {
                        const userCheck = await AwardAndUser.findOne({
                            awardAndActivityId: awardAndActivityId,
                            user: user
                        })
                        if (userCheck) {
                            res.status(200).json({mess: "هذا الطالب لديه جائزة بالفعل."})
                        } else {
                            await AwardAndUser.create({
                                awardAndActivityId: awardAndActivityId,
                                coordinator: coordinator,
                                user: user,
                                award: award,
                                club: session.user.club._id,
                            })
                            res.status(201).json({success: true, mess: "تم إنشاء الجائزة بنجاح"})
                        }
                    }
                }
            }else {
                res.status(200).json({ mess: "لا يمكنك إضافة الجوائز." })
            }
        }
    }
}
