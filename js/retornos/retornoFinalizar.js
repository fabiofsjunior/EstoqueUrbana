/**
 * ============================================================
 * FINALIZAÇÃO DE RETORNO DE COMPONENTES
 * ============================================================
 */

let retornoSelecionadoFinalizar = null;

window.abrirModalFinalizarRetorno = function (item) {
  const modal = document.getElementById("modalFinalizarRetorno");
  if (!modal || !item || typeof item !== "object") return;

  retornoSelecionadoFinalizar = item;
  const valor = (campo1, campo2) => item[campo1] ?? item[campo2] ?? "-";
  const dadosModal = {
    finalizarChamadoPai: valor("chamadoPai", "CHAMADO_PAI"),
    finalizarChamadoFilho: valor("chamadoFilho", "CHAMADO_FILHO"),
    finalizarPeca: valor("peca", "PEÇA"),
    finalizarLaboratorio: valor("laboratorio", "LABORATÓRIO"),
    finalizarATM: valor("atm", "ATM"),
    finalizarStatus: valor("status", "STATUS"),
  };

  Object.entries(dadosModal).forEach(([id, valorCampo]) => {
    const campo = document.getElementById(id);
    if (campo) campo.value = valorCampo;
  });

  const obs = document.getElementById("finalizarObservacao");
  if (obs) obs.value = item.observacao ?? item.OBSERVAÇÃO ?? "";
  modal.style.display = "flex";
};

window.fecharModalFinalizarRetorno = function () {
  const modal = document.getElementById("modalFinalizarRetorno");
  if (modal) modal.style.display = "none";
  retornoSelecionadoFinalizar = null;
};

window.confirmarFinalizacaoRetorno = async function () {
  if (!retornoSelecionadoFinalizar) return;

  const item = retornoSelecionadoFinalizar;
  const referencia = validarReferencia(item.linha, "Linha do retorno");
  if (!referencia.valido) {
    alert(referencia.mensagem);
    return;
  }

  const observacao = document.getElementById("finalizarObservacao")?.value?.trim() || "";
  const botao = document.getElementById("btnConfirmarFinalizar");

  try {
    if (botao) {
      botao.disabled = true;
      botao.textContent = "⏳ Finalizando...";
    }

    const resposta = await api("finalizarRetorno", {
      linha: referencia.valor,
      chamadoPai: item.chamadoPai,
      chamadoFilho: item.chamadoFilho,
      observacao,
    });

    const validacao = validarRespostaApi(resposta);
    if (!validacao.valido) throw new Error(validacao.mensagem);

    fecharModalFinalizarRetorno();
    await carregarDashboardCompleto();
    if (typeof carregarRetornos === "function") await carregarRetornos();
    alert("✅ Chamado finalizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao finalizar retorno:", error);
    alert(error?.message || "Erro ao finalizar chamado.");
  } finally {
    if (botao) {
      botao.disabled = false;
      botao.textContent = "✅ Finalizar Chamado";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const fechar = document.getElementById("btnFecharFinalizar");
  const cancelar = document.getElementById("btnCancelarFinalizar");
  const confirmar = document.getElementById("btnConfirmarFinalizar");

  if (fechar) fechar.addEventListener("click", fecharModalFinalizarRetorno);
  if (cancelar) cancelar.addEventListener("click", fecharModalFinalizarRetorno);
  if (confirmar) confirmar.addEventListener("click", confirmarFinalizacaoRetorno);
});
