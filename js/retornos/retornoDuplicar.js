/**
 * ============================================================
 * DUPLICAR RETORNO
 * ============================================================
 */

async function duplicarRetornoFront(linha) {
  if (!confirm("Deseja duplicar este chamado?")) {
    return;
  }

  try {
    console.log("📄 Duplicando retorno:", linha);

    const resposta = await api("duplicarRetorno", {
      linha,
    });

    console.log("✅ Retorno duplicado:", resposta);

    if (!resposta.sucesso) {
      alert(resposta.mensagem);

      return;
    }

    // Atualiza dashboard/cache

    const dados = await api("dashboard");

    DashboardStore.set(dados);

    atualizarTabelaRetornos();
  } catch (erro) {
    console.error("❌ Erro duplicando:", erro);

    alert("Erro ao duplicar chamado.");
  }
}
