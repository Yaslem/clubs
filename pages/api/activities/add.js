import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Activity from "../../../models/Activity";
import Club from "../../../models/Club";
import Location from "../../../models/Location";
import Type from "../../../models/Type";
import Discourse from "../../../models/Discourse";
import Design from "../../../models/Design";
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
                    || session.user.role === 'president'
                    || session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.addActivity.status
            ){
                connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {title, presenter, isDiscourse, isDesign, clubShare, notes, status, date, from, to, hospitality, isShare, projector, location, club, type} = req.body
                    if(title.length == 0 || presenter.length == 0 || isDiscourse.length == 0 || isDesign.length == 0 || status.length == 0 || date.length == 0 || from.length == 0 || to.length == 0 || type.length == 0 || club.length == 0 || hospitality.length == 0 || isShare.length == 0 || projector.length == 0 || location.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        if(isShare === "true"){
                            Activity.create({
                                title: title,
                                presenter: presenter,
                                notes: notes,
                                status: status,
                                date: date,
                                from: from,
                                to: to,
                                hospitality: hospitality,
                                isShare: isShare,
                                clubShare: clubShare,
                                isDiscourse: isDiscourse,
                                isDesign: isDesign,
                                projector: projector,
                                location: location,
                                club: club,
                                type: type,
                            }).then(async data => {
                                await Activity.create({
                                    title: title,
                                    presenter: presenter,
                                    notes: notes,
                                    status: status,
                                    date: date,
                                    from: from,
                                    to: to,
                                    hospitality: hospitality,
                                    isShare: isShare,
                                    clubShare: club,
                                    isDiscourse: isDiscourse,
                                    isDesign: isDesign,
                                    projector: projector,
                                    location: location,
                                    club: clubShare,
                                    type: type,
                                })
                                if(isDesign === "true"){
                                    await Design.create({
                                        activity: data._id,
                                        club: data.club,
                                    })
                                }
                                res.status(201).json({ success: true, mess: "تم إنشاء الفعالية بنجاح" })
                            })
                        }else {
                            Activity.create({
                                title: title,
                                presenter: presenter,
                                notes: notes,
                                status: status,
                                date: date,
                                from: from,
                                to: to,
                                hospitality: hospitality,
                                isShare: isShare,
                                isDiscourse: isDiscourse,
                                isDesign: isDesign,
                                projector: projector,
                                location: location,
                                club: club,
                                type: type,
                            }).then(async data => {
                                if(isDesign === "true"){
                                    await Design.create({
                                        activity: data._id,
                                        club: data.club,
                                    })
                                }
                                res.status(201).json({ success: true, mess: "تم إنشاء الفعالية بنجاح" })
                            })
                        }
                    }
                }else {
                    if(session.user.role === 'admin'){
                        const {activities} = req.body
                        if(activities.length == 0){
                            res.status(200).json({ mess: "لا توجد بيانات" })
                        }
                        activities.map(async activity => {
                            const clubId = await Club.findOne({clubId: activity.club})
                            const locationId = await Location.findOne({locationId: activity.location})
                            const typeId = await Type.findOne({typeId: activity.type})
                            if(clubId && locationId && typeId){
                                await Activity.create({
                                    title: activity.title,
                                    presenter: activity.presenter,
                                    notes: activity.notes,
                                    status: activity.status,
                                    date: new Date(activity.date),
                                    from: activity.from,
                                    to: activity.to,
                                    activityId: parseInt(activity.activityId),
                                    hospitality: activity.hospitality,
                                    isShare: activity.isShare,
                                    projector: activity.projector,
                                    location: locationId._id,
                                    club: clubId._id,
                                    type: typeId._id,
                                    createdAt: activity.date,
                                    updatedAt: activity.date,
                                })
                            }
                        })
                        res.status(201).json({ success: true, mess: "تم إنشاء الفعاليات بنجاح"})
                    }else {
                        res.status(200).json({ success: true, mess: "لا يمكنك إنشاء هذه الفعاليات."})
                    }
                }
            }else if((session.user.role === 'manager' || session.user.role === 'officials') && session.user.permissions.addActivity.status)
            {
                connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {title, presenter, notes, status, date, from, to, hospitality, isShare, projector, location, club, type} = req.body
                    if(title.length == 0 && presenter.length == 0 && notes.length == 0 && status.length == 0 && date.length == 0 && from.length == 0 && to.length == 0 && type.length == 0 && club.length == 0 && hospitality.length == 0 && isShare.length == 0 && projector.length == 0, location.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        await Activity.create({
                            title: title,
                            presenter: presenter,
                            notes: notes,
                            status: status,
                            date: date,
                            from: from,
                            to: to,
                            hospitality: hospitality,
                            isShare: isShare,
                            projector: projector,
                            location: location,
                            club: club,
                            type: type,
                        })
                        return res.status(201).json({ success: true, mess: "تم إنشاء الفعالية بنجاح" })
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات" })
                }
            }else {

            }
        }
    }
}
