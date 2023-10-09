import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Location from "../../../../models/Location";
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
                        const location = await Location.findOne({name})

                        if(location){
                            res.status(200).json({ mess: "الموقع موجود" })
                        }else {
                            await Location.create({name})
                            res.status(201).json({ mess: 'تم إضافة الموقع بنجاح' })
                        }
                    }
                }else {
                    if (session.user.role === 'admin'){
                        const {locations} = req.body
                        if(!locations){
                            res.status(403).json({ error: 'لا توجد بيانات' })
                        }else {

                            locations.map(async location => {
                                const locationIs = await Location.findOne({name: location.name})
                                if(!locationIs){
                                    await Location.create({name: location.name, locationId: parseInt(location.locationId)})
                                }
                            })
                            res.status(201).json({ mess: 'تم إضافة المواقع بنجاح' })
                        }
                    }else {
                        res.status(200).json({ mess: 'لا يمكنك إضافة المواقع.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
