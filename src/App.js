import { BrowserRouter } from "react-router-dom";
import "./assets/styles/restaurant.css";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div>
     <BrowserRouter>
     <AppRoutes/>
     </BrowserRouter>
    </div>
  );
}

export default App;
