import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Certificate from "../../../../models/Certificate";
import {uploadFiles} from "../../../../libs/UploadCertificateFiles";

export const config = {
    api: {
        bodyParser: false
    }
}
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
                && session.user.permissions.addCertificate.status
            ){
                await connectMongoDB()
                const {inputs} = await uploadFiles(req);
                const {certificateAndActivityId, image, user,} = inputs
                if(certificateAndActivityId.length == 0 || user.length == 0 || !image){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    const userCheck = await Certificate.findOne({certificateActivityId: certificateAndActivityId, user: user})
                    if(userCheck){
                        res.status(200).json({ mess: "هذا الطالب لديه شهادة بالفعل." })
                    }else {
                        await Certificate.create({
                            certificateActivityId: certificateAndActivityId,
                            user: user,
                            image: image,
                        })
                        res.status(201).json({ success: true, mess: "تم إنشاء الشهادة بنجاح" })
                    }
                }
            }else {
                res.status(200).json({ mess: "لا يمكنك إضافة الشهادة." })
            }
        }
    }
}
