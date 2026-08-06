/**
 * ============================================================
 * FINALIZAÇÃO DE RETORNO DE COMPONENTES
 * ============================================================
 *
 * Responsável por:
 *
 * - Abrir modal de finalização
 * - Receber retorno selecionado
 * - Enviar linha correta ao backend
 * - Atualizar DashboardStore
 * - Atualizar tabela de retornos
 *
 * ============================================================
 */

/**
 * Registro selecionado atualmente
 */
let retornoSelecionadoFinalizar = null;

/**
 * ============================================================
 * ABRIR MODAL FINALIZAÇÃO
 * ============================================================
 *
 * Recebe o objeto completo enviado pelo render
 *
 * ============================================================
 */

window.abrirModalFinalizarRetorno = function (item) {
  console.log("📦 Registro recebido no modal:", item);

  const modal = document.getElementById("modalFinalizarRetorno");

  if (!modal) {
    console.warn("⚠️ modalFinalizarRetorno não encontrado");

    return;
  }

  retornoSelecionadoFinalizar = item;

  const valor = (campo1, campo2) => {
    return item[campo1] ?? item[campo2] ?? "-";
  };

  const dadosModal = {
    finalizarChamadoPai: valor("chamadoPai", "CHAMADO_PAI"),

    finalizarChamadoFilho: valor("chamadoFilho", "CHAMADO_FILHO"),

    finalizarPeca: valor("peca", "PEÇA"),

    finalizarLaboratorio: valor("laboratorio", "LABORATÓRIO"),

    finalizarATM: valor("atm", "ATM"),

    finalizarStatus: valor("status", "STATUS"),
  };

  Object.entries(dadosModal).forEach(([id, valor]) => {
    const campo = document.getElementById(id);

    if (campo) {
      campo.value = valor;
    }
  });

  const obs = document.getElementById("finalizarObservacao");

  if (obs) {
    obs.value = item.observacao ?? item.OBSERVAÇÃO ?? "";
  }

  modal.style.display = "flex";
};

/**
 * ============================================================
 * FECHAR MODAL
 * ============================================================
 */

window.fecharModalFinalizarRetorno = function () {
  const modal = document.getElementById("modalFinalizarRetorno");

  if (modal) {
    modal.style.display = "none";
  }

  retornoSelecionadoFinalizar = null;
};

/**
 * ============================================================
 * CONFIRMAR FINALIZAÇÃO
 * ============================================================
 */

window.confirmarFinalizacaoRetorno = async function () {
  if (!retornoSelecionadoFinalizar) {
    console.warn("⚠️ Nenhum retorno selecionado");

    return;
  }

  const item = retornoSelecionadoFinalizar;

  const observacao =
    document.getElementById("finalizarObservacao")?.value?.trim() || "";

  const botao = document.getElementById("btnConfirmarFinalizar");

  try {
    if (botao) {
      botao.disabled = true;

      botao.innerHTML = "⏳ Finalizando...";
    }

    const dadosEnvio = {
      linha: item.linha,

      chamadoPai: item.chamadoPai,

      chamadoFilho: item.chamadoFilho,

      observacao: observacao,
    };

    console.log("📤 Enviando finalização:", dadosEnvio);

    const resposta = await api("finalizarRetorno", dadosEnvio);

    console.log("✅ Resposta backend:", resposta);

    if (!resposta || resposta.sucesso === false) {
      throw new Error(resposta?.mensagem || "Erro ao finalizar retorno");
    }

    fecharModalFinalizarRetorno();

    /**
     * Atualiza cache completo
     */
    await carregarDashboardCompleto();

    /**
     * Renderiza novamente retornos
     */
    if (typeof carregarRetornos === "function") {
      await carregarRetornos();
    }

    alert("✅ Chamado finalizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao finalizar retorno:", error);

    alert("Erro ao finalizar chamado.");
  } finally {
    if (botao) {
      botao.disabled = false;

      botao.innerHTML = "✅ Finalizar Chamado";
    }
  }
};

/**
 * ============================================================
 * EVENTOS DOS BOTÕES DO MODAL
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const fechar = document.getElementById("btnFecharFinalizar");

  const cancelar = document.getElementById("btnCancelarFinalizar");

  const confirmar = document.getElementById("btnConfirmarFinalizar");

  if (fechar) {
    fechar.onclick = fecharModalFinalizarRetorno;
  }

  if (cancelar) {
    cancelar.onclick = fecharModalFinalizarRetorno;
  }

  if (confirmar) {
    confirmar.onclick = confirmarFinalizacaoRetorno;
  }
});
