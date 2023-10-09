import mime from "mime";
import { join } from "path";
import * as dateFn from "date-fns";
import formidable from "formidable";
// var formidable = require("formidable");
import { mkdir, stat } from "fs/promises";

export const uploadFiles = async (req) => {
    const FileName = dateFn.format(Date.now(), "MM-Y");
    return new Promise(async (resolve, reject) => {
        const uploadDir = join(
            process.env.ROOT_DIR || process.cwd(),
            `/public/uploads/files/avatars`
        );

        try {
            await stat(uploadDir);
        } catch (e) {
            if (e.code === "ENOENT") {
                await mkdir(uploadDir, { recursive: true });
            } else {
                console.error(e);
                reject(e);
                return;
            }
        }
        const form = formidable({
            maxFiles: 2,
            maxFileSize: 10240 * 1024, // 10mb
            uploadDir,
            filename: (_name, _ext, part) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const filename = `${part.name || "unknown"}-${uniqueSuffix}.${
                    mime.getExtension(part.mimetype || "") || "unknown"
                }`;
                return filename;
            },
            // filter: (part) => {
            //     return (
            //         part.name === "cover" && (part.mimetype?.includes("image") || false)
            //     );
            // },
        });

        form.parse(req, function (err, fields, files) {
            let inputs = {}
            if(fields.isEdit.toString() === "false"){
                if(files.avatar && files.cover){
                    const countAvatar = files.avatar[0].filepath.split('\\')
                    const countCover = files.cover[0].filepath.split('\\')

                    // avatar
                    const avatarName = files.avatar[0].newFilename
                    let avatarFolder = files.avatar[0].filepath.split('\\')[countAvatar.length -2]

                    // cover
                    const coverName = files.cover[0].newFilename
                    let coverFolder = files.cover[0].filepath.split('\\')[countCover.length -2]

                    inputs = {
                        name: fields.name.toString(),
                        cover: `${coverFolder}/${coverName}`,
                        avatar: `${avatarFolder}/${avatarName}`,
                        description: fields.description.toString(),
                        goals: fields.goals.toString(),
                        values: fields.values.toString(),
                        vision: fields.vision.toString(),
                        message: fields.message.toString(),
                        telegram: fields.telegram.toString(),
                        manager: fields.manager.toString(),
                        whatsapp: fields.whatsapp.toString(),
                    }
                }else if(files.avatar){
                    const countAvatar = files.avatar[0].filepath.split('\\')

                    // avatar
                    const avatarName = files.avatar[0].newFilename
                    let avatarFolder = files.avatar[0].filepath.split('\\')[countAvatar.length -2]

                    inputs = {
                        name: fields.name.toString(),
                        cover: null,
                        avatar: `${avatarFolder}/${avatarName}`,
                        description: fields.description.toString(),
                        goals: fields.goals.toString(),
                        values: fields.values.toString(),
                        vision: fields.vision.toString(),
                        message: fields.message.toString(),
                        telegram: fields.telegram.toString(),
                        manager: fields.manager.toString(),
                        whatsapp: fields.whatsapp.toString(),
                    }
                }else if(files.cover){
                    const countCover = files.cover[0].filepath.split('\\')

                    // cover
                    const coverName = files.cover[0].newFilename
                    let coverFolder = files.cover[0].filepath.split('\\')[countCover.length -2]

                    inputs = {
                        name: fields.name.toString(),
                        cover: `${coverFolder}/${coverName}`,
                        avatar: null,
                        description: fields.description.toString(),
                        goals: fields.goals.toString(),
                        values: fields.values.toString(),
                        vision: fields.vision.toString(),
                        message: fields.message.toString(),
                        telegram: fields.telegram.toString(),
                        manager: fields.manager.toString(),
                        whatsapp: fields.whatsapp.toString(),
                    }
                }else{
                    inputs = {
                        name: fields.name.toString(),
                        cover: null,
                        avatar: null,
                        description: fields.description.toString(),
                        goals: fields.goals.toString(),
                        values: fields.values.toString(),
                        vision: fields.vision.toString(),
                        message: fields.message.toString(),
                        telegram: fields.telegram.toString(),
                        manager: fields.manager.toString(),
                        whatsapp: fields.whatsapp.toString(),
                    }
                }
            }else {
                if(files.avatar && files.cover){
                    const countAvatar = files.avatar[0].filepath.split('\\')
                    const countCover = files.cover[0].filepath.split('\\')

                    // avatar
                    const avatarName = files.avatar[0].newFilename
                    let avatarFolder = files.avatar[0].filepath.split('\\')[countAvatar.length -2]

                    // cover
                    const coverName = files.cover[0].newFilename
                    let coverFolder = files.cover[0].filepath.split('\\')[countCover.length -2]

                    inputs = {
                        name: fields.name.toString(),
                        clubId: fields.clubId.toString(),
                        cover: `${coverFolder}/${coverName}`,
                        avatar: `${avatarFolder}/${avatarName}`,
                        description: fields.description.toString(),
                        goals: fields.goals.toString(),
                        values: fields.values.toString(),
                        vision: fields.vision.toString(),
                        message: fields.message.toString(),
                        telegram: fields.telegram.toString(),
                        manager: fields.manager.toString(),
                        whatsapp: fields.whatsapp.toString(),
                    }
                }else if(files.avatar){
                    const countAvatar = files.avatar[0].filepath.split('\\')

                    // avatar
                    const avatarName = files.avatar[0].newFilename
                    let avatarFolder = files.avatar[0].filepath.split('\\')[countAvatar.length -2]

                    inputs = {
                        name: fields.name.toString(),
                        clubId: fields.clubId.toString(),
                        cover: fields.cover.toString(),
                        avatar: `${avatarFolder}/${avatarName}`,
                        description: fields.description.toString(),
                        goals: fields.goals.toString(),
                        values: fields.values.toString(),
                        vision: fields.vision.toString(),
                        message: fields.message.toString(),
                        telegram: fields.telegram.toString(),
                        manager: fields.manager.toString(),
                        whatsapp: fields.whatsapp.toString(),
                    }
                }else if(files.cover){
                    const countCover = files.cover[0].filepath.split('\\')

                    // cover
                    const coverName = files.cover[0].newFilename
                    let coverFolder = files.cover[0].filepath.split('\\')[countCover.length -2]

                    inputs = {
                        name: fields.name.toString(),
                        clubId: fields.clubId.toString(),
                        cover: `${coverFolder}/${coverName}`,
                        avatar: fields.avatar.toString(),
                        description: fields.description.toString(),
                        goals: fields.goals.toString(),
                        values: fields.values.toString(),
                        vision: fields.vision.toString(),
                        message: fields.message.toString(),
                        telegram: fields.telegram.toString(),
                        manager: fields.manager.toString(),
                        whatsapp: fields.whatsapp.toString(),
                    }
                }else{
                    inputs = {
                        name: fields.name.toString(),
                        clubId: fields.clubId.toString(),
                        cover: fields.cover.toString(),
                        avatar: fields.avatar.toString(),
                        description: fields.description.toString(),
                        goals: fields.goals.toString(),
                        values: fields.values.toString(),
                        vision: fields.vision.toString(),
                        message: fields.message.toString(),
                        telegram: fields.telegram.toString(),
                        manager: fields.manager.toString(),
                        whatsapp: fields.whatsapp.toString(),
                    }
                }
            }
            if (err) reject(err);
            else resolve({inputs});
        });
    });
};
