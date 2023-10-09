import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Type from "../../../../models/Type";
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
                await connectMongoDB()
                const {isFile} = req.body
                if (isFile == false){
                    const {name} = req.body
                    if(!(name)){
                        res.status(403).json({ error: 'لا توجد بيانات' })
                    }else {
                        const type = await Type.findOne({name})

                        if(type){
                            res.status(200).json({ mess: "النوع موجود" })
                        }else {
                            await Type.create({name})
                            res.status(201).json({ mess: 'تم إضافة النوع بنجاح' })
                        }
                    }
                }else {
                    if (session.user.role === 'admin'){
                        const {types} = req.body
                        if(!types){
                            res.status(403).json({ error: 'لا توجد بيانات' })
                        }else {
                            types.map(async type => {
                                const TypeIs = await Type.findOne({name: type.name})
                                if(!TypeIs){
                                    await Type.create({name: type.name, typeId: parseInt(type.typeId)})
                                }
                            })
                            res.status(201).json({ mess: 'تم إضافة الأنواع بنجاح' })
                        }
                    }else {
                        res.status(200).json({ mess: 'لا يمكنك إضافة الأنواع.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
