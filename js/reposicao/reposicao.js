/**
 * ============================================================
 * REPOSIÇÃO DE PEÇAS
 * ============================================================
 *
 * Responsável por:
 *
 * - Renderizar estoque completo
 * - Classificar situação do estoque
 * - Atualizar contador
 * - Controlar seleção
 *
 * Não gera quantidade solicitada.
 * Essa informação pertence apenas ao modal.
 *
 * ============================================================
 */

function renderReposicao(dados) {
  const tbody = document.getElementById("reposicao-body");

  if (!tbody) {
    console.warn("⚠️ reposicao-body não encontrado");
    return;
  }

  tbody.innerHTML = "";

  if (!Array.isArray(dados) || dados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center">
          Nenhuma peça encontrada.
        </td>
      </tr>
    `;

    atualizarContadorReposicao();

    return;
  }

  let html = "";

  dados.forEach((item) => {
    const saldo = Number(item.saldo ?? 0);

    let classeLinha = "";
    let statusTexto = "";
    let statusClasse = "";

    //-----------------------------------------
    // CLASSIFICAÇÃO
    //-----------------------------------------

    if (saldo === 0) {
      classeLinha = "linha-zerado";
      statusTexto = "🔴 ZERADO";
      statusClasse = "status-zerado";
    } else if (saldo <= 10) {
      classeLinha = "linha-critico";
      statusTexto = "🟡 ESTOQUE BAIXO";
      statusClasse = "status-critico";
    } else {
      classeLinha = "linha-normal";
      statusTexto = "🟢 ESTOQUE NORMAL";
      statusClasse = "status-normal";
    }

    html += `

      <tr class="${classeLinha}">

        <td>

          <input
            type="checkbox"
            class="checkReposicao"
            data-codigo="${item.codigo ?? ""}"
            data-descricao="${item.descricao ?? ""}"
            data-saldo="${saldo}"
          >

        </td>

        <td>${item.codigo ?? "-"}</td>

        <td>${item.descricao ?? "-"}</td>

        <td>${saldo}</td>

        <td>

          <span class="status-reposicao ${statusClasse}">
            ${statusTexto}
          </span>

        </td>

      </tr>

    `;
  });

  tbody.innerHTML = html;

  atualizarContadorReposicao();
}

function atualizarTabelaReposicao() {
  const dados = DashboardStore.get("reposicao");

  renderReposicao(dados);
}

function atualizarContadorReposicao() {
  const contador = document.getElementById("contadorReposicao");

  if (!contador) return;

  const selecionados = document.querySelectorAll(
    ".checkReposicao:checked",
  ).length;

  contador.textContent =
    selecionados === 0
      ? "Nenhum item selecionado"
      : `${selecionados} item(ns) selecionado(s)`;
}

document.addEventListener("change", function (e) {
  if (!e.target.classList.contains("checkReposicao")) {
    return;
  }

  atualizarContadorReposicao();
});
