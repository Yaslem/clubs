import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import User from "../../../models/User";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'PUT'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            await connectMongoDB()
            const {id, name, email, country, level, college, whatsapp} = req.body
            if(id.toString().length == 0 || name.toString().length == 0 || email.toString().length == 0 || country.toString().length == 0 || level.toString().length == 0 || college.toString().length == 0 || whatsapp.toString().length == 0){
                res.status(200).json({ mess: "لا توجد بيانات." })
            }else {
                const user = await User.findById(id)
                if(user){
                    User.findByIdAndUpdate(id, {
                        name: name,
                        whatsapp: whatsapp,
                        email: email,
                        level: level,
                        college: college,
                        country: country,
                    }).then( data => {
                        const user = {
                            name: data.name,
                            whatsapp: data.whatsapp,
                            email: data.email,
                            level: data.level,
                            college: data.college,
                            country: data.country,
                        }
                        return res.status(201).json({success: true, mess: "تم تحديث الحساب بنجاح", user })
                    })
                }else {
                    res.status(200).json({ mess: "الحساب غير موجود." })
                }
            }
        }
    }
}
