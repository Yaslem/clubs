// import {getServerSession} from "next-auth";
// import {options} from "../../auth/[...nextauth]";
// import {uploadFiles} from "../../../../libs/UploadFiles";
// export default async function handler(req, res) {
//     const session = await getServerSession(req, res, options)
//     const {method} = req
//     if(method != 'POST'){
//         res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
//     }else {
//         if(!session){
//             return res.status(401).redirect('/auth/signin')
//         }else {
//             if(session.user.role != 'مدير' && session.user.role != 'منسق'){
//                 return res.status(403).redirect('/auth/signin')
//             }else {
//                 const { fileName } = await uploadFiles(req, name, 'profile');
//                 return res.status(201).json({ success: true, fileName })
//             }
//         }
//     }
// }
