import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HashRouter } from "react-router-dom"; // imported because of github pagesnpm
createRoot(document.getElementById("root")!).render(<App />);
