import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import College from "../../../../models/College";
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
                        const college = await College.findOne({name})

                        if(college){
                            res.status(200).json({ mess: "الكلية موجودة" })
                        }else {
                            await College.create({name})
                            res.status(201).json({ mess: 'تمت إضافة الكلية بنجاح' })
                        }
                    }
                }else {
                    if (session.user.role === 'admin'){
                        const {colleges} = req.body
                        if(!colleges){
                            res.status(403).json({ error: 'لا توجد بيانات' })
                        }else {
                            colleges.map(async college => {
                                const collegeIs = await College.findOne({name: college.name})
                                if(!collegeIs){
                                    await College.create({name: college.name, collegeId: parseInt(college.collegeId)})
                                }
                            })
                            res.status(201).json({ mess: 'تمت إضافة الكليات بنجاح' })
                        }
                    }else {
                        res.status(200).json({ mess: 'لا يمكنك إضافة الكليات.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
