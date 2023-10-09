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
    if(method != 'POST'){
        res.status(200).json({ mess: 'طريقة الطلب غير مسموح بها' })
    }else {
        if(!session){
            return res.status(401).redirect('/auth/signin')
        }else {
            if(
                (session.user.role === 'admin'
                    || session.user.role === 'coordinator'
                    || session.user.role === 'president')
                && session.user.permissions.addStudent.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {name, username, email, idNumber, country, level, college, type, role, club, whatsapp, password, passwordConfirmation} = req.body
                    if (await User.count({ username }) == 1){
                        res.status(200).json({ mess: "الرقم الجامعي مسجل بالفعل، رجاء سجّل الدخول." })
                    }else if (await User.count({ email }) == 1){
                        res.status(200).json({ mess: "البريد مسجل بالفعل، رجاء سجّل الدخول." })
                    }else if (await User.count({ idNumber }) == 1){
                        res.status(200).json({ mess: "رقم الهوية مسجل بالفعل، رجاء سجّل الدخول." })
                    }else {
                        if(name.length == 0 || username.length == 0 || email.length == 0 || idNumber.length == 0 || country.length == 0 || level.length == 0 || college.length == 0 || type.length == 0 || role.length == 0 || club.length == 0 || whatsapp.length == 0 || password.length == 0 || passwordConfirmation.length == 0){
                            res.status(200).json({ mess: "لا توجد بيانات." })
                        }else {
                            if(password != passwordConfirmation){
                                res.status(200).json({ mess: "كلمات المرور غير متطابقة" })
                            }else {
                                const hashedPassword = await hash(password, 12)
                                await User.create({
                                    name: name,
                                    username: username,
                                    password: hashedPassword,
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
                                return res.status(201).json({ success: true, mess: "تم إنشاء الحساب بنجاح", })
                            }
                        }
                    }
                }else {
                    if (session.user.role === 'admin'){
                        const {users} = req.body
                        if(users.length === 0){
                            res.status(200).json({ mess: "لا توجد بيانات" })
                        }
                        users.map(async student => {
                            const studentIS = await User.findOne({username: student.username})
                            if(!studentIS){
                                const clubId = await Club.findOne({clubId: student.club})
                                const levelId = await Level.findOne({levelId: student.level})
                                const collegeId = await College.findOne({collegeId: student.college})
                                const countryId = await Country.findOne({countryId: student.country})
                                if(clubId && levelId && collegeId && countryId){
                                    const hashedPassword = await hash(student.password, 12)
                                    await User.create({
                                        userId: parseInt(student.id),
                                        name: student.name,
                                        createdAt: student.createdAt,
                                        username: student.username,
                                        password: hashedPassword,
                                        role: student.role,
                                        idNumber: student.idNumber,
                                        whatsapp: student.whatsapp,
                                        email: student.email,
                                        club: clubId._id,
                                        level: levelId._id,
                                        college: collegeId._id,
                                        country: countryId._id,
                                    })
                                }
                            }
                        })
                        res.status(201).json({ success: true, mess: "تم إنشاء الحسابات بنجاح"})
                    }else {
                        res.status(200).json({ success: true, mess: "لا يمكنك إنشاء هذه الحسابات."})
                    }
                }
            }else if(
                (session.user.role === 'manager'
                    || session.user.role === 'deputy'
                    || session.user.role === 'officials')
                && session.user.permissions.addStudent.status
            ){
                await connectMongoDB()
                const {isFile} = req.body
                if(isFile == false){
                    const {name, username, email, idNumber, country, level, college, type, role, club, whatsapp, password, passwordConfirmation} = req.body
                    const studentIS = await User.findOne({username})
                    if(studentIS){
                        res.status(200).json({ mess: "هذا الطالب موجود" })
                    }else {
                        if(name.length == 0 || username.length == 0 || email.length == 0 || idNumber.length == 0 || country.length == 0 || level.length == 0 || college.length == 0 || type.length == 0 || role.length == 0 || club.length == 0 || whatsapp.length == 0 || password.length == 0 || passwordConfirmation.length == 0){
                            res.status(200).json({ mess: "لا توجد بيانات." })
                        }else {
                            if(password != passwordConfirmation){
                                res.status(200).json({ mess: "كلمات المرور غير متطابقة" })
                            }else {
                                const hashedPassword = await hash(password, 12)
                                await User.create({
                                    name: name,
                                    username: username,
                                    password: hashedPassword,
                                    role: role === "officials" ? role : "student",
                                    idNumber: idNumber,
                                    whatsapp: whatsapp,
                                    type: type,
                                    email: email,
                                    club: club,
                                    level: level,
                                    college: college,
                                    country: country,
                                })
                                return res.status(201).json({ success: true, mess: "تم إنشاء الحساب بنجاح", })
                            }
                        }
                    }
                }else {
                    res.status(200).json({ mess: "لا توجد بيانات" })
                }
            }else {
                res.status(403).redirect('/not-allowed')
            }
        }
    }
}
