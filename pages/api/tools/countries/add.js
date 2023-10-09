import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Country from "../../../../models/Country";
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
                    const {name, code} = req.body
                    if(!(name && code)){
                        res.status(403).json({ error: 'لا توجد بيانات' })
                    }else {
                        const country = await Country.findOne({name, code})

                        if(country){
                            res.status(200).json({ mess: "الدولة موجودة" })
                        }else {
                            await Country.create({name, code})
                            res.status(201).json({ mess: 'تمت إضافة الدولة بنجاح' })
                        }
                    }
                }else {
                    if (session.user.role === 'admin'){
                        const {countries} = req.body
                        if(!countries){
                            res.status(403).json({ error: 'لا توجد بيانات' })
                        }else {
                            countries.map(async country => {
                                const countryIs = await Country.findOne({name: country.name, code: country.code})
                                if(!countryIs){
                                    await Country.create({name: country.name, code: country.code, countryId: parseInt(country.countryId)})
                                }
                            })
                            res.status(201).json({ mess: 'تمت إضافة الدول بنجاح' })
                        }
                    }else {
                        res.status(200).json({ mess: 'لا يمكنك إضافة الدول.' })
                    }
                }
            }else {
                res.status(200).json({ mess: 'غير مسموح لك بمشاهدة هذه الصفحة.', success: false })
            }
        }
    }
}
