import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import User from "../../../models/User";
import {hash} from "bcrypt";
import Club from "../../../models/Club";
import Level from "../../../models/Level";
import College from "../../../models/College";
import Country from "../../../models/Country";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, options)
    const {method} = req
    if(method != 'PUT'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.editStudent.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {id, name, username, email, idNumber, country, level, college, type, role, club, whatsapp} = req.body
                    if(id.toString().length == 0 || name.toString().length == 0 || username.toString().length == 0 || email.toString().length == 0 || idNumber.toString().length == 0 || country.toString().length == 0 || level.toString().length == 0 || college.toString().length == 0 || type.toString().length == 0 || role.length == 0 || club.toString().length == 0 || whatsapp.toString().length == 0){
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }else {
                        const user = await User.findById(id)
                        if(user){
                            await User.findByIdAndUpdate(id, {
                                name: name,
                                username: username,
                                role: role,
                                idNumber: idNumber,
                                whatsapp: whatsapp,
                                type: type,
                                email: email,
                                club: club,
                                level: level,
                                college: college,
                                country: country,
                            })
                            res.status(201).json({ success: true, mess: "تم تحديث الحساب بنجاح."})
                        }else {
                            res.status(200).json({ mess: "لا توجد بيانات." })
                        }
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }
            }else if(
                (session.user.role === 'manager' || session.user.role === 'deputy' || session.user.role === 'officials') && session.user.permissions.editStudent.status
            ){
                const {id, name, username, email, idNumber, country, level, college, type, role, club, whatsapp} = req.body
                if(id.toString().length == 0 || name.toString().length == 0 || username.toString().length == 0 || email.toString().length == 0 || idNumber.toString().length == 0 || country.toString().length == 0 || level.toString().length == 0 || college.toString().length == 0 || type.toString().length == 0 || role.length == 0 || club.toString().length == 0 || whatsapp.toString().length == 0){
                    res.status(200).json({ mess: "لا توجد بيانات." })
                }else {
                    const user = await User.findById(id)
                    if(user){
                        await User.findByIdAndUpdate(id, {
                            name: name,
                            username: username,
                            role: (role === "officials" || role === "deputy") ? role : "student",
                            idNumber: idNumber,
                            whatsapp: whatsapp,
                            type: type,
                            email: email,
                            club: club,
                            level: level,
                            college: college,
                            country: country,
                        })
                        res.status(201).json({ success: true, mess: "تم تحديث الحساب بنجاح."})
                    }else {
                        res.status(200).json({ mess: "لا توجد بيانات." })
                    }
                }
            }else {
                res.status(200).json({ mess: "غير مسموج لك بتعديل معلومات هذا الطالب." })
            }
        }
    }
}
