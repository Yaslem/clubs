import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Level from "../../../../models/Level";
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
                        const level = await Level.findOne({name})
                        if(level){
                            res.status(200).json({ mess: "المستوى موجود" })
                        }else {
                            await Level.create({name})
                            res.status(201).json({ mess: 'تم إضافة المستوى بنجاح' })
                        }
                    }
                }else {
                    if (session.user.role === 'admin'){
                        const {levels} = req.body
                        if(!levels){
                            res.status(403).json({ error: 'لا توجد بيانات' })
                        }else {
                            levels.map(async level => {
                                const levelIs = await Level.findOne({name: level.name})
                                if(!levelIs){
                                    await Level.create({name: level.name, levelId: parseInt(level.levelId)})
                                }
                            })
                            res.status(201).json({ mess: 'تم إضافة المستويات بنجاح' })
                        }
                    }else {
                        res.status(200).json({ mess: 'لا يمكنك إضافة المستويات.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
