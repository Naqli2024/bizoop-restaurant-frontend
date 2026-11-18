import { BrowserRouter } from "react-router-dom";
import "./assets/styles/restaurant.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
     <BrowserRouter>
     <AppRoutes/>
      <ToastContainer autoClose={2000} />
     </BrowserRouter>
    </div>
  );
}

export default App;
