import connectMongoDB from "../../../libs/mongodb";
import PasswordReset from "../../../models/PasswordReset";
import User from "../../../models/User";
let nodemailer = require('nodemailer')
export default async (req, res) => {
    await connectMongoDB()
    if (req.method === 'POST') {
        if (!req.body) return res.status(200).json({ mess: "لا توجد بيانات." })
        const {username} = req.body
        const user = await User.findOne({ username })
        if (!user){
            res.status(200).json({ mess: "الرقم الجامعي غير موجود، رجاء سجّل حسابا جديدا." })
        }else {
            if(username.length == 0){
                res.status(200).json({ mess: "لا توجد بيانات." })
            }else {
                if (!isNaN(user.email)){
                    res.status(200).json({ mess: "يوجد خطأ ما، رجاء التواصل مع فريق الإشراف على الأندية الطلابية." })
                }else {
                    const token = Math.random().toString(36).substr(2)
                    const d = new Date();
                    const dateString = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
                    await PasswordReset.create({
                        email: user.email,
                        token,
                        time: dateString.split(" ")[1],
                        IsActivated: true,
                    })
                    const transporter = nodemailer.createTransport({
                        port: 465,
                        host: "clubs-iu.com",
                        auth: {
                            user: 'password_reset@clubs-iu.com',
                            pass: '5DqQVnY7:27dUfk',
                        },
                        secure: true,
                    })

                    const mailData = {
                        from: 'password_reset@clubs-iu.com',
                        to: user.email,
                        subject: `إعادة تعيين كلمة المرور للطالب ${user.name}`,
                        text: 'طلبت إعادة تعيين كلمة مرورك، رجاء اضغط على الرابط الموجود لإعادة تعيين كلمة مرورك.',
                    }
                    transporter.sendMail(mailData, function (err, info) {
                        if(err)
                            console.log(err)
                        else
                            console.log(info)
                    })
                    return res.status(201).json({ success: true, mess: "تم إرسال رابط إعادة تعيين كلمة المرور على بريدك الإلكتروني.", })
                }
            }
        }
    }
    else {
        res.status(200).json({ mess: 'طريقة الطلب غير مسموح بها' })
    }


}
