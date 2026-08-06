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

  mostrarLoading();

  const inicio = performance.now();

  try {
    atualizarLoading("Conectando ao sistema...");

    const dados = await api("dashboard");

    const tempo = (performance.now() - inicio).toFixed(0);

    console.log(`⏱️ Tempo API: ${tempo}ms`);

    if (!dados) {
      throw new Error("API retornou vazio");
    }

    if (dados.erro) {
      throw new Error(dados.erro);
    }

    atualizarLoading("Processando informações...");

    DashboardStore.set(dados);

    console.log("✅ Dashboard carregado:", dados);

    atualizarLoading("Sistema pronto ✓");

    /*
      Pequeno delay para o usuário
      perceber a finalização
    */

    await esperar(500);

    return dados;
  } catch (erro) {
    console.error("❌ Erro no carregamento do dashboard:", erro);

    atualizarLoading("⚠️ Falha ao sincronizar dados");

    mostrarErroDashboard(erro);

    throw erro;
  } finally {
    esconderLoading();
  }
}

/**
 * ==========================================================
 * CONTROLE DO LOADING
 * ==========================================================
 */

function mostrarLoading() {
  const overlay = document.getElementById("loadingOverlay");

  if (overlay) {
    overlay.classList.remove("hidden");
  }
}

function esconderLoading() {
  const overlay = document.getElementById("loadingOverlay");

  if (overlay) {
    overlay.classList.add("hidden");
  }
}

/**
 * Atualiza mensagens
 * dentro do loading
 */

function atualizarLoading(texto) {
  const mensagem = document.querySelector(".loadingSub");

  if (mensagem) {
    mensagem.textContent = texto;
  }
}

/**
 * Exibe erro amigável
 */

function mostrarErroDashboard(erro) {
  console.error("Detalhes:", erro.message);

  const mensagem = document.querySelector(".loadingSub");

  if (mensagem) {
    mensagem.innerHTML = `

      ⚠️ Não foi possível carregar os dados.

      <br><br>

      Verifique a conexão com o servidor.

    `;
  }
}

/**
 * Pequena pausa visual
 */

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
