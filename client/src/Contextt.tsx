import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
interface Info {
  info: {
    isloggedIn: boolean;
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    isDoctor: boolean;
    ws: WebSocket | null;
    makeConnection: boolean;
  };
  setInfo: any;
}
export const contextt = createContext<Info | null>(null);

const Contextt = ({ children }: { children: React.ReactNode }) => {
  const [info, setInfo] = useState({
    isloggedIn: false,
    firstName: "",
    lastName: "",
    email: "",
    id: "",
    isDoctor: false,
    ws: null,
    makeConnection: false,
  });
  useEffect(() => {
    if (info.isloggedIn && info.makeConnection) {
      const ws = new WebSocket(
        `ws://localhost:9000?isDoctor=${info.isDoctor}&&id=${info.id}`
      );
      setInfo((prev: any) => {
        return { ...prev, ws, makeConnection: false };
      });
      ws.addEventListener("message", (res) => {
        const message = JSON.parse(res.data);
        if (message.type == "error") {
          toast.error(message.message);
        } else if (message.type == "notification") {
          toast.success(`new In request with note ${message.note} `);
        } else if (message.type == "accepted") {
          toast.success(message.message);
        }
      });
    }
  }, [info]);
  useEffect(() => {
    toast("Welcome :) !");
    const getInfo = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/isloggedin", {
          withCredentials: true,
        });
        console.log(res.data);
        setInfo({
          isloggedIn: true,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          id: res.data.id,
          isDoctor: res.data.isDoctor,
          ws: null,
          makeConnection: true,
        });
      } catch (err) {}
    };
    getInfo();
  }, []);
  return (
    <contextt.Provider value={{ info, setInfo }}>{children}</contextt.Provider>
  );
};
export default Contextt;
