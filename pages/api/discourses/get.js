import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
import Type from "../../../models/Type";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if((session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.showDiscourse.status)
            {
                await connectMongoDB()
                const clubs = await Club.find({}, 'name')
                const types = await Type.find({}, 'name')
                res.status(200).json({clubs, types, success: true })
            }else if((session.user.role === 'manager'
                    || session.user.role === 'officials'
                    || session.user.role === 'deputy')
                && session.user.permissions.showDiscourse.status){
                await connectMongoDB()
                const clubs = await Club.find({_id: session.user.club._id}, 'name')
                const types = await Type.find({}, 'name')
                res.status(200).json({clubs, types, success: true })
            }
        }
    }
}
