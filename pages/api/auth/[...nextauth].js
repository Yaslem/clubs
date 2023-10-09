import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongoDB from "../../../libs/mongodb";
import User from "../../../models/User";
import {compare} from "bcrypt";
import Club from "../../../models/Club";
import Level from "../../../models/Level";
import Country from "../../../models/Country";
import College from "../../../models/College";

export const options = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                await connectMongoDB()
                const userC = await User.findOne({username: credentials.username})
                    .select("+password name whatsapp permissions username role idNumber password type avatar email club level college country")
                    .populate([
                        {
                            path: 'club',
                            model: Club,
                            select: 'name cover',
                        },
                        {
                            path: 'level',
                            model: Level,
                            select: 'name'
                        },
                        {
                            path: 'country',
                            model: Country,
                            select: 'name'
                        },
                        {
                            path: 'college',
                            model: College,
                            select: 'name'
                        }
                    ])

                if (!userC) {
                    throw new Error("يوجد خطأ في الرقم الجامعي.")
                } else {
                    const isPassword = await compare(credentials.password, userC.password)

                    if(!isPassword){
                        throw new Error("يوجد خطأ في كلمة المرور.")
                    }

                    const user = {
                        id: userC._id,
                        name: userC.name,
                        username: userC.username,
                        permissions: userC.permissions,
                        type: userC.type,
                        role: userC.role,
                        idNumber: userC.idNumber,
                        whatsapp: userC.whatsapp,
                        avatar: userC.avatar,
                        email: userC.email,
                        club: userC.club,
                        level: userC.level,
                        college: userC.college,
                        country: userC.country,
                    }
                    return user
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/signin"
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60
    },
    callbacks: {
        jwt: async ({token, user}) => {
            user && (token.user = user)
            return token
        },
        session: async ({session, token}) => {
            session.user = token.user
            return session
        },
    },
    secret: process.env.SECRET

}
export default NextAuth(options);
