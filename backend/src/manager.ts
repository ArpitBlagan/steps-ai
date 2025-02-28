import { WebSocket } from "ws";
import { prisma } from "./index";
export class User {
  private static instance: User; // Create a static instance of the class
  private user: Map<string, any>;
  private Id: Map<WebSocket, string>;
  private constructor() {
    this.user = new Map();
    this.Id = new Map();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new User();
    }
    return this.instance;
  }

  addUser(id: string, ws: WebSocket, isDoctor: any) {
    if (!this.user.get(id)) {
      this.user.set(id, { ws, isDoctor });
      this.Id.set(ws, id);
      console.log("user added:)");
    }
  }
  removeUser(ws: WebSocket) {
    if (this.Id.get(ws)) {
      const id = this.Id.get(ws);
      if (id && this.user.get(id)) {
        this.user.delete(id);
        console.log("user connection closed so we remove the user:(");
      }
    }
  }

  async sendMessage(
    by: string,
    to: string,
    text: string,
    type: string,
    doctorId: string,
    patientId: string,
    ws: WebSocket
  ) {
    try {
      const conv = await prisma.conversation.findFirst({
        where: { doctorId, patientId },
      });
      if (conv) {
        await prisma.message.create({
          data: { by, to, type, text, conversationId: conv.id },
        });
      } else {
        const conversation = await prisma.conversation.create({
          data: { doctorId, patientId },
        });
        await prisma.message.create({
          data: { by, to, type, text, conversationId: conversation.id },
        });
      }
      const user = this.user.get(to);
      if (user) {
        user.ws.send(JSON.stringify({ kind: "message", by, to, text, type }));
      }
    } catch (err) {
      console.log("error while sending message:(");
      console.log(err);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "error while sending message",
        })
      );
    }
  }

  requestAccpeted(id: string, docName: string) {
    if (this.user.get(id)) {
      this.user.get(id).ws.send(
        JSON.stringify({
          type: "accepted",
          message: `Your request send to doctor ${docName} is accepted by him.`,
        })
      );
    }
  }
  async sendNotification(
    id: string,
    ws: WebSocket,
    to: string,
    note: string,
    patientName: string
  ) {
    try {
      const [request, notification] = await prisma.$transaction([
        prisma.request.create({ data: { note, patientId: id, doctorId: to } }),
        prisma.notification.create({
          data: {
            message: `Incoming request from patient ${patientName}`,
            doctorId: to,
          },
        }),
      ]);
      const user = this.user.get(to);
      user.ws.send(
        JSON.stringify({
          type: "notification",
          message: `Incoming request from patient ${patientName}`,
        })
      );
      ws.send(JSON.stringify({ type: "success" }));
      console.log("done");
    } catch (err) {
      console.log(err);
      console.log("error while executing sendNotification function:(");
      ws.send(
        JSON.stringify({
          type: "error",
          message: "something went wrong while sending request to doc:(",
        })
      );
    }
  }
}
