/**
 * ============================================================
 * REPOSIÇÃO DE PEÇAS
 * ============================================================
 *
 * Responsável por:
 *
 * - Renderizar estoque completo
 * - Classificar situação do estoque
 * - Controlar seleção
 * - Atualizar contador
 *
 * Fonte:
 * DashboardStore
 *
 * ============================================================
 */

/**
 * ============================================================
 * RENDERIZA TABELA
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

            <td colspan="6" style="text-align:center">

                Nenhuma peça encontrada.

            </td>

        </tr>

        `;

    return;
  }

  let html = "";

  dados.forEach((item) => {
    const saldo = Number(item.saldo ?? 0);

    let classeLinha = "";
    let statusTexto = "";
    let statusClasse = "";

    if (saldo <= 0) {
      classeLinha = "linha-zerado";

      statusTexto = "🔴 ZERADO";

      statusClasse = "status-zerado";
    } else if (saldo < 5) {
      classeLinha = "linha-critico";

      statusTexto = "🟡 ESTOQUE BAIXO";

      statusClasse = "status-critico";
    } else {
      classeLinha = "linha-normal";

      statusTexto = "🟢 NORMAL";

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



            <td>

                ${item.codigo ?? "-"}

            </td>



            <td>

                ${item.descricao ?? "-"}

            </td>



            <td>

                ${saldo}

            </td>



            <td>

                5

            </td>



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

/**
 * ============================================================
 * CARREGA CACHE
 * ============================================================
 */

function atualizarTabelaReposicao() {
  const dados = DashboardStore.get("reposicao");

  if (Array.isArray(dados)) {
    renderReposicao(dados);
  } else {
    console.warn("⚠️ Reposição não encontrada no cache");
  }
}

/**
 * ============================================================
 * CONTADOR
 * ============================================================
 */

function atualizarContadorReposicao() {
  const selecionados = document.querySelectorAll(
    ".checkReposicao:checked",
  ).length;

  const contador = document.getElementById("contadorReposicao");

  if (!contador) return;

  if (selecionados === 0) {
    contador.textContent = "Nenhum item selecionado";
  } else {
    contador.textContent = `${selecionados} item(ns) selecionado(s)`;
  }
}

/**
 * ============================================================
 * CHECKBOX INDIVIDUAL
 * ============================================================
 */

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("checkReposicao")) {
    atualizarContadorReposicao();
  }
});

