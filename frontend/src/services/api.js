import axios from "axios";

export const api = axios.create({
<<<<<<< HEAD
  baseURL: "http://localhost:5002" // Flask (login, orders, sync)
=======
  baseURL: "http://localhost:5001" // Flask (login, orders, sync)
>>>>>>> 765b7f8a846c781e017b53f9ca0b6ab763a34d77
});

export const dashboardApi = axios.create({
  baseURL: "http://localhost:5002" // Go (metrics)
});

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

// Atualizado para enviar filtros como query params automaticamente
export const getMetrics = async ({ start, end, payment_method } = {}) => {
  const params = {};
  if (start) params.start = start;
  if (end) params.end = end;
  if (payment_method) params.payment_method = payment_method;

  const response = await dashboardApi.get("/metrics", { params });
  return response.data;
};

export const register = async (username, password) => {
  try {
    const response = await api.post("/register", { username, password });
    return response.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: "Erro ao cadastrar" };
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });
    return response.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: "Erro de conexão" };
  }
};

export const syncData = async () => {
<<<<<<< HEAD
  const token = localStorage.getItem("token"); 
  const res = await dashboardApi.post("/sync", {}, {
    headers: {

=======
  const token = localStorage.getItem("token"); // se precisar autenticação
  const res = await axios.post("http://localhost:5002/sync", {}, {
    headers: {
>>>>>>> 765b7f8a846c781e017b53f9ca0b6ab763a34d77
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
