import {getServerSession} from "next-auth";
import {options} from "../auth/[...nextauth]";
import connectMongoDB from "../../../libs/mongodb";
import Club from "../../../models/Club";
import User from "../../../models/User";
import Activity from "../../../models/Activity";
import Post from "../../../models/Post";
export default async function handler(req, res) {
    await connectMongoDB()
    const clubs = await Club.find({}, 'name studentsCount postsCount activitiesCount cover').populate([
        {
            path: 'studentsCount',
            model: User
        },
        {
            path: 'activitiesCount',
            model: Activity,
        },
        {
            path: 'postsCount',
            model: Post,
        }
    ])
    res.status(200).json({clubs, success: true })
}
