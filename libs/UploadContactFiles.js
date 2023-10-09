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
            `/public/uploads/files/orders`
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
            maxFiles: 4,
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
                if(files.image){
                    const countImage = files.image[0].filepath.split('\\')
                    // avatar
                    const imageName = files.image[0].newFilename
                    const imageFolder = files.image[0].filepath.split('\\')[countImage.length -2]

                    inputs = {
                        title: fields.title.toString(),
                        user: fields.user.toString(),
                        image: `${imageFolder}/${imageName}`,
                        body: fields.body.toString(),
                        status: fields.status.toString(),
                        type: fields.type.toString(),
                        club: fields.club.toString(),
                        isEdit: fields.isEdit.toString(),
                    }
                } else{
                    inputs = {
                        title: fields.title.toString(),
                        user: fields.user.toString(),
                        image: null,
                        body: fields.body.toString(),
                        status: fields.status.toString(),
                        type: fields.type.toString(),
                        club: fields.club.toString(),
                        isEdit: fields.isEdit.toString(),
                    }
                }
            }else {
                if(files.image){
                    const countImage = files.image[0].filepath.split('\\')
                    // avatar
                    const imageName = files.image[0].newFilename
                    const imageFolder = files.image[0].filepath.split('\\')[countImage.length -2]

                    inputs = {
                        title: fields.title.toString(),
                        user: fields.user.toString(),
                        image: `${imageFolder}/${imageName}`,
                        body: fields.body.toString(),
                        status: fields.status.toString(),
                        type: fields.type.toString(),
                        club: fields.club.toString(),
                        isEdit: fields.isEdit.toString(),
                    }
                } else{
                    inputs = {
                        title: fields.title.toString(),
                        user: fields.user.toString(),
                        image: null,
                        body: fields.body.toString(),
                        status: fields.status.toString(),
                        type: fields.type.toString(),
                        club: fields.club.toString(),
                        isEdit: fields.isEdit.toString(),
                    }
                }
            }
            if (err) reject(err);
            else resolve({inputs});
        });
    });
};
