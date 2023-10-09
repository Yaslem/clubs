import connectMongoDB from "../../libs/mongodb";
import Result from "../../models/Result";
import Club from "../../models/Club";
import Year from "../../models/Year";
export default async function handler(req, res) {
    const {method} = req
    if(method !== 'GET'){
        res.status(403).json({ error: 'طريقة الطلب غير مسموح بها' })
    }else {
        await connectMongoDB()
        const options = {
            sort: { number: 1 },
            select: 'number name result year club',
            populate: [
                {
                    path: 'club',
                    select: 'name avatar',
                    model: Club
                },
                {
                    path: 'year',
                    select: 'nameH nameM',
                    model: Year
                }
            ],
            page: req.query.page,
            limit: 200,
        };
        const results = await Result.paginate({}, options)
        if(results.totalDocs === 0){
            res.status(200).json({ mess: 'لا توجد بيانات', success: false })
        }
        res.status(200).json({results, success: true })
    }
}
