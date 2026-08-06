/**
 * ============================================================
 * SERVIÇO DE REPOSIÇÃO
 * ============================================================
 *
 * Responsável por:
 *
 * - Consumir dados do DashboardStore
 * - Renderizar estoque crítico/reposição
 * - Não realiza chamadas API
 *
 * Dados:
 * DashboardStore.get("reposicao")
 *
 * ============================================================
 */

async function carregarReposicao() {
  const dados = DashboardStore.get("reposicao");

  if (!Array.isArray(dados)) {
    console.warn("⚠️ Dados de reposição não encontrados no cache");

    return;
  }

  const tbody = document.getElementById("reposicao-body");

  if (!tbody) {
    console.warn("⚠️ reposicao-body não encontrado");

    return;
  }

  tbody.innerHTML = "";

  let html = "";

  dados.forEach((item) => {
    const saldo = Number(item.saldo ?? 0);

    const status =
      saldo <= 0
        ? {
            texto: "🔴 Zerado",
            classe: "status-zerado",
          }
        : {
            texto: "🟡 Crítico",
            classe: "status-critico",
          };

    html += `


        <tr class="linha-reposicao">


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

                <span class="status-reposicao ${status.classe}">

                    ${status.texto}

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
 * CONTADOR DE SELEÇÃO
 * ============================================================
 */

function atualizarContadorReposicao() {
  const selecionados = document.querySelectorAll(
    ".checkReposicao:checked",
  ).length;

  const contador = document.getElementById("contadorReposicao");

  if (!contador) {
    return;
  }

  if (selecionados === 0) {
    contador.textContent = "Nenhum item selecionado";
  } else {
    contador.textContent = `${selecionados} item(ns) selecionado(s)`;
  }
}
