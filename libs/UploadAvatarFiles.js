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
            maxFiles: 1,
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
            if(files.avatar){
                const countImage = files.avatar[0].filepath.split('\\')
                // avatar
                const imageName = files.avatar[0].newFilename
                const imageFolder = files.avatar[0].filepath.split('\\')[countImage.length -2]

                inputs = {
                    avatar: `${imageFolder}/${imageName}`,
                }
            }
            if (err) reject(err);
            else resolve({inputs});
        });
    });
};
