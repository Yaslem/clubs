import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import CertificateAndActivity from "../../../models/CertificateAndActivity";
import Activity from "../../../models/Activity";
import Certificate from "../../../models/Certificate";
import Club from "../../../models/Club";
import Location from "../../../models/Location";
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
                && session.user.permissions.showCertificate.status
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'activityId',
                            select: "title presenter location date club createdAt",
                            model: Activity,
                            populate: [
                                {
                                    path: 'club',
                                    select: "name",
                                    model: Club,
                                },
                                {
                                    path: 'location',
                                    model: Location,
                                    select: "name",
                                }
                            ]
                        },
                        {
                            path: 'studentsCount',
                            model: Certificate,
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const certificates = await CertificateAndActivity.paginate({}, options)
                if(certificates.totalDocs == 0){
                    res.status(200).json({certificates, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({certificates, success: true })
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.showCertificate.status
            ){
                await connectMongoDB()
                const options = {
                    populate: [
                        {
                            path: 'activityId',
                            select: "title presenter location date club createdAt",
                            model: Activity,
                            populate: [
                                {
                                    path: 'club',
                                    model: Club,
                                    select: "name",
                                    match: {_id: session.user.club._id}
                                },
                                {
                                    path: 'location',
                                    model: Location,
                                    select: "name",
                                }
                            ],
                        },
                        {
                            path: 'studentsCount',
                            model: Certificate,
                        }
                    ],
                    sort: { createdAt: -1 },
                    page: req.query.page,
                    limit: 6,
                };
                const certificates = await CertificateAndActivity.paginate({}, options)
                if(certificates.totalDocs === 0){
                    res.status(200).json({certificates, mess: 'لا توجد بيانات', success: false })
                }else {
                    res.status(200).json({certificates, success: true })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
