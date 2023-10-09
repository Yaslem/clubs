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
            `/public/uploads/files/reports`
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
                if(files.imagesOne && files.imagesTwo && files.imagesThree && files.imagesFour){
                    const countImageOne = files.imagesOne[0].filepath.split('\\')
                    const countImageTwo = files.imagesTwo[0].filepath.split('\\')
                    const countImageThree = files.imagesThree[0].filepath.split('\\')
                    const countImageFour = files.imagesFour[0].filepath.split('\\')
                    // avatar
                    const imageNameOne = files.imagesOne[0].newFilename
                    const imageNameTwo = files.imagesTwo[0].newFilename
                    const imageNameThree = files.imagesThree[0].newFilename
                    const imageNameFour = files.imagesFour[0].newFilename

                    const imageFolderOne = files.imagesOne[0].filepath.split('\\')[countImageOne.length -2]
                    const imageFolderTwo = files.imagesTwo[0].filepath.split('\\')[countImageTwo.length -2]
                    const imageFolderThree = files.imagesThree[0].filepath.split('\\')[countImageThree.length -2]
                    const imageFolderFour = files.imagesFour[0].filepath.split('\\')[countImageFour.length -2]

                    inputs = {
                        summary: fields.summary.toString(),
                        notes: fields.notes.toString(),
                        numbers: fields.numbers.toString(),
                        images: `${imageFolderOne}/${imageNameOne},${imageFolderTwo}/${imageNameTwo},${imageFolderThree}/${imageNameThree},${imageFolderFour}/${imageNameFour}`,
                        club: fields.club.toString(),
                        activity: fields.activity.toString(),
                        user: fields.user.toString(),
                        isEdit: fields.isEdit.toString(),
                    }
                }
            }else {
                if(files.imagesOne && files.imagesTwo && files.imagesThree && files.imagesFour){
                    const countImageOne = files.imagesOne[0].filepath.split('\\')
                    const countImageTwo = files.imagesTwo[0].filepath.split('\\')
                    const countImageThree = files.imagesThree[0].filepath.split('\\')
                    const countImageFour = files.imagesFour[0].filepath.split('\\')
                    // avatar
                    const imageNameOne = files.imagesOne[0].newFilename
                    const imageNameTwo = files.imagesTwo[0].newFilename
                    const imageNameThree = files.imagesThree[0].newFilename
                    const imageNameFour = files.imagesFour[0].newFilename

                    const imageFolderOne = files.imagesOne[0].filepath.split('\\')[countImageOne.length -2]
                    const imageFolderTwo = files.imagesTwo[0].filepath.split('\\')[countImageTwo.length -2]
                    const imageFolderThree = files.imagesThree[0].filepath.split('\\')[countImageThree.length -2]
                    const imageFolderFour = files.imagesFour[0].filepath.split('\\')[countImageFour.length -2]

                    inputs = {
                        reportId: fields.reportId.toString(),
                        summary: fields.summary.toString(),
                        notes: fields.notes.toString(),
                        numbers: fields.numbers.toString(),
                        images: `${imageFolderOne}/${imageNameOne},${imageFolderTwo}/${imageNameTwo},${imageFolderThree}/${imageNameThree},${imageFolderFour}/${imageNameFour}`,
                        club: fields.club.toString(),
                        activity: fields.activity.toString(),
                        user: fields.user.toString(),
                        isEdit: fields.isEdit.toString(),
                    }
                }else {
                    inputs = {
                        reportId: fields.reportId.toString(),
                        summary: fields.summary.toString(),
                        notes: fields.notes.toString(),
                        numbers: fields.numbers.toString(),
                        club: fields.club.toString(),
                        activity: fields.activity.toString(),
                        user: fields.user.toString(),
                        isEdit: fields.isEdit.toString(),
                    }
                }
            }
            console.log(inputs)
            if (err) reject(err);
            else resolve({inputs});
        });
    });
};
