/**
 * ============================================================
 * RETORNO - EDIÇÃO DE CHAMADO LABORATÓRIO
 * ============================================================
 */

function editarRetorno(linha) {
  const retornos = DashboardStore.get("retornos");
  if (!Array.isArray(retornos)) return;

  const retorno = retornos.find((item) => String(item.linha) === String(linha));
  if (!retorno) {
    console.warn("⚠️ Retorno não encontrado:", linha);
    return;
  }

  preencherModalRetorno(retorno);
  const modal = document.getElementById("modalEditarRetorno");
  if (modal) modal.style.display = "flex";
}

function preencherModalRetorno(retorno) {
  const campos = {
    retornoLinha: retorno.linha ?? "",
    retornoChamadoPrincipal: retorno.chamadoPai ?? "",
    retornoChamadoLaboratorio: retorno.chamadoFilho ?? "",
    retornoATM: retorno.atm ?? "",
    retornoPeca: retorno.peca ?? "",
    retornoLaboratorio: retorno.laboratorio ?? "",
  };

  Object.entries(campos).forEach(([id, valor]) => {
    const campo = document.getElementById(id);
    if (campo) campo.value = valor;
  });
}

async function salvarEdicaoRetorno() {
  const linha = document.getElementById("retornoLinha")?.value?.trim();
  const chamadoLaboratorio = document
    .getElementById("retornoChamadoLaboratorio")?.value?.trim();

  const referencia = validarReferencia(linha, "Linha do retorno");
  if (!referencia.valido) {
    alert(referencia.mensagem);
    return;
  }

  const chamado = validarReferencia(chamadoLaboratorio, "Chamado Laboratório");
  if (!chamado.valido) {
    alert(chamado.mensagem);
    return;
  }

  try {
    mostrarLoadingRetorno();
    const resposta = await api("salvarFilho", {
      linha: referencia.valor,
      chamadoLaboratorio: chamado.valor,
    });

    const validacao = validarRespostaApi(resposta);
    if (!validacao.valido) throw new Error(validacao.mensagem);

    atualizarRetornoNoStore(referencia.valor, chamado.valor);
    if (typeof aplicarFiltroRetorno === "function") aplicarFiltroRetorno();
    fecharModalRetorno();
  } catch (erro) {
    console.error("❌ Erro ao salvar chamado laboratório:", erro);
    alert(erro?.message || "Erro ao salvar chamado laboratório.");
  } finally {
    esconderLoadingRetorno();
  }
}

function atualizarRetornoNoStore(linha, chamadoLaboratorio) {
  const retornos = DashboardStore.get("retornos");
  if (!Array.isArray(retornos)) return;

  const retorno = retornos.find((item) => String(item.linha) === String(linha));
  if (!retorno) return;

  retorno.chamadoFilho = chamadoLaboratorio;
  retorno.status = "SEPARADO PARA ENVIO";
}

function mostrarLoadingRetorno() {
  const botao = document.getElementById("salvarEdicaoRetorno");
  if (!botao) return;
  botao.disabled = true;
  botao.textContent = "⏳ Salvando...";
}

function esconderLoadingRetorno() {
  const botao = document.getElementById("salvarEdicaoRetorno");
  if (!botao) return;
  botao.disabled = false;
  botao.textContent = "Salvar";
}

function fecharModalRetorno() {
  const modal = document.getElementById("modalEditarRetorno");
  if (modal) modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const btnFechar = document.getElementById("fecharModalRetorno");
  const btnCancelar = document.getElementById("cancelarEdicaoRetorno");
  const btnSalvar = document.getElementById("salvarEdicaoRetorno");

  if (btnFechar) btnFechar.addEventListener("click", fecharModalRetorno);
  if (btnCancelar) btnCancelar.addEventListener("click", fecharModalRetorno);
  if (btnSalvar) btnSalvar.addEventListener("click", salvarEdicaoRetorno);
});
