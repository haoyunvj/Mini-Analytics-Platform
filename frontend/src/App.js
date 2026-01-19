<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from "react";
import Dashboard from "./pages/Dashboard";
import { getMetrics } from "./services/api";

function App() {
  const [metrics, setMetrics] = useState([]); // inicializa como array
  const [loading, setLoading] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMetrics();
      // garante que metrics será sempre um array
      setMetrics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar métricas:", err);
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);
=======
import { useEffect, useState } from "react";

function App() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5002/metrics")
      .then(res => res.json())
      .then(data => setMetrics(data));
  }, []);
>>>>>>> 765b7f8a846c781e017b53f9ca0b6ab763a34d77

  return (
    <div>
      <h1>Mini Analytics Dashboard</h1>

<<<<<<< HEAD
      {loading && <p>Carregando métricas...</p>}

      {/* só renderiza o Dashboard se metrics for um array */}
      {Array.isArray(metrics) && metrics.length > 0 ? (
        <Dashboard metrics={metrics} fetchMetrics={fetchMetrics} />
      ) : (
        !loading && <p>Nenhuma métrica disponível.</p>
      )}
=======
      {metrics.map((m, i) => (
        <div key={i}>
          {m.date} | {m.status} | {m.payment_method} | {m.total_orders} | R$ {m.total_revenue}
        </div>
      ))}
>>>>>>> 765b7f8a846c781e017b53f9ca0b6ab763a34d77
    </div>
  );
}

export default App;
