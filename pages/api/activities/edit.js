import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Activity from "../../../models/Activity";
import Club from "../../../models/Club";
import Location from "../../../models/Location";
import Type from "../../../models/Type";
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
                && session.user.permissions.editActivity.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {id, title, presenter, isDiscourse, isDesign, clubShare, notes, status, date, from, to, hospitality, isShare, projector, location, club, type} = req.body
                    if(id.length == 0 || title.length == 0 || presenter.length == 0 || isDiscourse.length == 0 || isDesign.length == 0 || presenter.length == 0 || status.length == 0 || date.length == 0 || from.length == 0 || to.length == 0 || type.length == 0 || club.length == 0 || hospitality.length == 0 || isShare.length == 0 || projector.length == 0 || location.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const activity = await Activity.findById(id)
                        if(!activity){
                            res.status(200).json({ mess: "هذه الفعالية غير موجودة" })
                        }else {
                            if(isShare === "true"){
                                await Activity.findByIdAndUpdate(id,{
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
                                })
                            }else {
                                await Activity.findByIdAndUpdate(id,{
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
                                })
                            }
                            return res.status(201).json({ success: true, mess: "تم تعديل الفعالية بنجاح" })
                        }

                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.editActivity.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {id, title, presenter, notes, status, date, from, to, hospitality, isShare, projector, location, club, type} = req.body
                    if(id.length == 0 || title.length == 0 || presenter.length == 0 || status.length == 0 || date.length == 0 || from.length == 0 || to.length == 0 || type.length == 0 || club.length == 0 || hospitality.length == 0 || isShare.length == 0 || projector.length == 0 || location.length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const activity = await Activity.findById(id)
                        if(!activity){
                            res.status(200).json({ mess: "هذه الفعالية غير موجودة" })
                        }else {
                            await Activity.findByIdAndUpdate(id,{
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
                            return res.status(201).json({ success: true, mess: "تم تعديل الفعالية بنجاح" })
                        }

                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
