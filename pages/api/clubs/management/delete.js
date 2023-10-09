import {getServerSession} from "next-auth";
import {options} from "../../auth/[...nextauth]";
import connectMongoDB from "../../../../libs/mongodb";
import Club from "../../../../models/Club";
import Activity from "../../../../models/Activity";
import Contact from "../../../../models/Contact";
import Management from "../../../../models/Management";
import Post from "../../../../models/Post";
import User from "../../../../models/User";
import UserClub from "../../../../models/UserClub";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'DELETE'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            res.status(401).json({ error: 'غير مسجل الدخول' })
        }else {

            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.deleteClub.status
            ){
                await connectMongoDB()
                const {id} = req.query
                if(id.toString().length == 0){
                    res.status(204).json({ error: 'لا توجد بيانات' })
                }else {
                    const club = await Club.findById(id)
                    if(!club){
                        res.status(200).json({ mess: "النادي غير موجود" })
                    }else {
                        await Activity.deleteMany({club: id});
                        await Contact.deleteMany({club: id});
                        await Management.deleteMany({club: id});
                        await Post.deleteMany({ club: id});
                        await User.deleteMany({club: id});
                        await UserClub.deleteMany({club: id});
                        await Club.findByIdAndDelete(id)
                        res.status(201).json({ mess: 'تم حذف النادي بنجاح' })
                    }
                }
            }else {
                res.status(200).json({mess: 'عفوا، غير مسموح لك بحذف هذا النادي.'})
            }
        }
    }
}
