/**
 * ============================================================
 * FILTROS DE RETORNOS
 * ============================================================
 */

function iniciarFiltrosRetorno() {
  const busca = document.getElementById("filtroRetorno");
  const laboratorio = document.getElementById("filtroLaboratorio");
  const status = document.getElementById("filtroStatus");

  [busca, laboratorio, status].forEach((elemento) => {
    if (elemento) {
      elemento.addEventListener(
        elemento.tagName === "INPUT" ? "input" : "change",
        aplicarFiltroRetorno,
      );
    }
  });
}

function aplicarFiltroRetorno() {
  const dados = DashboardStore.get("retornos");

  if (!Array.isArray(dados)) {
    console.warn("⚠️ Nenhum retorno carregado");
    return;
  }

  const texto = String(document.getElementById("filtroRetorno")?.value || "")
    .toLowerCase()
    .trim();
  const laboratorio = String(
    document.getElementById("filtroLaboratorio")?.value || "",
  ).trim();
  const status = normalizarStatus(
    document.getElementById("filtroStatus")?.value || "",
  );

  const prioridadeStatus = {
    PENDENTE: 1,
    "SEPARADO PARA ENVIO": 2,
    FINALIZADO: 3,
  };

  const filtrados = dados
    .filter((item) => {
      const textoOK =
        !texto || JSON.stringify(item).toLowerCase().includes(texto);
      const laboratorioOK =
        !laboratorio ||
        String(item.laboratorio ?? "").trim().toUpperCase() ===
          laboratorio.toUpperCase();
      const statusOK = !status || normalizarStatus(item.status) === status;

      return textoOK && laboratorioOK && statusOK;
    })
    .sort(
      (a, b) =>
        (prioridadeStatus[normalizarStatus(a.status)] ?? 99) -
        (prioridadeStatus[normalizarStatus(b.status)] ?? 99),
    );

  renderTabelaRetornos(filtrados);
}

window.iniciarFiltrosRetorno = iniciarFiltrosRetorno;
window.aplicarFiltroRetorno = aplicarFiltroRetorno;
