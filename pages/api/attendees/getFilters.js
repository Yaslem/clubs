import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Type from "../../../models/Type";
import Location from "../../../models/Location";
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
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.showStudent.status
            ){
                await connectMongoDB()
                const types = await Type.find({}, 'name')
                const locations = await Location.find({}, 'name')
                const clubs = await Club.find({}, 'name')
                res.status(200).json({types, locations, clubs, success: true })
            }else if((session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showAttend.status){
                await connectMongoDB()
                const types = await Type.find({}, 'name')
                const locations = await Location.find({}, 'name')
                const clubs = await Club.find({_id: session.user.club._id}, 'name')
                res.status(200).json({types, locations, clubs, success: true })
            }else {
                await connectMongoDB()
                const types = await Type.find({}, 'name')
                const locations = await Location.find({}, 'name')
                const clubs = await Club.find({}, 'name')
                res.status(200).json({types, locations, clubs, success: true })
            }
        }
    }
}
