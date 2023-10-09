import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Award from "../../../../models/Award";
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
                        const award = await Award.findOne({name})

                        if(award){
                            res.status(200).json({ mess: "الجائزة موجودة" })
                        }else {
                            await Award.create({name})
                            res.status(201).json({ mess: 'تمت إضافة الجائزة بنجاح' })
                        }
                    }
                }else {
                    if (session.user.role === 'admin'){
                        const {awards} = req.body
                        if(!awards){
                            res.status(403).json({ error: 'لا توجد بيانات' })
                        }else {
                            awards.map(async award => {
                                const awardIs = await Award.findOne({name: award.name})
                                if(!awardIs){
                                    await Award.create({name: award.name, awardId: parseInt(award.awardId)})
                                }
                            })
                            res.status(201).json({ mess: 'تمت إضافة الجوائز بنجاح' })
                        }
                    }else {
                        res.status(200).json({ mess: 'لا يمكنك إضافة الجوائز.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
