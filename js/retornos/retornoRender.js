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

/**
 * ============================================================
 * NORMALIZA STATUS
 * ============================================================
 *
 * Corrige pequenas variações de escrita vindas da planilha.
 *
 * Exemplos aceitos:
 *
 * FINALZD
 * finalizado
 * Finalizado
 * FINALIZADO
 * separado envio
 * separado para envio
 *
 */

function normalizarStatus(status) {
  const texto = String(status || "")
    .trim()
    .toUpperCase();

  if (texto.startsWith("PEND")) {
    return "PENDENTE";
  }

  if (texto.includes("SEPARADO") || texto.includes("ENVIO")) {
    return "SEPARADO PARA ENVIO";
  }

  if (texto.startsWith("FINAL") || texto === "FINALZD") {
    return "FINALIZADO";
  }

  return "PENDENTE";
}

/**
 * ============================================================
 * STATUS VISUAL
 * ============================================================
 */

function obterStatusRetorno(status) {
  status = normalizarStatus(status);

  switch (status) {
    case "PENDENTE":
      return {
        classeLinha: "linha-pendente",

        classeStatus: "status-pendente",

        icone: "🟥",

        texto: "PENDENTE",
      };

    case "SEPARADO PARA ENVIO":
      return {
        classeLinha: "linha-envio",

        classeStatus: "status-envio",

        icone: "🟨",

        texto: "SEPARADO PARA ENVIO",
      };

    case "FINALIZADO":
      return {
        classeLinha: "linha-finalizado",

        classeStatus: "status-finalizado",

        icone: "🟩",

        texto: "FINALIZADO",
      };

    default:
      return {
        classeLinha: "linha-pendente",

        classeStatus: "status-pendente",

        icone: "🟥",

        texto: "PENDENTE",
      };
  }
}

/**
 * ============================================================
 * AÇÃO POR STATUS
 * ============================================================
 */

function obterAcaoRetorno(status) {
  status = normalizarStatus(status);

  switch (status) {
    case "PENDENTE":
      return {
        icone: "✏️",

        texto: "Editar",

        classe: "btn-editar-retorno",

        funcao: "editarRetorno",
      };

    case "SEPARADO PARA ENVIO":
      return {
        icone: "✅",

        texto: "Finalizar",

        classe: "btn-finalizar-retorno",

        funcao: "finalizarRetorno",
      };

    case "FINALIZADO":
      return {
        icone: "🔒",

        texto: "Finalizado",

        classe: "btn-finalizado-retorno",

        funcao: null,
      };

    default:
      return {
        icone: "⚙️",

        texto: "Ação",

        classe: "",

        funcao: null,
      };
  }
}

/**
 * ============================================================
 * RENDERIZA TABELA
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

  /**
   * ==========================================================
   * ORDENAÇÃO POR PRIORIDADE
   * ==========================================================
   */

  const prioridadeStatus = {
    PENDENTE: 1,

    "SEPARADO PARA ENVIO": 2,

    FINALIZADO: 3,
  };

  dados.sort((a, b) => {
    const statusA = normalizarStatus(a.status);

    const statusB = normalizarStatus(b.status);

    return (
      (prioridadeStatus[statusA] || 99) - (prioridadeStatus[statusB] || 99)
    );
  });

  let html = "";

  dados.forEach((item) => {
    const statusInfo = obterStatusRetorno(item.status);

    const acao = obterAcaoRetorno(item.status);

    const linha = item.linha ?? "";

    let botaoAcao = "";

    if (acao.funcao) {
      botaoAcao = `


        <button


          class="btn-acao-retorno ${acao.classe}"


          onclick="${acao.funcao}('${linha}')"


          title="${acao.texto}"


        >


          ${acao.icone}


        </button>


      `;
    } else {
      botaoAcao = `


        <button


          class="btn-acao-retorno ${acao.classe}"


          disabled


          title="${acao.texto}"


        >


          ${acao.icone}


        </button>


      `;
    }

    html += `


      <tr class="linha-retorno ${statusInfo.classeLinha}">



        <td>


          <input


            type="checkbox"


            class="checkRetorno"


            data-linha="${linha}"


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


          <span class="status-retorno ${statusInfo.classeStatus}">


            ${statusInfo.icone}


            ${statusInfo.texto}


          </span>


        </td>



        <td>


          ${botaoAcao}


        </td>



      </tr>


    `;
  });

  tbody.innerHTML = html;

  /**
   * Atualiza contador dos selecionados
   */

  atualizarContadorRetornos();
}

/**
 * ============================================================
 * ATUALIZA TABELA
 * ============================================================
 */

function atualizarTabelaRetornos() {
  const dados = DashboardStore.get("retornos");

  if (Array.isArray(dados)) {
    renderTabelaRetornos(dados);
  }
}
