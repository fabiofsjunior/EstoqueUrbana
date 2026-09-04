/**
 * Renderização do gráfico de consumo mensal.
 */

let graficoConsumo = null;

function normalizarMesConsumo(valor) {
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return `${String(valor.getMonth() + 1).padStart(2, "0")}/${valor.getFullYear()}`;
  }

  const texto = String(valor ?? "").trim();
  if (!texto) return "-";

  if (/^\d{2}\/\d{4}$/.test(texto)) return texto;

  if (/^\d{4}-\d{2}/.test(texto)) {
    const partes = texto.slice(0, 7).split("-");
    return `${partes[1]}/${partes[0]}`;
  }

  const data = new Date(texto);
  if (!Number.isNaN(data.getTime())) {
    return `${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`;
  }

  return texto;
}

function carregarConsumoMensal() {
  const dados = DashboardStore.get("consumo");
  if (!Array.isArray(dados)) return;

  const validos = dados.filter((item) => Array.isArray(item) && item.length >= 2);
  const labels = [];
  const valores = [];

  validos.forEach((item) => {
    const valor = Number(item[1]);
    if (!Number.isFinite(valor)) return;
    labels.push(normalizarMesConsumo(item[0]));
    valores.push(valor);
  });

  const canvas = document.getElementById("graficoConsumo");
  if (!canvas || typeof Chart !== "function") return;

  if (!graficoConsumo) {
    graficoConsumo = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Nº de Trocas", data: valores }],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
    return;
  }

  graficoConsumo.data.labels = labels;
  graficoConsumo.data.datasets[0].data = valores;
  graficoConsumo.update();
}
