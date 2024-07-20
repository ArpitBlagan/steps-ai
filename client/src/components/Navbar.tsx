import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useLocation } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { useContext } from "react";
import { contextt } from "../Contextt";
import axios from "axios";
import { toast } from "react-toastify";
const navbarItems = [{ title: "Home", link: "/" }];

const Navbar = () => {
  const value = useContext(contextt);
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 py-2 px-4 rounded-xl border my-3">
      <div className="flex items-center gap-2">
        <p className="hidden md:block">Med Manage</p>
        <Briefcase />
      </div>
      <div className="flex-1 flex items-center justify-center gap-3">
        {navbarItems.map((ele: any, index) => {
          return (
            <Link
              key={index}
              to={ele.link}
              className={`hover:underline ${
                location.pathname == ele.link ? "text-red-500" : ""
              }`}
            >
              {ele.title}
            </Link>
          );
        })}
        {value?.info.isDoctor && (
          <Link
            to="/upload"
            className={`hover:underline ${
              location.pathname == "/upload" ? "text-red-500" : ""
            }`}
          >
            Upload
          </Link>
        )}

        {value?.info.isDoctor && (
          <Link
            to="/request"
            className={`hover:underline ${
              location.pathname == "/request" ? "text-red-500" : ""
            }`}
          >
            Requests
          </Link>
        )}
        {!value?.info.isDoctor && (
          <Link
            to="/doctors"
            className={`hover:underline ${
              location.pathname == "/doctors" ? "text-red-500" : ""
            }`}
          >
            Doctors
          </Link>
        )}
      </div>
      <div className="flex md:flex-row flex-col items-center justify-end gap-2">
        {!value?.info.isloggedIn ? (
          <div className="flex md:flex-row flex-col items-center gap-3">
            <Link to="/signin">SignIn</Link>
            <Link to="/signup">SignUp</Link>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="w-1/2 px-4" size="icon">
                Profile
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile">
                  {value.info.firstName} {value.info.lastName}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>{value.info.email}</DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant={"destructive"}
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await axios.get("http://localhost:9000/api/logout", {
                        withCredentials: true,
                      });
                      window.location.reload();
                      navigate("/");
                    } catch (err) {
                      toast.error(
                        "something went wrong while logging user out"
                      );
                    }
                  }}
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
