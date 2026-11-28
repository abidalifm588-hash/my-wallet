import { useState } from "react";
import Verification from "./components/Verification";
import Home from "./components/Home";

export default function App() {
  const [stage, setStage] = useState<"verify" | "home">("verify");
  return stage === "verify" ? <Verification onDone={() => setStage("home")} /> : <Home />;
}
