import connectMongoDB from "../../../libs/mongodb";
import User from "../../../models/User";
import {hash} from "bcrypt";
export default async (req, res) => {
    await connectMongoDB()

    if (req.method === 'POST') {
        if (!req.body) return res.status(200).json({ mess: "لا توجد بيانات." })

        const { name, username, email, idNumber, country, level, college, club, whatsapp, password, passwordConfirmation } = req.body
        if (await User.count({ username }) == 1){
            res.status(200).json({ mess: "الرقم الجامعي مسجل بالفعل، رجاء سجّل الدخول." })
        }else if (await User.count({ email }) == 1){
            res.status(200).json({ mess: "البريد مسجل بالفعل، رجاء سجّل الدخول." })
        }else if (await User.count({ idNumber }) == 1){
            res.status(200).json({ mess: "رقم الهوية مسجل بالفعل، رجاء سجّل الدخول." })
        } else {
            if(name.length == 0 || username.length == 0 || email.length == 0 || idNumber.length == 0 || country.length == 0 || level.length == 0 || college.length == 0 || club.length == 0 || whatsapp.length == 0 || password.length == 0 || passwordConfirmation.length == 0){
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
                        idNumber: idNumber,
                        whatsapp: whatsapp,
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
    }
    else {
        res.status(200).json({ mess: 'طريقة الطلب غير مسموح بها' })
    }


}
