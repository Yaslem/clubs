import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Club from "../../../../models/Club";
import {uploadFiles} from "../../../../libs/UploadFiles";
export const config = {
    api: {
        bodyParser: false
    }
}
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'PUT'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.editClub.status
            ){
                const {inputs} = await uploadFiles(req);
                const {name, avatar, cover, description, goals, values, vision, message, whatsapp, telegram, manager, clubId} = inputs;
                await connectMongoDB()
                if(name.length == 0 || clubId.length == 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    const clubIs = await Club.findById(clubId)
                    if(!clubIs){
                        res.status(200).json({ mess: "هذا النادي غير موجود" })
                    }else {
                        await Club.findByIdAndUpdate(clubId, {
                            name: name,
                            avatar: avatar,
                            cover: cover,
                            description: description,
                            goals: goals,
                            values: values,
                            vision: vision,
                            message: message,
                            whatsapp: whatsapp,
                            telegram: telegram,
                            manager: manager.length == 0 ? null : manager,
                        })
                        return res.status(201).json({ success: true, mess: "تم تحديث النادي بنجاح" })
                    }
                }
            }else if(
                (session.user.role === 'manager')
                && session.user.permissions.editClub.status
            ){
                const {inputs} = await uploadFiles(req);
                const {name, avatar, cover, description, goals, values, vision, message, whatsapp, telegram, manager, clubId} = inputs;
                await connectMongoDB()
                if(name.length == 0 || clubId.length == 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    const clubIs = await Club.findById(clubId)
                    if(!clubIs){
                        res.status(200).json({ mess: "هذا النادي غير موجود" })
                    }else {
                        await Club.findByIdAndUpdate(clubId, {
                            name: name,
                            avatar: avatar,
                            cover: cover,
                            description: description,
                            goals: goals,
                            values: values,
                            vision: vision,
                            message: message,
                            whatsapp: whatsapp,
                            telegram: telegram,
                        })
                        return res.status(201).json({ success: true, mess: "تم تحديث النادي بنجاح" })
                    }
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
