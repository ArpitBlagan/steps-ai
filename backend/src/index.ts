import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
import { User } from "./manager";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
export const prisma = new PrismaClient();
dotenv.config();
import { router } from "./routes";
const instance = User.getInstance();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api", router);

const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket, req: Request) => {
  console.log("url", req.url);
  const arr = req.url.split("=");
  const len = arr.length;
  const id = arr[len - 1];
  const isDoctor = arr[len - 2].substr(0, 4);
  console.log(id, isDoctor);
  if (id) {
    instance.addUser(id, ws, isDoctor);
  }
  ws.on("message", async (data: any) => {
    const message = JSON.parse(data);
    if (message.type == "notification") {
      console.log("notificatoin");
      instance.sendNotification(
        message.by,
        ws,
        message.to,
        message.note,
        message.name
      );
    } else if (message.type == "accept") {
      instance.requestAccpeted(message.id, message.docName);
    } else if (message.type == "text") {
      instance.sendMessage(
        message.by,
        message.to,
        message.text,
        message.type,
        message.doctorId,
        message.patientId,
        ws
      );
    }
  });
  ws.on("close", () => {
    instance.removeUser(ws);
  });
});
server.listen(process.env.PORT || 9000, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
