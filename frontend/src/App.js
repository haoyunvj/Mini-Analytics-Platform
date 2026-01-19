import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const [authenticated, setAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return authenticated ? (
    <Dashboard />
  ) : (
    <Login onLogin={() => setAuthenticated(true)} />
  );
}

export default App;
