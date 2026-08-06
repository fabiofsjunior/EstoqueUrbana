/**
 * ============================================================
 * RENDERIZAÇÃO DOS RETORNOS
 * ============================================================
 *
 * Responsável por:
 *
 * - Renderizar tabela de retorno de componentes
 * - Aplicar cores por status
 * - Criar ações conforme status
 * - Preparar dados para finalização
 *
 * Fonte:
 * DashboardStore
 *
 * NÃO realiza chamadas API.
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

  if (texto.startsWith("FINAL") || texto.includes("FINALZD")) {
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
  switch (normalizarStatus(status)) {
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
 * AÇÃO POR STATUS
 * ============================================================
 */

function obterAcaoRetorno(status) {
  switch (normalizarStatus(status)) {
    case "PENDENTE":
      return {
        icone: "✏️",

        texto: "Editar",

        classe: "btn-editar-retorno",

        tipo: "editar",
      };

    case "SEPARADO PARA ENVIO":
      return {
        icone: "✅",

        texto: "Finalizar",

        classe: "btn-finalizar-retorno",

        tipo: "finalizar",
      };

    case "FINALIZADO":
      return {
        icone: "🔒",

        texto: "Finalizado",

        classe: "btn-finalizado-retorno",

        tipo: "bloqueado",
      };
  }
}

/**
 * ============================================================
 * RENDER TABELA
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
        <td colspan="8">
          Nenhum retorno encontrado.
        </td>
      </tr>

    `;

    return;
  }

  const prioridade = {
    PENDENTE: 1,

    "SEPARADO PARA ENVIO": 2,

    FINALIZADO: 3,
  };

  dados.sort((a, b) => {
    return (
      prioridade[normalizarStatus(a.status)] -
      prioridade[normalizarStatus(b.status)]
    );
  });

  let html = "";

  dados.forEach((item) => {
    const status = obterStatusRetorno(item.status);

    const acao = obterAcaoRetorno(item.status);

    let botao = "";

    if (acao.tipo === "finalizar") {
      botao = `

      <button

        class="
          btn-acao-retorno
          ${acao.classe}
        "


        onclick='abrirModalFinalizarRetorno(${JSON.stringify(item)})'


        title="${acao.texto}"

      >

        ${acao.icone}

      </button>


      `;
    } else if (acao.tipo === "editar") {
      botao = `

      <button

        class="
          btn-acao-retorno
          ${acao.classe}
        "

        onclick='editarRetorno("${item.linha}")'

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


data-linha="${item.linha ?? ""}"


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
