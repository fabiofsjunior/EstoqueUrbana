/**
 * ============================================================
 * MODAL AJUSTE DE QUANTIDADE REPOSIÇÃO
 * ============================================================
 */

let reposicaoSelecionadaPDF = [];

function abrirModalReposicao(lista) {
  reposicaoSelecionadaPDF = Array.isArray(lista) ? lista : [];
  const modal = document.getElementById("modalReposicao");
  const container = document.getElementById("listaQuantidadeReposicao");
  if (!modal || !container) return;

  container.replaceChildren();

  reposicaoSelecionadaPDF.forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "item-modal-reposicao";

    const dados = document.createElement("div");
    dados.className = "dados-reposicao";
    [
      ["Código:", item.codigo],
      ["Peça:", item.descricao],
      ["Saldo Atual:", item.saldo],
    ].forEach(([label, valor]) => {
      const span = document.createElement("span");
      const b = document.createElement("b");
      b.textContent = label + " ";
      span.append(b, document.createTextNode(String(valor ?? "-")));
      dados.appendChild(span);
    });

    const campo = document.createElement("div");
    campo.className = "campo-quantidade";
    const label = document.createElement("label");
    label.textContent = "Quantidade Solicitar";
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.className = "quantidadeReposicao";
    input.dataset.index = String(index);
    input.value = "5";
    campo.append(label, input);

    wrapper.append(dados, campo);
    container.appendChild(wrapper);
  });

  modal.style.display = "flex";
}

function fecharModalReposicao() {
  const modal = document.getElementById("modalReposicao");
  if (modal) modal.style.display = "none";
}

function confirmarReposicaoPDF() {
  const campos = Array.from(document.querySelectorAll(".quantidadeReposicao"));

  if (campos.length !== reposicaoSelecionadaPDF.length) {
    alert("Não foi possível validar os itens da reposição.");
    return;
  }

  const listaFinal = [];
  for (let index = 0; index < reposicaoSelecionadaPDF.length; index += 1) {
    const validacao = validarQuantidade(campos[index].value);
    if (!validacao.valido) {
      alert(validacao.mensagem);
      campos[index].focus();
      return;
    }

    listaFinal.push({
      codigo: reposicaoSelecionadaPDF[index].codigo,
      descricao: reposicaoSelecionadaPDF[index].descricao,
      saldo: Number(reposicaoSelecionadaPDF[index].saldo),
      quantidadeSolicitada: validacao.valor,
    });
  }

  fecharModalReposicao();
  gerarPdfReposicao(listaFinal);
}

document.addEventListener("DOMContentLoaded", () => {
  const fechar = document.getElementById("fecharModalReposicao");
  const cancelar = document.getElementById("cancelarModalReposicao");
  const confirmar = document.getElementById("confirmarModalReposicao");

  if (fechar) fechar.addEventListener("click", fecharModalReposicao);
  if (cancelar) cancelar.addEventListener("click", fecharModalReposicao);
  if (confirmar) confirmar.addEventListener("click", confirmarReposicaoPDF);
});
