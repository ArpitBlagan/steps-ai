import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Footer from "./components/Footer";
import Contextt from "./Contextt";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import PdfUpload from "./PdfUpload";
import Profile from "./Profile";
import Doctors from "./Doctors";
import Request from "./Request";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <Contextt>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/upload" element={<PdfUpload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/request" element={<Request />} />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer />
    </Contextt>
  );
}

export default App;
