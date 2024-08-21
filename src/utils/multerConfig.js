import multer from "multer";
import path from "path";
import fs from 'fs';
import __dirname from "../utils.js"; 

const uploadDir = path.join(__dirname, "../uploads/");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const docType = file.fieldname;
        let uploadPath = path.join(uploadDir);

        if (docType === "profileImage") {
            uploadPath = path.join(uploadPath, "profiles/");
        } else if (docType === "productsImage") {
            uploadPath = path.join(uploadPath, "products/");
        } else if (docType === "Identificacion"||docType === "Comprobante de domicilio"||docType === "Comprobante de estado de cuenta" ) {
            uploadPath = path.join(uploadPath, "documents/");
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

export default upload;