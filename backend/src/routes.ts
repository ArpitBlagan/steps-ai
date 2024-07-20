import { Request, Response, Router } from "express";
import { validateToken } from "./middlewares/token";
import { prisma } from "./index";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
  },
});
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  addPatient,
  deletePdf,
  getDocs,
  getDoctorConv,
  getDoctors,
  getPatientConv,
  getPatients,
  getPdf,
  getRelation,
  getRequest,
  loginDoc,
  loginPatient,
  registerDoc,
  registerPatient,
} from "./controllers/user";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export const router = Router();

router.route("/doc/login").post(loginDoc);
router.route("/doc/register").post(registerDoc);
router.route("/patient/login").post(loginPatient);
router.route("/patient/register").post(registerPatient);

router.use(validateToken);

router
  .route("/upload")
  .post(upload.single("file"), async (req: Request, res: Response) => {
    const { title } = req.body;
    console.log(req.file);
    if (!req.file) {
      return res.status(404).json({ message: "pdf not found:(" });
    }
    const fileContent = fs.readFileSync(req.file.path);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: req.file.filename,
      Body: fileContent,
      ContentType: "application/pdf",
    };

    const command = new PutObjectCommand(params as any);
    try {
      const response = await s3Client.send(command);
      console.log("File uploaded successfully:", response);
      const path = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${req.file.filename}`;
      console.log(path);
      await prisma.pdfs.create({
        data: {
          title,
          filePath: path,
          doctorId: req.user.id,
        },
      });
      // Clean up uploaded file from local storage
      //@ts-ignore
      fs.unlinkSync(req.file.path);
      res.status(202).json({ message: "uploaded successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong:(" });
    }
  });

router.route("/accept").post(addPatient);
router.route("/isloggedin").get(async (req: Request, res: Response) => {
  res.status(200).json(req.user);
});
router.route("/logout").get(async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "logout successfullly:)" });
});
router.route("/pdfs").get(getPdf);
router.route("/pdf/:id").delete(deletePdf);
router.route("/relation").get(getRelation);
router.route("/doctors").get(getDoctors);
router.route("/request").get(getRequest);
router.route("/getdocs").get(getDocs);
router.route("/getpatients").get(getPatients);
router.route("/getconv/patient/:idd").get(getPatientConv);
router.route("/getconv/doctor/:idd").get(getDoctorConv);
