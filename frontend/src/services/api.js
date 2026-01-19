import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5001"
});

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const login = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });
    return response.data; // esperado: { success: true, token: "..."} ou { success: false, message: "..." }
  } catch (err) {
    console.error(err);
    return { success: false, message: "Erro de conexão" };
  }
};