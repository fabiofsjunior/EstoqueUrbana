/**
 * ============================================================
 * RENDERIZAÇÃO DOS RETORNOS
 * ============================================================
 *
 * Responsável por:
 *
 * - Renderizar tabela de retorno de componentes
 * - Aplicar cores por status
 * - Criar seleção dos registros
 * - Criar ações conforme status
 *
 * NÃO realiza chamadas API.
 * Dados vêm exclusivamente do DashboardStore.
 *
 * ============================================================
 */

/**
 * ============================================================
 * NORMALIZA STATUS
 * ============================================================
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
  const normalizado = normalizarStatus(status);

  switch (normalizado) {
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
  }
}

/**
 * ============================================================
 * BOTÃO DE AÇÃO
 * ============================================================
 */

function obterAcaoRetorno(status) {
  const normalizado = normalizarStatus(status);

  switch (normalizado) {
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
    console.warn("retorno-body não encontrado");

    return;
  }

  tbody.innerHTML = "";

  if (!Array.isArray(dados) || dados.length === 0) {
    tbody.innerHTML = `

      <tr>
        <td colspan="8">
          Nenhum retorno encontrado.
        </td>
      </tr>

    `;

    return;
  }

  /**
   * PRIORIDADE STATUS
   */

  const prioridade = {
    PENDENTE: 1,

    "SEPARADO PARA ENVIO": 2,

    FINALIZADO: 3,
  };

  dados.sort((a, b) => {
    return (
      (prioridade[normalizarStatus(a.status)] || 99) -
      (prioridade[normalizarStatus(b.status)] || 99)
    );
  });

  let html = "";

  dados.forEach((item) => {
    const status = obterStatusRetorno(item.status);

    const acao = obterAcaoRetorno(item.status);

    let botao = "";

    if (acao.funcao) {
      botao = `

      <button

        class="
          btn-acao-retorno
          ${acao.classe}
        "

        onclick="
          ${acao.funcao}('${item.linha}')
        "

        title="${acao.texto}"

      >

        ${acao.icone}

      </button>

      `;
    } else {
      botao = `

      <button

        class="
          btn-acao-retorno
          ${acao.classe}
        "

        disabled

        title="${acao.texto}"

      >

        ${acao.icone}

      </button>

      `;
    }

    html += `


<tr class="
  linha-retorno
  ${status.classeLinha}
">


<td>

<input

type="checkbox"

class="checkRetorno"

data-linha="${item.linha}"

data-chamado-pai="${item.chamadoPai || ""}"

data-chamado-filho="${item.chamadoFilho || ""}"

>

</td>



<td>
${item.chamadoPai || "-"}
</td>



<td>
${item.chamadoFilho || "-"}
</td>



<td>
${item.peca || "-"}
</td>



<td>
${item.laboratorio || "-"}
</td>



<td>
${item.atm || "-"}
</td>



<td>

<span class="
status-retorno
${status.classeStatus}
">

${status.icone}

${status.texto}

</span>


</td>



<td>

${botao}

</td>



</tr>


`;
  });

  tbody.innerHTML = html;

  if (typeof atualizarContadorRetornos === "function") {
    atualizarContadorRetornos();
  }
}

/**
 * ============================================================
 * ATUALIZAÇÃO MANUAL
 * ============================================================
 */

function atualizarTabelaRetornos() {
  const dados = DashboardStore.get("retornos");

  if (Array.isArray(dados)) {
    renderTabelaRetornos(dados);
  }
}
