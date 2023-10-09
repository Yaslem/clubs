import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Type from "../../../models/Type";
import Location from "../../../models/Location";
import Club from "../../../models/Club";
import DateModel from "../../../models/DateModel";
import Time from "../../../models/Time";
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
                && session.user.permissions.showActivity.status
            ){
                await connectMongoDB()
                const locations = await Location.find({}, 'name')
                const types = await Type.find({}, 'name')
                const clubs = await Club.find({}, 'name')
                const dates = await DateModel.findOne({}, 'start end')
                const times = await Time.findOne({}, 'start end')
                res.status(200).json({locations, types, clubs, dates, times, success: true })
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showActivity.status
            ){
                await connectMongoDB()
                const locations = await Location.find({}, 'name')
                const types = await Type.find({}, 'name')
                const clubs = await Club.find({_id: session.user.club._id}, 'name')
                const dates = await DateModel.findOne({}, 'start end')
                const times = await Time.findOne({}, 'start end')
                res.status(200).json({locations, types, clubs, dates, times, success: true })
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
