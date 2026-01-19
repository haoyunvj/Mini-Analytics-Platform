import React, { useState, useEffect } from "react";
import { getOrders } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [metrics, setMetrics] = useState({
    approvedRevenue: 0,
    pendingRevenue: 0,
    canceledRevenue: 0,
    approvedOrders: 0,
    pendingOrders: 0,
    canceledOrders: 0,
  });

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    let filtered = [...orders];
    if (startDate) filtered = filtered.filter(o => new Date(o.created_at) >= new Date(startDate));
    if (endDate) filtered = filtered.filter(o => new Date(o.created_at) <= new Date(endDate));
    if (paymentMethod) filtered = filtered.filter(o => o.payment_method === paymentMethod);
    setFilteredOrders(filtered);
  }, [startDate, endDate, paymentMethod, orders]);

  useEffect(() => {
    const approvedRevenue = filteredOrders
      .filter(o => o.status === "approved")
      .reduce((sum, o) => sum + o.value, 0);

    const pendingRevenue = filteredOrders
      .filter(o => o.status === "pending")
      .reduce((sum, o) => sum + o.value, 0);

    const canceledRevenue = filteredOrders
      .filter(o => o.status === "cancelled")
      .reduce((sum, o) => sum + o.value, 0);

    const approvedOrders = filteredOrders.filter(o => o.status === "approved").length;
    const pendingOrders = filteredOrders.filter(o => o.status === "pending").length;
    const canceledOrders = filteredOrders.filter(o => o.status === "cancelled").length;

    setMetrics({ approvedRevenue, pendingRevenue, canceledRevenue, approvedOrders, pendingOrders, canceledOrders });
  }, [filteredOrders]);

  const chartData = filteredOrders
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map(o => ({ date: o.created_at.slice(0, 10), value: o.value, status: o.status }));

  const handleSync = async () => {
    try {
      await fetchOrders();
      alert("Dados sincronizados!");
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      alert("Falha na sincronização");
    }
  };

  const paymentMethods = Array.from(new Set(orders.map(o => o.payment_method)));

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      {/* Filtros */}
      <div style={styles.filters}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={styles.input}
        />
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={styles.select}
        >
          <option value="">Todos os métodos</option>
          {paymentMethods.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <button onClick={handleSync} style={styles.button}>Sincronizar</button>
      </div>

      {/* Métricas */}
      <div style={styles.metricsContainer}>
        <div style={{ ...styles.card, backgroundColor: "#e6f7ff" }}>Receita Aprovada: {metrics.approvedRevenue.toFixed(2)}</div>
        <div style={{ ...styles.card, backgroundColor: "#fffbe6" }}>Receita Pendente: {metrics.pendingRevenue.toFixed(2)}</div>
        <div style={{ ...styles.card, backgroundColor: "#fff1f0" }}>Receita Cancelada: {metrics.canceledRevenue.toFixed(2)}</div>
      </div>

      <div style={styles.metricsContainer}>
        <div style={styles.card}>Pedidos Aprovados: {metrics.approvedOrders}</div>
        <div style={styles.card}>Pedidos Pendentes: {metrics.pendingOrders}</div>
        <div style={styles.card}>Pedidos Cancelados: {metrics.canceledOrders}</div>
      </div>

      {/* Gráfico */}
      <div style={{ width: "100%", height: 400, marginTop: 20 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#1890ff" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  title: { marginBottom: 20, color: "#333" },
  filters: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  input: {
    padding: "8px 12px",
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  select: {
    padding: "8px 12px",
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  metricsContainer: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    minWidth: 180,
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    color: "#333",
    fontWeight: 600,
    textAlign: "center",
  },
};

export default Dashboard;
