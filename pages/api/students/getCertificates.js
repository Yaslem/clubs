import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Certificate from "../../../models/Certificate";
import User from "../../../models/User";
import Club from "../../../models/Club";
import Country from "../../../models/Country";
import CertificateAndActivity from "../../../models/CertificateAndActivity";
import Activity from "../../../models/Activity";
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
                    || session.user.role === 'president'
                    || session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showCertificate.status
            ){
                const {studentId} = req.query
                await connectMongoDB()
                const certificates = await Certificate.find({user: studentId})
                    .populate([
                        {
                            path: 'user',
                            select: 'name username',
                            model: User,
                            populate: [
                                {
                                    path: 'club',
                                    model: Club,
                                    select: 'name'
                                },
                                {
                                    path: 'country',
                                    model: Country,
                                    select: 'name'
                                }
                            ]
                        },
                        {
                            path: "certificateActivityId",
                            model: CertificateAndActivity,
                            populate: {
                                path: 'activityId',
                                select: 'title',
                                model: Activity,
                                populate: [
                                    {
                                        path: 'club',
                                        model: Club,
                                        select: 'name'
                                    }
                                ]
                            }
                        }
                    ])
                res.status(200).json({certificates: {docs: certificates}, success: true })
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
