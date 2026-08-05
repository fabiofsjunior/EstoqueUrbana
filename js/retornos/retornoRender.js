/**
 * ============================================================
 * RENDERIZAÇÃO DOS RETORNOS
 * ============================================================
 *
 * Responsável por:
 *
 * - Renderizar a tabela de retorno de componentes
 * - Aplicar destaque visual conforme status
 * - Controlar seleção dos chamados
 *
 * Dados vêm do DashboardStore.
 * Não realiza chamadas API.
 *
 * ============================================================
 */

function renderTabelaRetornos(dados) {
  const tbody = document.getElementById("retorno-body");

  if (!tbody) {
    console.warn("⚠️ retorno-body não encontrado");

    return;
  }

  tbody.innerHTML = "";

  if (!Array.isArray(dados) || dados.length === 0) {
    tbody.innerHTML = `

            <tr>

                <td colspan="8" style="text-align:center">

                    Nenhum retorno encontrado.

                </td>

            </tr>

        `;

    return;
  }

  // ============================================================
  // ORDENA PRIORIDADE POR STATUS
  // ============================================================

  const prioridadeStatus = {
    PENDENTE: 1,

    "SEPARADO PARA ENVIO": 2,

    FINALIZADO: 3,
  };

  dados.sort((a, b) => {
    return (
      (prioridadeStatus[a.status] || 99) - (prioridadeStatus[b.status] || 99)
    );
  });

  let html = "";

  dados.forEach((item) => {
    const statusInfo = obterStatusRetorno(item.status);

    html += `

        <tr class="linha-retorno ${statusInfo.classeLinha}">


            <td>

                <input

                    type="checkbox"

                    class="checkRetorno"

                    data-chamado-pai="${item.chamadoPai ?? ""}"

                    data-chamado-filho="${item.chamadoFilho ?? ""}"

                >

            </td>



            <td>

                ${item.chamadoPai ?? "-"}

            </td>



            <td>

                ${item.chamadoFilho ?? "-"}

            </td>



            <td>

                ${item.peca ?? "-"}

            </td>



            <td>

                ${item.laboratorio ?? "-"}

            </td>



            <td>

                ${item.atm ?? "-"}

            </td>



            <td>

                <span class="status-retorno ${statusInfo.classeLinha}">

                    ${statusInfo.icone}

                    ${item.status ?? "PENDENTE"}

                </span>

            </td>



            <td>

                <button

                    class="btn-acao-retorno"

                    onclick="abrirDetalheRetorno('${item.chamadoPai ?? ""}')"

                >

                    ⚙️

                </button>


            </td>



        </tr>


        `;
  });

  tbody.innerHTML = html;
}

/**
 * ============================================================
 * STATUS VISUAL
 * ============================================================
 */

function obterStatusRetorno(status) {
  switch (status) {
    case "PENDENTE":
      return {
        classeLinha: "linha-pendente",

        classeStatus: "status-pendente",

        icone: "🟥",
      };

    case "SEPARADO PARA ENVIO":
      return {
        classeLinha: "linha-envio",

        classeStatus: "status-envio",

        icone: "🟨",
      };

    case "FINALIZADO":
      return {
        classeLinha: "linha-finalizado",

        classeStatus: "status-finalizado",

        icone: "🟩",
      };

    default:
      return {
        classeLinha: "",

        classeStatus: "",

        icone: "⬜",
      };
  }
}

/**
 * ============================================================
 * FUNÇÃO AUXILIAR PARA ATUALIZAÇÃO
 * ============================================================
 *
 * Permite redesenhar a tabela
 * após filtros ou alterações.
 *
 * ============================================================
 */

function atualizarTabelaRetornos() {
  const dados = DashboardStore.get("retornos");

  if (Array.isArray(dados)) {
    renderTabelaRetornos(dados);
  }
}
