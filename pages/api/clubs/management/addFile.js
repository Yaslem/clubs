import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Club from "../../../../models/Club";
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
            if(session.user.role === 'admin' && session.user.permissions.addClub.status
            ){
                const {isFile} = req.body
                await connectMongoDB()
                if(isFile == true){
                    const {clubs} = req.body
                    clubs.map(async club => {
                        const clubIS = await Club.findOne({name: club.name})
                        if(!clubIS){
                            const userId = await User.findOne({userId: club.manager})
                            await Club.create({
                                clubId: parseInt(club.clubId),
                                manager: userId,
                                name: club.name,
                                description: club.description,
                                goals: club.goals,
                                avatar: club.avatar,
                                cover: club.cover,
                                values: club.values,
                                vision: club.vision,
                                message: club.message,
                                whatsapp: club.whatsapp,
                                telegram: club.telegram,
                            })
                        }
                    })
                    return res.status(201).json({ success: true, mess: "تم إنشاء الأندية بنجاح" })
                }
            }else {
                res.status(200).json({mess: 'عفوا، غير مسموح لك بفعل هذا الإجراء.'})
            }
        }
    }
}
