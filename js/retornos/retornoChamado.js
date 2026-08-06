/**
 * ============================================================
 * RETORNO - EDIÇÃO DE CHAMADO LABORATÓRIO
 * ============================================================
 *
 * Responsável por:
 *
 * - Abrir modal de edição
 * - Preencher dados do retorno
 * - Salvar chamado laboratório
 * - Atualizar DashboardStore
 * - Atualizar status visual
 *
 * Fluxo:
 *
 * DashboardStore
 *       ↓
 * retornoChamado.js
 *       ↓
 * API
 *       ↓
 * Google Apps Script
 *
 * ============================================================
 */

/**
 * ============================================================
 * ABRIR EDIÇÃO DO RETORNO
 * ============================================================
 */

function editarRetorno(linha) {
  const retornos = DashboardStore.get("retornos");

  if (!Array.isArray(retornos)) {
    console.error("❌ Retornos não encontrados no DashboardStore");

    return;
  }

  const retorno = retornos.find((item) => String(item.linha) === String(linha));

  if (!retorno) {
    console.error("❌ Retorno não encontrado:", linha);

    return;
  }

  preencherModalRetorno(retorno);

  const modal = document.getElementById("modalEditarRetorno");

  if (modal) {
    modal.style.display = "flex";
  }
}

/**
 * ============================================================
 * PREENCHE MODAL
 * ============================================================
 */

function preencherModalRetorno(retorno) {
  document.getElementById("retornoLinha").value = retorno.linha ?? "";

  document.getElementById("retornoChamadoPrincipal").value =
    retorno.chamadoPai ?? "";

  document.getElementById("retornoChamadoLaboratorio").value =
    retorno.chamadoFilho ?? "";

  document.getElementById("retornoATM").value = retorno.atm ?? "";

  document.getElementById("retornoPeca").value = retorno.peca ?? "";

  document.getElementById("retornoLaboratorio").value =
    retorno.laboratorio ?? "";
}

/**
 * ============================================================
 * SALVAR ALTERAÇÃO
 * ============================================================
 */

async function salvarEdicaoRetorno() {
  const linha = document.getElementById("retornoLinha").value;

  const chamadoLaboratorio = document
    .getElementById("retornoChamadoLaboratorio")
    .value.trim();

  if (!linha) {
    alert("Linha do retorno não encontrada.");

    return;
  }

  if (!chamadoLaboratorio) {
    alert("Informe o Chamado Laboratório.");

    return;
  }

  try {
    mostrarLoadingRetorno();

    console.log("📤 Salvando chamado laboratório:", {
      linha,
      chamadoLaboratorio,
    });

    const resposta = await api(
      "salvarFilho",

      {
        linha: linha,

        chamadoLaboratorio: chamadoLaboratorio,
      },
    );

    console.log("✅ Retorno atualizado:", resposta);

    if (resposta && resposta.sucesso === false) {
      throw new Error(resposta.mensagem);
    }

    /*
      Atualização local do Store

      Evita recarregar todo dashboard
    */

    atualizarRetornoNoStore(
      linha,

      chamadoLaboratorio,
    );

    if (typeof aplicarFiltroRetorno === "function") {
      aplicarFiltroRetorno();
    }

    esconderLoadingRetorno();

    fecharModalRetorno();
  } catch (erro) {
    esconderLoadingRetorno();

    console.error("❌ Erro ao salvar chamado laboratório:", erro);

    alert("Erro ao salvar chamado laboratório.");
  }
}

/**
 * ============================================================
 * ATUALIZA STORE LOCAL
 * ============================================================
 */

function atualizarRetornoNoStore(linha, chamadoLaboratorio) {
  const retornos = DashboardStore.get("retornos");

  if (!Array.isArray(retornos)) {
    console.warn("⚠️ Retornos não encontrados no Store");

    return;
  }

  const retorno = retornos.find((item) => String(item.linha) === String(linha));

  if (!retorno) {
    console.warn("⚠️ Retorno não localizado:", linha);

    return;
  }

  retorno.chamadoFilho = chamadoLaboratorio;

  retorno.status = "SEPARADO PARA ENVIO";

  console.log("🔄 Store atualizado:", retorno);
}

/**
 * ============================================================
 * LOADING BOTÃO
 * ============================================================
 */

function mostrarLoadingRetorno() {
  const botao = document.getElementById("salvarEdicaoRetorno");

  if (botao) {
    botao.disabled = true;

    botao.innerHTML = "⏳ Salvando...";
  }
}

function esconderLoadingRetorno() {
  const botao = document.getElementById("salvarEdicaoRetorno");

  if (botao) {
    botao.disabled = false;

    botao.innerHTML = "Salvar";
  }
}

/**
 * ============================================================
 * FECHAR MODAL
 * ============================================================
 */

function fecharModalRetorno() {
  const modal = document.getElementById("modalEditarRetorno");

  if (modal) {
    modal.style.display = "none";
  }
}

/**
 * ============================================================
 * EVENTOS DO MODAL
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const btnFechar = document.getElementById("fecharModalRetorno");

  const btnCancelar = document.getElementById("cancelarEdicaoRetorno");

  const btnSalvar = document.getElementById("salvarEdicaoRetorno");

  if (btnFechar) {
    btnFechar.onclick = fecharModalRetorno;
  }

  if (btnCancelar) {
    btnCancelar.onclick = fecharModalRetorno;
  }

  if (btnSalvar) {
    btnSalvar.onclick = salvarEdicaoRetorno;
  }
});
