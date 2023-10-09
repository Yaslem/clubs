import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Year from "../../../../models/Year";
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '100mb',
        },
    },
}
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'POST'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {
            if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'){
                const {isFile} = req.body
                await connectMongoDB()
                if (isFile == false){
                    const {nameH, nameM} = req.body
                    if(nameH.length == 0 || nameM.length == 0){
                        res.status(404).json({ error: 'لا توجد بيانات' })
                    }else {
                        const year = await Year.findOne({nameH})

                        if(year){
                            res.status(200).json({ mess: "السنة موجودة" })
                        }else {
                            await Year.create({nameH, nameM})
                            res.status(201).json({ mess: 'تمت إضافة السنة بنجاح' })
                        }
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
