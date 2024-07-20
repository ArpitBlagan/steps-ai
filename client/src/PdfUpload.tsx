import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PdfUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file || title.length == 0) {
      toast.error("fill the required fileds");
      return;
    }
    setLoading(true);
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("title", title);
    try {
      const res = await axios.post(
        "http://localhost:9000/api/upload",
        formdata,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      toast.success("pdf uploaded successfully");
      setLoading(false);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      toast.error("something went wrong while uploading pdf");
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[80dvh] flex items-center justify-center">
      <form
        className="w-full md:w-1/2 flex flex-col gap-4 py-4 px-4 border rounded-xl"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-start gap-3">
          <label>Title</label>
          <Input
            type="text"
            placeholder="patient_record.pdf"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
          />
        </div>
        <div className="flex flex-col items-start gap-3">
          <label>Select PDF</label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e: any) => {
              const selectedFile = e.target.files[0];
              if (selectedFile && selectedFile.type === "application/pdf") {
                setFile(selectedFile);
              } else {
                toast.error("Please select a valid PDF file");
              }
            }}
          />
        </div>
        <Button type="submit">{loading ? "uploading..." : "upload"}</Button>
      </form>
    </div>
  );
};

export default PdfUpload;
