import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import User from "../../../models/User";
import {compare, hash} from "bcrypt";
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
            const {id, password, passwordConfirmation} = req.body
            if(id.toString().length == 0 || password.toString().length == 0 || passwordConfirmation.toString().length == 0){
                res.status(200).json({ mess: "لا توجد بيانات." })
            }else {
                const user = await User.findById(id).select("+password")
                if(user){
                    if(password != passwordConfirmation){
                        res.status(200).json({ mess: "كلمات المرور الجديدة غير متطابقة" })
                    }else {
                        const hashedPassword = await hash(password, 12)
                        await User.findByIdAndUpdate(id, {
                            password: hashedPassword,
                        })
                        res.status(201).json({success: true, mess: "تم تحديث كلمة المرور بنجاح", user })
                    }
                }else {
                    res.status(200).json({ mess: "الحساب غير موجود." })
                }
            }
        }
    }
}
