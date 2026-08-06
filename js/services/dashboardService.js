async function carregarDashboard() {
  const dados = await api("dashboard");

  DashboardStore.set(dados);
}

/**
 * ============================================================
 * ATUALIZA SOMENTE RETORNOS NO DASHBOARDSTORE
 * ============================================================
 *
 * Recarrega os retornos após alterações
 * sem reconstruir todo o dashboard.
 *
 */

async function atualizarRetornosStore() {
  try {
    console.log("🔄 Atualizando retornos no DashboardStore...");

    const dados = await api("retornos");

    if (!Array.isArray(dados)) {
      throw new Error("Retornos inválidos retornados pela API.");
    }

    DashboardStore.set({
      retornos: dados,
    });

    console.log("✅ Retornos atualizados no Store:", dados);

    aplicarFiltroRetorno();

    return dados;
  } catch (erro) {
    console.error("❌ Erro ao atualizar retornos:", erro);

    throw erro;
  }
}
