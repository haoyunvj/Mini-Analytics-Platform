import { useState } from "react";
import api from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { username, password });
      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.box}>
        <h2>Login</h2>

        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  box: {
    background: "#020617",
    padding: 30,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    color: "white",
    minWidth: 300,
  },
};
