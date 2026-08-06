/**
 * ==========================================================
 * CARREGAMENTO CENTRAL DO DASHBOARD
 * ==========================================================
 *
 * Busca todos os dados de uma única vez
 * através do CACHE_DASHBOARD
 *
 */

async function carregarDashboardCompleto() {
  console.log("📊 Iniciando carregamento completo do dashboard...");

  try {
    const dados = await api("dashboard");

    if (!dados || dados.erro) {
      throw new Error(dados?.erro || "Dashboard vazio");
    }

    DashboardStore.set(dados);

    console.log("✅ Dashboard carregado:", dados);

    return dados;
  } catch (erro) {
    console.error("❌ Erro no carregamento do dashboard:", erro);

    throw erro;
  }
}

