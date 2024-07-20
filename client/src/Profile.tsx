import { useContext, useEffect, useState } from "react";
import { contextt } from "./Contextt";
import { Button } from "./components/ui/button";
import axios from "axios";
import { CircleX, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

const Profile = () => {
  const value = useContext(contextt);
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refetch, setR] = useState(false);
  const [open, setOpen] = useState(false);
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:9000/api/pdf/${id}`, {
        withCredentials: true,
      });
      setOpen(false);
      setR(!refetch);
      setLoading(false);
    } catch (err) {
      setOpen(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(
        `http://localhost:9000/api/${
          value?.info.isDoctor ? "pdfs" : "relation"
        }`,
        { withCredentials: true }
      );
      console.log(res.data);
      if (value?.info.isDoctor) {
        setPdfs(res.data.pdfs);
        setPatients(res.data.patients);
      } else {
        setDoctors(res.data.doctors);
      }
    };
    if (value?.info.isloggedIn) getData();
  }, [value, refetch]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between py-2 px-4 rounded-xl border">
        <div className="flex justify-start items-center gap-4">
          <p className="text-2xl">
            {value?.info.firstName} {value?.info.lastName}
          </p>
          <p className="text-gray-600 text-sm">{value?.info.email}</p>
        </div>
      </div>
      {value?.info.isDoctor ? (
        <div>
          <div className="min-h-[50dvh] border py-2 px-4 rounded-xl">
            <p>PDFs</p>
            <div className="grid md:grid-cols-3 gap-3">
              {pdfs.map((ele, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-2 px-4 border rounded-xl relative"
                  >
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <CircleX className="absolute right-[5px] top-[5px] cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            Are you absolutely sure you want to delete the pdf ?
                          </DialogTitle>
                          <DialogDescription>
                            <div className="flex items-center justify-center my-5">
                              <Button
                                variant={"destructive"}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLoading(true);
                                  handleDelete(ele.id);
                                }}
                              >
                                {loading ? "deleting" : "Delete"}
                              </Button>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    <FileText height={100} width={100} />
                    <div className="flex flex-col w-full gap-4">
                      <p>{ele.title}</p>
                      <a
                        href={ele.filePath}
                        target="_blank"
                        className="w-full border py-1 px-2 rounded-xl hover:bg-green-700"
                      >
                        View
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="min-h-[50dvh] border py-2 px-4 rounded-xl">
            <p>Patients</p>
            <div className="grid md:grid-cols-3 gap-3">
              {patients.map((ele, index) => {
                return (
                  <div key={index} className="py-2 px-4 rounded-xl border ">
                    <p>
                      {ele.patient.firstName} {ele.patient.secondName}
                    </p>
                    <p className="text-sm text-gray-700">{ele.patient.email}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[70dvh] border py-2 px-4 rounded-xl">
          <p>Linked Doctors</p>
          <div className="grid md:grid-cols-3 gap-3">
            {doctors.map((ele, index) => {
              return (
                <div
                  key={index}
                  className="py-2 px-4 rounded-xl border flex flex-col items-start"
                >
                  <div className="flex items-center justify-start gap-4">
                    <p>
                      Dr. {ele.doctor.firstName} {ele.doctor.secondName}
                    </p>
                    <p className="text-sm text-gray-700">{ele.doctor.email}</p>
                  </div>
                  <p>
                    <span className="text-sm text-gray-700">Specialty:</span>{" "}
                    {ele.doctor.specialty}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
