import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import CertificateAndActivity from "../../../../models/CertificateAndActivity";
import Certificate from "../../../../models/Certificate";
import Club from "../../../../models/Club";
import Activity from "../../../../models/Activity";
import User from "../../../../models/User";
import Country from "../../../../models/Country";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            await connectMongoDB()
            const {certificateId} = req.query
            if(certificateId){
                if(
                    (session.user.role === 'admin'
                        || session.user.role === 'coordinator'
                        || session.user.role === 'president')
                    && session.user.permissions.showCertificate.status
                ){
                    const certificate = await CertificateAndActivity.findById(certificateId)
                        .populate({
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
                        })
                    if(certificate){
                        const options = {
                            populate: [
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
                            ],
                            sort: { createdAt: -1 },
                            page: req.query.page,
                            limit: 20,
                        };
                        const students = await Certificate.paginate({certificateActivityId: certificate._id}, options)
                        if(students.length == 0){
                            res.status(200).json({certificates: {students, certificate}, success: false })
                        }else {
                            res.status(200).json({certificates: {students, certificate}, success: true })
                        }

                    }else {
                        return res.status(404).redirect('/')
                    }
                }else if(
                    (session.user.role === 'manager'
                        || session.user.role === 'deputy'
                        || session.user.role === 'officials')
                    && session.user.permissions.showCertificate.status
                ){
                    const certificate = await CertificateAndActivity.findById(certificateId)
                        .populate({
                            path: 'activityId',
                            select: 'title',
                            model: Activity,
                            populate: [
                                {
                                    path: 'club',
                                    model: Club,
                                    select: 'name'
                                }
                            ],
                            match: {club: session.user.club._id}
                        })
                    if(certificate){
                        if(certificate.activityId != null){
                            const options = {
                                populate: [
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
                                ],
                                sort: { createdAt: -1 },
                                page: req.query.page,
                                limit: 20,
                            };
                            const students = await Certificate.paginate({certificateActivityId: certificate._id}, options)
                            if(students.length == 0){
                                res.status(200).json({certificates: {students, certificate}, success: false })
                            }else {
                                res.status(200).json({certificates: {students, certificate}, success: true })
                            }
                        }
                    }else {
                        return res.status(404).redirect('/')
                    }
                }else {

                }
            }else {
                return res.status(404).redirect('/')
            }
        }
    }
}
