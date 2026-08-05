document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Sistema iniciado");

  try {
    await carregarDashboardCompleto();

    await carregarIndicadores();

    await carregarTopATM();

    await carregarTopPecas();

    await carregarConsumoMensal();

    await carregarMotivos();

    await carregarReparoLocal();

    await carregarUltimas();

    await carregarBancada();

    await carregarVandalismo();

    await carregarReposicao();

    await carregarRetornos();

    iniciarFiltrosRetorno();

    iniciarSelecaoRetorno();

    console.log("✅ Dashboard inicializado");
  } catch (erro) {
    console.error("❌ Erro ao iniciar dashboard:", erro);
  }
});
