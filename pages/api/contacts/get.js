import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if((session.user.role === 'manager'
                    || session.user.role === 'officials'
                    || session.user.role === 'deputy')
                && session.user.permissions.showContact.status)
            {
                await connectMongoDB()
                const clubs = await Club.find({_id: session.user.club._id}, 'name')
                res.status(200).json({clubs, success: true })
            }else {
                await connectMongoDB()
                const clubs = await Club.find({}, 'name')
                res.status(200).json({clubs, success: true })
            }
        }
    }
}