import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./components/ui/button";
import { contextt } from "./Contextt";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";

const Doctors = () => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [refetch, setRefetch] = useState(false);
  const value = useContext(contextt);
  const handleSendRequest = async (id: string) => {
    if (value && value.info && value?.info.isloggedIn) {
      toast.success("sending request to doctor!!");
      value?.info.ws?.send(
        JSON.stringify({
          type: "notification",
          note,
          by: value.info.id,
          to: id,
          name: value.info.firstName,
        })
      );
      value.info.ws?.addEventListener("message", (res) => {
        const message = JSON.parse(res.data);
        console.log("m", message);
        if (message.type == "error") {
          toast.error("not able to send request to doc something went wrong:(");
          setLoading(false);
        } else if (message.type == "success") {
          toast.success("requset send out successfully:)");
          setLoading(false);
          setOpen(false);
          setRefetch(!refetch);
        } else if (message.type == "accepted") {
          toast.success(message.message);
        }
      });
    }
  };
  useEffect(() => {
    const getDocs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:9000/api/doctors", {
          withCredentials: true,
        });
        console.log(res.data);
        const docs = res.data.doctors;
        const reqs = res.data.request;
        const newArr: any[] = [];
        docs.map((ele: any) => {
          const cool = reqs.find((elee: any) => {
            return elee.doctorId == ele.id;
          });
          const ff = ele.patients.find((ee: any) => {
            return ee.doctorId == ele.id;
          });
          if (!cool && !ff) {
            newArr.push(ele);
          }
        });
        setDoctors(newArr);
        setLoading(false);
      } catch (err) {
        toast.error("something went wrong while fetching docs:(");
        setLoading(false);
        console.log(err);
      }
    };
    getDocs();
  }, [refetch]);
  return (
    <div className="min-h-[80dvh]">
      {loading ? (
        <div className="h-[70dvh]">Loading...</div>
      ) : (
        <div>
          <p>Doctors Avaliable</p>
          <div className=" grid md:grid-cols-2 gap-2">
            {doctors.map((ele, index) => {
              return (
                <div
                  key={index}
                  className="py-2 px-4 rounded-xl border flex flex-col gap-2"
                >
                  <p>
                    Dr. {ele.firstName} {ele.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">{ele.email}</p>
                  <div className="flex items-center gap-3 justify-around">
                    <p>
                      No. of patients assigned or linked: {ele.patients.length}
                    </p>
                    <p>
                      <span className="text-gray-600 text-md">Specialty:</span>{" "}
                      {ele.specialty}
                    </p>
                  </div>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <p className="py-2 px-4 rounded-xl border hover:bg-green-600 cursor-pointer">
                        Send Request
                      </p>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          <p className="text-center">Send Request</p>
                        </DialogTitle>
                        <DialogDescription>
                          <form className="flex flex-col gap-5">
                            <div className="flex flex-col justify-center items-center">
                              <label>Note</label>
                              <Input
                                placeholder="I am facing blah blah issue really urgent please accept the request."
                                value={note}
                                onChange={(e) => {
                                  setNote(e.target.value);
                                }}
                              />
                            </div>
                            <Button
                              disabled={loading}
                              className="hover:bg-green-600 py-2 px-3 rounded-xl border"
                              onClick={(e) => {
                                e.preventDefault();
                                handleSendRequest(ele.id);
                              }}
                            >
                              {loading ? "Sending..." : "Send Request"}
                            </Button>
                          </form>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              );
            })}
          </div>
          <p className="my-4 text-gray-600">No Data</p>
        </div>
      )}
    </div>
  );
};

export default Doctors;
