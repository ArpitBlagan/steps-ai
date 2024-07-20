import { useContext, useEffect, useState } from "react";
import { contextt } from "./Contextt";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "./components/ui/button";

const Request = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rl, setRl] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const value = useContext(contextt);
  useEffect(() => {
    if (value?.info.isloggedIn) {
      value.info.ws?.addEventListener("message", (res) => {
        const message = JSON.parse(res.data);
        if (message.type == "notification") {
          setRefetch(!refetch);
          toast.success(`new In request with note ${message.note}`);
        }
      });
    }
  }, [value]);
  const handleAccept = async (id: string, patientId: string) => {
    setRl(true);
    setId(id);
    try {
      await axios.post(
        `http://localhost:9000/api/accept`,
        { id, patientId },
        {
          withCredentials: true,
        }
      );
      toast.success(
        "request accepted successfully now you are linked with this patient"
      );
      value?.info.ws?.send(
        JSON.stringify({
          type: "accept",
          id: patientId,
          docName: value.info.firstName,
        })
      );
      setId(null);
      setRl(false);
      setRefetch(!refetch);
    } catch (err) {
      toast.error("not able to accept the request please try again later:(");
      setRl(false);
      setId(null);
    }
  };
  useEffect(() => {
    const getRequest = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/request", {
          withCredentials: true,
        });
        console.log(res.data);
        setRequests(res.data);
        setLoading(false);
      } catch (err) {
        toast.error(
          "something went wrong while fetching your in coming requests"
        );
        setLoading(false);
      }
    };
    getRequest();
  }, [refetch]);
  return (
    <div>
      {loading ? (
        <div className="h-[70dvh]">Loading...</div>
      ) : (
        <div className="min-h-[80dvh] py-2 px-4 rounded-xl border overflow-y-scroll">
          <p className="text-xl text-gray-600 my-2">Patient's Requests</p>
          <div className=" grid md:grid-cols-2 gap-4">
            {requests.map((ele, index) => {
              return (
                <div
                  key={index}
                  className="py-2 px-4 rounded-xl border flex flex-col gap-3"
                >
                  <div className="flex items-center flex-wrap gap-3">
                    <p>
                      By: {ele.patient.firstName} {ele.patient.lastName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Note: {ele.patient.email}
                    </p>
                  </div>
                  <div className="flex items-center justify-start gap-3">
                    <p>Note:</p>
                    <p className="text-gray-600 text-sm">{ele.note}</p>
                  </div>
                  <Button
                    className="py-2 px-4 rounded-xl border w-full hover:bg-green-600"
                    disabled={id == ele.id && rl}
                    onClick={(e) => {
                      e.preventDefault();
                      handleAccept(ele.id, ele.patient.id);
                    }}
                  >
                    {rl ? "accepting..." : "Accept"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
