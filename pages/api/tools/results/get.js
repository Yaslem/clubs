import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Club from "../../../../models/Club";
import Year from "../../../../models/Year";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(session.user.role === 'admin' || session.user.role === 'coordinator' || session.user.role === 'president'
            ){
                await connectMongoDB()
                const clubs = await Club.find({}, 'name')
                const years = await Year.find({}, 'nameH')
                res.status(200).json({clubs, years, success: true })
            }else {
                res.status(403).json({ error: 'لا يمكنك عرض هذه الصفحة.' })
            }
        }
    }
}
