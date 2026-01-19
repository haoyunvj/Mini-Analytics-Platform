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

  return (
    <div>
      <h1>Mini Analytics Dashboard</h1>

      {loading && <p>Carregando métricas...</p>}

      {/* só renderiza o Dashboard se metrics for um array */}
      {Array.isArray(metrics) && metrics.length > 0 ? (
        <Dashboard metrics={metrics} fetchMetrics={fetchMetrics} />
      ) : (
        !loading && <p>Nenhuma métrica disponível.</p>
      )}
    </div>
  );
}

export default App;
