import { Router } from "express";
import multer from "multer";
import { importFileController } from '../controllers/import.controller';

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(":type", upload.single("file"), importFileController);

export default router;