import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Administrative from "../../../../models/Administrative";
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
                    const {name} = req.body
                    if(!(name)){
                        res.status(403).json({ error: 'لا توجد بيانات' })
                    }else {
                        const administrative = await Administrative.findOne({name})

                        if(administrative){
                            res.status(200).json({ mess: "الوظيفة موجودة" })
                        }else {
                            await Administrative.create({name})
                            res.status(201).json({ mess: 'تم إضافة الوظيفة بنجاح' })
                        }
                    }
                }else {
                    if (session.user.role === 'admin'){
                        const {administrative} = req.body
                        if(!administrative){
                            res.status(403).json({ error: 'لا توجد بيانات' })
                        }else {
                            administrative.map(async admins => {
                                const administrativeIs = await Administrative.findOne({name: admins.name})
                                if(!administrativeIs){
                                    await Administrative.create({
                                        administrativeId: admins.administrativeId,
                                        name: admins.name,
                                    })
                                }
                            })
                            res.status(201).json({ mess: 'تم إضافة الوظائف بنجاح' })
                        }
                    }else {
                        res.status(200).json({ mess: 'لا يمكنك إضافة الوظائف.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
