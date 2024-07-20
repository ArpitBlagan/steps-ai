import { useContext, useEffect, useRef, useState } from "react";
import { contextt } from "./Contextt";
import { toast } from "react-toastify";
import axios from "axios";
import pingme from "./images/Pimg-Mee.png";
import { ArrowLeft, EllipsisVertical, Laugh, X } from "lucide-react";
import { Input } from "./components/ui/input";
import EmojiPicker from "emoji-picker-react";
import { Button } from "./components/ui/button";
const Chat = () => {
  const value = useContext(contextt);
  const [socket, setSoc] = useState<WebSocket | null>(null);
  const [sele, setSele] = useState<any | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [emojiOpen, setEmojiOpne] = useState(false);
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);
  const scrollRef2 = useRef(null);
  const seleId = useRef(null);
  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      //@ts-ignore
      scrollRef.current?.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    }
    if (scrollRef2 && scrollRef2.current) {
      //@ts-ignore
      scrollRef2.current?.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    }
  }, [conversation]);
  useEffect(() => {
    if (value?.info.isloggedIn) {
      setSoc(value.info.ws);
      value.info.ws?.addEventListener("message", (res) => {
        const message = JSON.parse(res.data);
        console.log(message, seleId.current);
        if (message.kind == "message") {
          if (message.by == seleId.current) {
            setConversation((prev) => {
              return [
                ...prev,
                {
                  by: message.by,
                  type: "text",
                  text: message.text,
                  kind: "text",
                },
              ];
            });
          }
        }
      });
    }
  }, [value]);
  useEffect(() => {
    const getConv = async () => {
      const res = await axios.get(
        `https://steps-ai.onrender.com/api/getconv/${
          value?.info.isDoctor ? "patient" : "doctor"
        }/${sele.id}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setConversation(res.data);
    };
    if (sele) {
      getConv();
    }
  }, [sele]);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          `https://steps-ai.onrender.com/api/get${
            value?.info.isDoctor ? "patients" : "docs"
          }`,
          { withCredentials: true }
        );
        console.log(res.data);
        setFriends(res.data);
      } catch (err) {
        toast.error("something went wrong:(");
      }
    };
    if (value?.info.isloggedIn) {
      getData();
    }
  }, [value]);
  return (
    <div className=" my-4 flex flex-col gap-3">
      <div className=" hidden lg:flex items-center gap-2">
        <div className="h-[70dvh] overflow-hidden overflow-y-auto py-2 px-4 rounded-xl border w-1/5">
          {friends.map((ele, index) => {
            if (value?.info.isDoctor) {
              return (
                <div
                  className="border rounded-xl py-2 px-4 cursor-pointer"
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSele({
                      id: ele.patient.id,
                      name: ele.patient.firstName,
                      email: ele.patient.email,
                    });
                    seleId.current = ele.patient.id;
                    setMessage("");
                    setConversation([]);
                  }}
                >
                  <p className="text-2xl">
                    {ele.patient.firstName} {ele.patient.lastName}
                  </p>
                  <p className="text-gray-600">{ele.patient.email}</p>
                </div>
              );
            } else {
              return (
                <div
                  className="border rounded-xl py-2 px-4 cursor-pointer"
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSele({
                      id: ele.doctor.id,
                      name: ele.doctor.firstName,
                      email: ele.doctor.email,
                    });
                    seleId.current = ele.doctor.id;
                    setMessage("");
                    setConversation([]);
                  }}
                >
                  <p className="text-2xl">
                    {ele.doctor.firstName} {ele.doctorlastName}
                  </p>
                  <p className="text-gray-600">{ele.doctor.email}</p>
                </div>
              );
            }
          })}
        </div>
        <div className="flex-1 rounded-xl border">
          {sele ? (
            <div className="flex flex-col gap-2 py-2 px-4">
              <div className="flex flex-col gap-2 items-end justify-center">
                <div className="flex gap-2 items-center">
                  <p className="text-2xl">{sele.name}</p>
                  <p className="text-gray-600">{sele.email}</p>
                  <EllipsisVertical />
                </div>
              </div>
              <div className="h-[70dvh] overflow-hidden overflow-y-auto">
                {conversation.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className={`flex ${
                        ele.by == value?.info.id
                          ? "justify-end"
                          : "justify-start"
                      } mb-4`}
                    >
                      {ele.type == "text" ? (
                        <div
                          className={`max-w-xs break-words ${
                            ele.by == value?.info.id
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-black"
                          } p-3 rounded-lg`}
                        >
                          {ele.text}
                        </div>
                      ) : (
                        <div>
                          <img
                            src={ele.text}
                            width={400}
                            height={400}
                            className="rounded-md"
                          />
                        </div>
                      )}
                      <div ref={scrollRef} />
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 relative">
                <div className="absolute bottom-0 left-0">
                  <EmojiPicker
                    className="mt-10 "
                    width={200}
                    height={400}
                    open={emojiOpen}
                    onEmojiClick={(emojiObject) => {
                      setMessage((prev) => {
                        return prev + emojiObject.emoji;
                      });
                    }}
                  />
                </div>
                <Input
                  placeholder="enter text :) !"
                  className="flex-1 py-4 px-4 h-[50px]"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />

                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setEmojiOpne(!emojiOpen);
                  }}
                >
                  {emojiOpen ? <X /> : <Laugh />}
                </Button>
                <Button
                  className="bg-green-500"
                  onClick={(e) => {
                    e.preventDefault();
                    if (message.length == 0) {
                      toast.error("message filed is empty :(");
                      return;
                    }
                    const body = JSON.stringify({
                      type: "text",
                      kind: "text",
                      text: message,
                      by: value?.info.id,
                      to: sele.id,
                      doctorId: value?.info.isDoctor ? value.info.id : sele.id,
                      patientId: value?.info.isDoctor
                        ? sele.id
                        : value?.info.id,
                    });
                    socket?.send(body);
                    setConversation((prev) => {
                      return [
                        ...prev,
                        {
                          by: value?.info.id,
                          kind: "text",
                          text: message,
                          type: "text",
                        },
                      ];
                    });
                    setMessage("");
                    setEmojiOpne(false);
                  }}
                >
                  send
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-[70dvh] py-2 px-4 flex items-center justify-center">
              <img
                src={pingme}
                height={500}
                width={500}
                className="rounded-xl "
              />
            </div>
          )}
        </div>
      </div>
      {sele ? (
        <div className="lg:hidden flex flex-col gap-2 py-2 px-4">
          <div className="flex items-center gap-2">
            <ArrowLeft
              className="cursor-pointer"
              onClick={() => {
                setSele(null);
              }}
            />
            <div className="flex-1 flex flex-col gap-2 items-end justify-center">
              <div className="flex gap-2 items-center">
                <p className="text-2xl">{sele.name}</p>
                <p className="text-gray-600">{sele.email}</p>
                <EllipsisVertical />
              </div>
            </div>
          </div>
          <div className="h-[70dvh] overflow-hidden overflow-y-auto">
            {conversation.map((ele, index) => {
              return (
                <div
                  key={index}
                  className={`flex ${
                    ele.by == value?.info.id ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  {ele.type == "text" ? (
                    <div
                      className={`max-w-xs break-words ${
                        ele.by == value?.info.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      } p-3 rounded-lg`}
                    >
                      {ele.text}
                    </div>
                  ) : (
                    <div>
                      <img
                        src={ele.text}
                        width={400}
                        height={400}
                        className="rounded-md"
                      />
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 relative">
            <div className="absolute bottom-0 left-0">
              <EmojiPicker
                className="mt-10 "
                width={200}
                height={400}
                open={emojiOpen}
                onEmojiClick={(emojiObject) => {
                  setMessage((prev) => {
                    return prev + emojiObject.emoji;
                  });
                }}
              />
            </div>
            <Input
              placeholder="enter text :) !"
              className="flex-1 py-4 px-4 h-[50px]"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />

            <Button
              onClick={(e) => {
                e.preventDefault();
                setEmojiOpne(!emojiOpen);
              }}
            >
              {emojiOpen ? <X /> : <Laugh />}
            </Button>
            <Button
              className="bg-green-500"
              onClick={(e) => {
                e.preventDefault();
                if (message.length == 0) {
                  toast.error("message filed is empty :(");
                  return;
                }
                const body = JSON.stringify({
                  type: "text",
                  kind: "text",
                  text: message,
                  by: value?.info.id,
                  to: sele.id,
                  doctorId: value?.info.isDoctor ? value.info.id : sele.id,
                  patientId: value?.info.isDoctor ? sele.id : value?.info.id,
                });
                socket?.send(body);
                setConversation((prev) => {
                  return [
                    ...prev,
                    {
                      by: value?.info.id,
                      kind: "text",
                      text: message,
                      type: "text",
                    },
                  ];
                });
                setMessage("");
                setEmojiOpne(false);
              }}
            >
              send
            </Button>
          </div>
        </div>
      ) : (
        <div className="lg:hidden h-[70dvh] overflow-hidden overflow-y-auto py-2 px-4 rounded-xl border ">
          {friends.map((ele, index) => {
            if (value?.info.isDoctor) {
              return (
                <div
                  className="border rounded-xl py-2 px-4 cursor-pointer"
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSele({
                      id: ele.patient.id,
                      name: ele.patient.firstName,
                      email: ele.patient.email,
                    });
                    seleId.current = ele.patient.id;
                    setMessage("");
                    setConversation([]);
                  }}
                >
                  <p className="text-2xl">
                    {ele.patient.firstName} {ele.patient.lastName}
                  </p>
                  <p className="text-gray-600">{ele.patient.email}</p>
                </div>
              );
            } else {
              return (
                <div
                  className="border rounded-xl py-2 px-4 cursor-pointer"
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSele({
                      id: ele.doctor.id,
                      name: ele.doctor.firstName,
                      email: ele.doctor.email,
                    });
                    seleId.current = ele.doctor.id;
                    setMessage("");
                    setConversation([]);
                  }}
                >
                  <p className="text-2xl">
                    {ele.doctor.firstName} {ele.doctorlastName}
                  </p>
                  <p className="text-gray-600">{ele.doctor.email}</p>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default Chat;
