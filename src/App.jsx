import { useState } from "react";
import LoginPage from "./components/LoginPage";
import UnitSelector from "./components/UnitSelector";
import UnitDashboard from "./components/UnitDashboard";

const UNIT_NAMES = {
  aflitos: "Unidade Aflitos — Náutico Recife",
  prime: "Prime Vida — Jaboatão dos Guararapes",
};

export default function App() {
  const [screen, setScreen] = useState("login"); // login | units | dashboard
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // { user, name, role }

  function handleLogin(userObj) { setCurrentUser(userObj); setScreen("units"); }
  function handleSelectUnit(id) { setSelectedUnit(id); setScreen("dashboard"); }
  function handleBack()         { setScreen("units"); setSelectedUnit(null); }
  function handleLogout()       { setCurrentUser(null); setSelectedUnit(null); setScreen("login"); }

  if (screen === "login") return <LoginPage onLogin={handleLogin} />;
  if (screen === "units")
    return <UnitSelector currentUser={currentUser} onSelect={handleSelectUnit} onLogout={handleLogout} />;
  return (
    <UnitDashboard
      unitId={selectedUnit}
      unitName={UNIT_NAMES[selectedUnit]}
      currentUser={currentUser}
      onBack={handleBack}
      onLogout={handleLogout}
    />
  );
}
