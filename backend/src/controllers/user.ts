import { Request, Response } from "express";
import { prisma } from "../index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const addPatient = async (req: Request, res: Response) => {
  const { id, patientId } = req.body;
  try {
    await prisma.$transaction([
      prisma.request.delete({ where: { id } }),
      prisma.docAndPatient.create({
        data: {
          doctorId: req.user.id,
          patientId,
        },
      }),
    ]);
    res.status(202).json({ message: `assigned patient to doctor` });
  } catch (err) {
    res.status(500).json({ message: "something went wrong:(" });
  }
};
export const loginDoc = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.doctor.findFirst({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "invalid email and password combination:(" });
    }
    const val = await bcrypt.compare(password, user?.password);
    if (!val) {
      return res
        .status(400)
        .json({ message: "invalid email and password combination:(" });
    }
    const token = jwt.sign(
      {
        user: {
          email: user.email,
          lastName: user.lastName,
          firstName: user.firstName,
          id: user.id,
          isDoctor: true,
        },
      },
      "#!$safE2!@@#342"
    );
    res.cookie("token", token, {
      sameSite: "none",
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isDoctor: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong:(" });
  }
};
export const registerDoc = async (req: Request, res: Response) => {
  const { firstName, lastName, password, specialty, email } = req.body;
  try {
    const user = await prisma.doctor.findFirst({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "email already registered:(" });
    }
    const hash = await bcrypt.hash(password, 10);
    await prisma.doctor.create({
      data: {
        firstName,
        lastName,
        email,
        password: hash,
        specialty,
      },
    });
    res.status(202).json({ message: "doctor registered successfully:)" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong:(" });
  }
};
export const loginPatient = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.patient.findFirst({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "invalid email and password combination:(" });
    }
    const val = await bcrypt.compare(password, user?.password);
    if (!val) {
      return res
        .status(400)
        .json({ message: "invalid email and password combination:(" });
    }
    const token = jwt.sign(
      {
        user: {
          email: user.email,
          lastName: user.lastName,
          firstName: user.firstName,
          id: user.id,
          isDoctor: false,
        },
      },
      "#!$safE2!@@#342"
    );

    res.cookie("token", token, {
      sameSite: "none",
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isDoctor: false,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong:(" });
  }
};
export const registerPatient = async (req: Request, res: Response) => {
  const { firstName, lastName, password, email } = req.body;
  try {
    const user = await prisma.patient.findFirst({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "email already registered:(" });
    }
    const hash = await bcrypt.hash(password, 10);
    await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email,
        password: hash,
      },
    });
    res.status(202).json({ message: "Patient registered successfully:)" });
  } catch (err) {
    res.status(500).json({ message: "something went wrong:(" });
  }
};
export const getPdf = async (req: Request, res: Response) => {
  const { id } = req.user;
  console.log("cool", req.user);
  try {
    const data = await prisma.doctor.findFirst({
      where: { id },
      include: {
        pdfs: true,
        patients: {
          select: {
            patient: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
    console.log("cool", data, id);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong:(" });
  }
};
export const getRelation = async (req: Request, res: Response) => {
  const { id } = req.user;
  try {
    const data = await prisma.patient.findFirst({
      where: { id },
      include: {
        doctors: {
          select: {
            doctor: {
              select: {
                firstName: true,
                lastName: true,
                specialty: true,
                email: true,
              },
            },
          },
        },
      },
    });
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong:(" });
  }
};
export const deletePdf = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.pdfs.delete({ where: { id } });
    res.status(202).json({ message: "pdf deleted successfully:)" });
  } catch (err) {
    res.status(500).json({ message: "something went wrong:(" });
  }
};
export const sendRequest = async (
  patientId: string,
  doctorId: string,
  note: string
) => {
  try {
    await prisma.request.create({
      data: {
        doctorId,
        patientId,
        note,
      },
    });
    return { message: "send:)" };
  } catch (err) {
    return { error: "something went wrong:(" };
  }
};
export const getRequest = async (req: Request, res: Response) => {
  const { id } = req.user;
  try {
    const requests = await prisma.request.findMany({
      where: { doctorId: id },
      include: { patient: true },
    });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "something went wrong:(" });
  }
};

export const getDoctors = async (req: Request, res: Response) => {
  const { id } = req.user;
  try {
    const user = await prisma.patient.findFirst({
      where: { id },
      include: { request: true },
    });
    const doctors = await prisma.doctor.findMany({
      include: { patients: true },
    });
    res.status(200).json({ doctors, request: user ? user.request : [] });
  } catch (err) {
    res.status(500).json({ message: "something went wrong:(" });
  }
};
