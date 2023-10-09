import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import User from "../../../models/User";
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
                const options = {
                    sort: { createdAt: -1 },
                    select: 'name whatsapp username permissions role idNumber  type avatar email club level college country',
                    populate: [
                        {
                            path: 'club',
                            select: 'name'
                        },
                        {
                            path: 'level',
                            select: 'name'
                        },
                        {
                            path: 'country',
                            select: 'name'
                        },
                        {
                            path: 'college',
                            select: 'name'
                        },
                    ],
                    page: req.query.page,
                    limit: 10,
                };
                const students = await User.paginate({}, options)
                if(students.totalDocs == 0){
                    res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                }
                res.status(200).json({students, success: true })
            }else if(
                (session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.showStudent.status){
                await connectMongoDB()
                const options = {
                    sort: { createdAt: -1 },
                    select: 'name whatsapp username role idNumber permissions  type avatar email club level college country',
                    populate: [
                        {
                            path: 'club',
                            select: 'name'
                        },
                        {
                            path: 'level',
                            select: 'name'
                        },
                        {
                            path: 'country',
                            select: 'name'
                        },
                        {
                            path: 'college',
                            select: 'name'
                        }
                    ],
                    page: req.query.page,
                    limit: 10,
                };
                const students = await User.paginate({club: session.user.club._id}, options)
                if(students.totalDocs == 0){
                    res.status(200).json({ mess: 'لا توجد بيانات', success: false })
                }
                res.status(200).json({students, success: true })
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
