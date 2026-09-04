/**
 * ============================================================
 * DUPLICAR RETORNO
 * ============================================================
 */

async function duplicarRetornoFront(linha) {
  if (!confirm("Deseja duplicar este chamado?")) return;

  const referencia = validarReferencia(linha, "Linha do retorno");
  if (!referencia.valido) {
    alert(referencia.mensagem);
    return;
  }

  try {
    const resposta = await api("duplicarRetorno", { linha: referencia.valor });
    const validacao = validarRespostaApi(resposta);
    if (!validacao.valido) throw new Error(validacao.mensagem);

    const dados = await api("dashboard");
    if (!dados || typeof dados !== "object") {
      throw new Error("Não foi possível atualizar os dados após a duplicação.");
    }

    DashboardStore.set(dados);
    atualizarTabelaRetornos();
    if (typeof aplicarFiltroRetorno === "function") aplicarFiltroRetorno();
  } catch (erro) {
    console.error("❌ Erro duplicando:", erro);
    alert(erro?.message || "Erro ao duplicar chamado.");
  }
}
