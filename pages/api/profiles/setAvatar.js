import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import User from "../../../models/User";
import {uploadFiles} from "../../../libs/UploadAvatarFiles";
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
            await connectMongoDB()
            const {inputs} = await uploadFiles(req);
            const {avatar} = inputs
            if(!avatar){
                res.status(200).json({ mess: "لا توجد بيانات." })
            }else {
                const user = await User.findById(session.user.id)
                if(user){
                    await User.findByIdAndUpdate(session.user.id, {
                        avatar: avatar,
                    })
                    res.status(201).json({success: true, mess: "تم تحديث صورة الحساب بنجاح", avatar })
                }else {
                    res.status(200).json({ mess: "الحساب غير موجود." })
                }
            }
        }
    }
}
