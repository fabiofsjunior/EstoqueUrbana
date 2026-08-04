async function carregarIndicadores() {
  const dados = await api("indicadores");
  // ==========================
  // Valores Indicadores
  // ==========================
  document.getElementById("ultimaAtualizacao").innerText =
    "Atualizado às " + formatarDataAtualizacao(dados.Ultima_Atualizacao) + "h";

  document.getElementById("totalItens").innerText =
    dados.Total_Itens_Estoque ?? 0;

  document.getElementById("totalPecasMaisTrocadaQtd").innerText =
    dados.Peca_Mais_Trocada_QTD ?? 0;

  document.getElementById("totalPecasMaisTrocadaNome").innerText =
    dados.Peca_Mais_Trocada ?? 0;

  document.getElementById("trocasMes").innerText = dados.Trocas_Mes ?? 0;

  document.getElementById("estoqueCritico").innerText =
    dados.Estoque_Critico ?? 0;

  document.getElementById("vandalismos").innerText = dados.Vandalismos_Mes ?? 0;

  document.getElementById("defeitos").innerText = dados.Defeitos_Mes ?? 0;

  document.getElementById("bancada").innerText =
    dados.Laboratorio_Maior_Volume_QTD ?? 0;

  document.getElementById("bancadaLocal").innerText =
    dados.Laboratorio_Maior_Volume ?? 0;

  document.getElementById("atmCriticoQTD").innerText =
    dados.ATM_Mais_Problematico_QTD ?? "-";

  document.getElementById("atmCritico").innerText =
    dados.ATM_Mais_Problematico ?? "-";

  document.getElementById("atmTrend").innerHTML =
    `${dados.ATM_Mais_Problematico_QTD} chamados  `;

  // ==========================
  // Tendências
  // ==========================

  atualizarTrend("trocasTrend", dados.Trocas_Variacao);

  atualizarTrend("defeitosTrend", dados.Defeitos_Variacao);

  atualizarTrend("vandalismosTrend", dados.Vandalismos_Variacao);

  // Não possuem comparação ainda

  document.getElementById("totalItensTrend").innerHTML = "Estoque Atual";

  document.getElementById("totalPecasTrend").innerHTML = "Peça mais trocada";

  document.getElementById("estoqueTrend").innerHTML =
    dados.Estoque_Critico + " abaixo do mínimo";

  document.getElementById("bancadaTrend").innerHTML =
    "LAB com maior movimentação";

  document.getElementById("atmTrend").innerHTML = "Maior Nº de chamados";
}

function atualizarTrend(id, valor) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    return;
  }

  valor = Number(valor) || 0;

  elemento.className = "trend";

  if (valor > 0) {
    elemento.innerHTML = "▲ +" + valor + "%";

    elemento.classList.add("positivo");
  } else if (valor < 0) {
    elemento.innerHTML = "▼ " + valor + "%";

    elemento.classList.add("negativo");
  } else {
    elemento.innerHTML = "— 0%";

    elemento.classList.add("neutro");
  }
}

async function carregarTopATM() {
  const dados = await api("top10atm");

  const tabela = document.getElementById("topATM");

  tabela.innerHTML = "";

  dados.forEach((item) => {
    tabela.innerHTML += `
      <tr>
        <td>${item[0]}</td>
        <td>${item[1]}</td>
      </tr>
    `;
  });
}
async function carregarTopPecas() {
  const dados = await api("top10pecas");

  const tabela = document.getElementById("topPecas");

  tabela.innerHTML = "";

  dados.forEach((item) => {
    tabela.innerHTML += `
      <tr>
        <td>${item[0]}</td>
        <td>${item[1]}</td>
      </tr>
    `;
  });
}

async function carregarMotivos() {
  try {
    const dados = await api("motivos");

    const container = document.getElementById("motivos-body");

    if (!container) {
      console.error("Elemento #motivos-body não encontrado");
      return;
    }

    container.innerHTML = "";

    let html = "";

    dados.forEach((item) => {
      html += `
        <tr>
          <td>${item.motivo}</td>
          <td>${item.quantidade}</td>
        </tr>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error("Erro ao carregar motivos:", err);
  }
}

async function carregarUltimasMovimentacoes() {
  const dados = await api("ultimas");

  let html = "";

  dados.forEach((item) => {
    html += `
      <tr>
        <td>${item[0]}</td>
        <td>${item[1]}</td>
        <td>${item[2]}</td>
        <td>${item[3]}</td>
      </tr>
    `;
  });

  document.getElementById("ultimasMov").innerHTML = html;
}

async function carregarConsumoMensal() {
  const dados = await api("consumo");

  const labels = [];
  const valores = [];

  dados.forEach((item) => {
    let mes = item[0];

    if (typeof mes === "string" && mes.includes("T")) {
      const data = new Date(mes);

      mes =
        String(data.getMonth() + 1).padStart(2, "0") + "/" + data.getFullYear();
    }

    labels.push(mes);

    valores.push(item[1]);
  });

  new Chart(document.getElementById("graficoConsumo"), {
    type: "bar",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Nº de Trocas",
          data: valores,
        },
      ],
    },
  });
}

async function carregarReparoPorLocal() {
  try {
    const dados = await api("reparoLocal");

    const container = document.getElementById("reparoLocal");

    if (!container) {
      console.error("Container não encontrado");
      return;
    }

    container.innerHTML = "";

    if (!Array.isArray(dados)) {
      console.error("Resposta não é array:", dados);
      return;
    }

    dados.forEach((item) => {
      container.innerHTML += `
        <tr>
          <td>${item.destino ?? "-"}</td>
          <td>${item.quantidade ?? 0}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Erro ao carregar reparo por local:", err);
  }
}

async function carregarBancada() {
  const dados = await api("bancada");

  const tbody = document.getElementById("bancada-body");

  if (!tbody) return;

  tbody.innerHTML = "";

  const hoje = new Date();

  dados
    // Apenas registros do mês atual
    .filter((item) => {
      const data = converterDataBR(item.data);

      return (
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear()
      );
    })

    // Mais recente para o mais antigo
    .sort((a, b) => converterDataBR(b.data) - converterDataBR(a.data))

    // Renderização
    .forEach((item) => {
      tbody.innerHTML += `
        <tr>
          <td>${item.chamado}</td>
          <td>${item.atm}</td>
          <td>${item.peca}</td>
          <td>${item.destino}</td>
          <td>${item.data}</td>
        </tr>
      `;
    });

  if (tbody.innerHTML === "") {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          Nenhum reparo encontrado neste mês.
        </td>
      </tr>
    `;
  }
}

async function carregarVandalismo() {
  const dados = await api("vandalismo");

  const tbody = document.getElementById("vandalismo-body");

  if (!tbody) return;

  tbody.innerHTML = "";

  const hoje = new Date();

  dados
    // Apenas registros do mês atual
    .filter((item) => {
      const data = converterDataBR(item.data);

      return (
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear()
      );
    })

    // Ordena do mais recente para o mais antigo
    .sort((a, b) => converterDataBR(b.data) - converterDataBR(a.data))

    // Renderiza os registros
    .forEach((item) => {
      tbody.innerHTML += `
        <tr>
          <td>${item.chamado}</td>
          <td>${item.atm}</td>
          <td>${item.peca}</td>
          <td>${item.destino}</td>
          <td>${item.data}</td>
        </tr>
      `;
    });

  // Caso não exista nenhum registro do mês atual
  if (tbody.innerHTML === "") {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          Nenhum registro encontrado para este mês.
        </td>
      </tr>
    `;
  }
}

function imprimirBancada() {
  const tabela = document.querySelector("#bancada-body");

  const linhas = tabela.innerHTML;

  const janela = window.open("", "_blank");

  janela.document.write(`
    <html>
      <head>

        <title>Relatório de Bancada</title>

        <style>

          body{
            font-family: Arial, sans-serif;
            padding:20px;
          }

          h1{
            margin-bottom:20px;
          }

          table{
            width:100%;
            border-collapse:collapse;
          }

          th,td{
            border:1px solid #ccc;
            padding:8px;
            text-align:left;
          }

          th{
            background:#f3f4f6;
          }

        </style>

      </head>

      <body>

        <h1>Relatório de Bancada</h1>

        <table>

          <thead>
            <tr>
              <th>Chamado</th>
              <th>ATM</th>
              <th>Peça</th>
              <th>Destino</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            ${linhas}
          </tbody>

        </table>

      </body>
    </html>
  `);

  janela.document.close();

  setTimeout(() => {
    janela.print();
  }, 500);
}

function imprimirVandalismo() {
  const tabela = document.querySelector("#vandalismo-body");

  const linhas = tabela.innerHTML;

  const janela = window.open("", "_blank");

  janela.document.write(`
    <html>
      <head>

        <title>Relatório de Vandalismo</title>

        <style>

          body{
            font-family: Arial, sans-serif;
            padding:20px;
          }

          h1{
            margin-bottom:20px;
          }

          table{
            width:100%;
            border-collapse:collapse;
          }

          th,td{
            border:1px solid #ccc;
            padding:8px;
            text-align:left;
          }

          th{
            background:#f3f4f6;
          }

        </style>

      </head>

      <body>

        <h1>Relatório de Vandalismo</h1>

        <table>

          <thead>
            <tr>
              <th>Chamado</th>
              <th>ATM</th>
              <th>Peça</th>
              <th>Destino</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            ${linhas}
          </tbody>

        </table>

      </body>
    </html>
  `);

  janela.document.close();

  setTimeout(() => {
    janela.print();
  }, 500);
}

function imprimirReposicao() {
  const linhasSelecionadas = [];

  document.querySelectorAll("#reposicao-body tr").forEach((tr) => {
    const checkbox = tr.querySelector(".checkReposicao");

    if (checkbox && checkbox.checked) {
      const colunas = tr.querySelectorAll("td");

      linhasSelecionadas.push({
        codigo: colunas[1].textContent.trim(),
        descricao: colunas[2].textContent.trim(),
        saldo: colunas[3].textContent.trim(),
        status: colunas[4].textContent.trim(),
      });
    }
  });

  if (linhasSelecionadas.length === 0) {
    alert("Selecione pelo menos uma peça.");
    return;
  }

  const htmlLinhas = linhasSelecionadas
    .map(
      (item) => `
    <tr>
      <td>${item.codigo}</td>
      <td>${item.descricao}</td>
      <td style="text-align:center;">${item.saldo}</td>
      <td>${item.status}</td>
    </tr>
  `,
    )
    .join("");

  const janela = window.open("", "_blank");

  if (!janela) {
    alert("O navegador bloqueou a abertura da janela de impressão.");
    return;
  }

  janela.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Solicitação de Reposição</title>

        <style>

          body{
            font-family:Arial,sans-serif;
            padding:25px;
          }

          h2{
            margin-bottom:5px;
          }

          p{
            margin-bottom:20px;
            color:#666;
          }

          table{
            width:100%;
            border-collapse:collapse;
          }

          th{
            background:#005bbb;
            color:white;
          }

          th,td{
            border:1px solid #ccc;
            padding:8px;
          }

        </style>

      </head>

      <body>

        <h2>Solicitação de Reposição de Estoque</h2>

        <p>Data: ${new Date().toLocaleString("pt-BR")}</p>

        <table>

          <thead>

            <tr>

              <th>Código</th>
              <th>Descrição</th>
              <th>Saldo</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            ${htmlLinhas}

          </tbody>

        </table>

      </body>

    </html>
  `);

  janela.document.close();

  janela.focus();

  setTimeout(() => {
    janela.print();
    janela.close();
  }, 500);
}

function converterDataBR(dataHora) {
  const [data, hora] = dataHora.split(" - ");
  const [dia, mes, ano] = data.split("/").map(Number);
  const [h, m] = hora.split(":").map(Number);

  return new Date(ano, mes - 1, dia, h, m);
}

function formatarDataAtualizacao(dataIso) {
  if (!dataIso) return "-";

  const data = new Date(dataIso);

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const btnBancada = document.getElementById("btnPdfBancada");

  if (btnBancada) {
    btnBancada.addEventListener("click", imprimirBancada);
  }

  const btnVandalismo = document.getElementById("btnPdfVandalismo");

  if (btnVandalismo) {
    btnVandalismo.addEventListener("click", imprimirVandalismo);
  }
});

let pecasReposicao = [];
let pecasReposicaoOriginal = [];

async function carregarReposicao() {
  try {
    const dados = await api("reposicao");

    pecasReposicaoOriginal = [...dados];

    renderReposicao(dados);
  } catch (erro) {
    console.error("Erro ao carregar peças para reposição:", erro);
  }
}

function renderReposicao(lista) {
  const tbody = document.getElementById("reposicao-body");

  if (!tbody) {
    console.error("Elemento #reposicao-body não encontrado");

    return;
  }

  if (!Array.isArray(lista)) {
    console.error("Dados de reposição inválidos:", lista);

    return;
  }

  pecasReposicao = [...lista];
  // limpa tabela antes de renderizar

  tbody.innerHTML = "";

  // caso não tenha peças

  if (lista.length === 0) {
    tbody.innerHTML = `

      <tr>

        <td colspan="5" style="text-align:center">

          Nenhuma peça necessita reposição 🎉

        </td>

      </tr>

    `;

    return;
  }

  let html = "";

  lista.forEach((item, index) => {
    const saldo = Number(item.saldo || 0);

    html += `

      <tr>


        <td>

          <input

            type="checkbox"

            class="checkReposicao"

            data-index="${index}"

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



        <td class="${saldo === 0 ? "status-zero" : "status-baixo"}">


          ${saldo === 0 ? "ZERADO" : "ESTOQUE BAIXO"}


        </td>



      </tr>

    `;
  });

  tbody.innerHTML = html;
}

// ================================
// FILTRO DE PEÇAS PARA REPOSIÇÃO
// ================================

document
  .getElementById("filtroReposicao")
  .addEventListener("keyup", function () {
    const texto = this.value.trim().toLowerCase();

    // Se o campo estiver vazio, volta a lista completa
    if (texto === "") {
      renderReposicao(pecasReposicaoOriginal);
      return;
    }

    const filtrado = pecasReposicaoOriginal.filter((item) => {
      return (
        String(item.codigo).toLowerCase().includes(texto) ||
        String(item.descricao).toLowerCase().includes(texto) ||
        String(item.status).toLowerCase().includes(texto)
      );
    });

    renderReposicao(filtrado);
  });

const btnSelecionarTodos = document.getElementById("btnSelecionarTodos");

btnSelecionarTodos.addEventListener("click", () => {
  const checks = document.querySelectorAll(".checkReposicao");

  const marcar = [...checks].some((cb) => !cb.checked);

  checks.forEach((cb) => {
    cb.checked = marcar;
  });

  btnSelecionarTodos.innerHTML = marcar
    ? "☐ Desmarcar todos"
    : "☑ Selecionar todos";
});
//=====================================================
// RETORNO DE PEÇAS PARA MANUTENÇÃO
//=====================================================

document
  .getElementById("filtroRetorno")
  ?.addEventListener("keyup", carregarRetornos);

document
  .getElementById("filtroStatus")
  ?.addEventListener("change", carregarRetornos);

document
  .getElementById("filtroLaboratorio")
  ?.addEventListener("change", carregarRetornos);

//=====================================================
// CARREGAR RETORNOS
//=====================================================

async function carregarRetornos() {
  const tbody = document.getElementById("retorno-body");

  if (!tbody) {
    console.error("Elemento retorno-body não encontrado");

    return;
  }

  //=====================================================
  // LOADING
  //=====================================================

  tbody.innerHTML = `

    <tr>

      <td colspan="8">

        🔄 Atualizando retornos...

      </td>

    </tr>

  `;

  try {
    const resposta = await api("retornos");

    //=====================================================
    // PROTEÇÃO CONTRA ERRO DA API
    //=====================================================

    if (!Array.isArray(resposta)) {
      console.error("API retornou formato inválido:", resposta);

      tbody.innerHTML = `

        <tr>

          <td colspan="8">

            ❌ Erro ao carregar retornos

          </td>

        </tr>

      `;

      return;
    }

    const dados = resposta.map((item) => ({ ...item }));

    tbody.innerHTML = "";

    //=====================================================
    // NORMALIZA STATUS PELO CHAMADO FILHO
    //=====================================================

    dados.forEach((item) => {
      const chamadoFilho = String(item.chamadoFilho || "").trim();

      // Sem chamado filho = sempre PENDENTE

      if (!chamadoFilho) {
        item.status = "PENDENTE";
      }

      // Com chamado filho e não finalizado
      // = SEPARADO PARA ENVIO
      else if (item.status !== "FINALIZADO") {
        item.status = "SEPARADO PARA ENVIO";
      }
    });

    const filtroTexto =
      document.getElementById("filtroRetorno")?.value.trim().toUpperCase() ||
      "";

    const filtroStatus = document.getElementById("filtroStatus")?.value || "";

    const filtroLab = document.getElementById("filtroLaboratorio")?.value || "";

    //=====================================================
    // PRIORIDADE DOS STATUS
    //=====================================================

    const prioridade = {
      PENDENTE: 1,

      "SEPARADO PARA ENVIO": 2,

      FINALIZADO: 3,
    };

    dados.sort((a, b) => {
      return (prioridade[a.status] || 99) - (prioridade[b.status] || 99);
    });

    let totalExibido = 0;

    dados.forEach((item) => {
      //----------------------------------------
      // FILTRO TEXTO
      //----------------------------------------

      const texto = (
        String(item.chamadoPai || "") +
        " " +
        String(item.chamadoFilho || "") +
        " " +
        String(item.peca || "") +
        " " +
        String(item.atm || "")
      ).toUpperCase();

      if (filtroTexto && !texto.includes(filtroTexto)) {
        return;
      }

      //----------------------------------------
      // FILTRO STATUS
      //----------------------------------------

      if (filtroStatus && item.status !== filtroStatus) {
        return;
      }

      //----------------------------------------
      // FILTRO LABORATÓRIO
      //----------------------------------------

      if (filtroLab && item.laboratorio !== filtroLab) {
        return;
      }

      //----------------------------------------
      // STATUS CSS
      //----------------------------------------

      const classeStatus = String(item.status || "")
        .replace(/\s+/g, "-")

        .toLowerCase();

      //----------------------------------------
      // MONTA LINHA
      //----------------------------------------

      tbody.innerHTML += `


<tr>


<td>

<input

type="checkbox"

class="chkRetorno"

data-linha="${item.linha}">

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

<span class="status ${classeStatus}">

${item.status || "PENDENTE"}

</span>

</td>




<td>


<button

class="btn-mini"

title="Informar chamado filho"

onclick="informarChamadoFilho(${item.linha})">

✏️

</button>




<button

class="btn-mini"

title="Duplicar registro"

onclick="duplicarRetorno(${item.linha})">

📑

</button>





<button

class="btn-mini"

title="Finalizar retorno"

onclick="finalizarRetorno(${item.linha})">

✅

</button>


</td>



</tr>


`;

      totalExibido++;
    });

    //=====================================================
    // NENHUM RESULTADO
    //=====================================================

    if (totalExibido === 0) {
      tbody.innerHTML = `

      <tr>

        <td colspan="8">

          Nenhum retorno encontrado.

        </td>

      </tr>

      `;
    }
  } catch (err) {
    console.error("Erro ao carregar retornos:", err);

    tbody.innerHTML = `

      <tr>

        <td colspan="8">

          ❌ Erro de comunicação com servidor.

        </td>

      </tr>

    `;
  }
}
//=====================================================
// INFORMAR CHAMADO FILHO
//=====================================================

async function informarChamadoFilho(linha) {
  const chamado = prompt("Informe o chamado filho:");

  if (!chamado) {
    return;
  }

  try {
    const resposta = await api("salvarFilho", {
      linha: linha,
      chamado: chamado,
    });

    console.log("Retorno salvarFilho:", resposta);

    if (resposta.erro) {
      alert("Erro ao salvar:\n" + resposta.erro);

      return;
    }

    alert("✅ Chamado filho informado com sucesso!");

    await carregarRetornos();
  } catch (err) {
    console.error(err);

    alert("❌ Erro ao informar chamado filho.");
  }
}

//=====================================================
// DUPLICAR RETORNO
//=====================================================

async function duplicarRetorno(linha) {
  if (!confirm("Duplicar este componente?")) {
    return;
  }

  try {
    const resposta = await api("duplicarRetorno", {
      linha: linha,
    });

    console.log("Retorno duplicação:", resposta);

    if (resposta.erro) {
      alert("Erro:\n" + resposta.erro);

      return;
    }

    alert("📑 Registro duplicado!");

    await carregarRetornos();
  } catch (err) {
    console.error(err);

    alert("Erro ao duplicar retorno.");
  }
}
//=====================================================
// FINALIZAR RETORNO
//=====================================================

async function finalizarRetorno(linha) {
  if (!confirm("Finalizar retorno?")) {
    return;
  }

  try {
    const resposta = await api("finalizarRetorno", {
      linha: linha,
    });

    console.log("Retorno finalização:", resposta);

    if (resposta.erro) {
      alert("Erro:\n" + resposta.erro);

      return;
    }

    alert("✅ Retorno finalizado!");

    await carregarRetornos();
  } catch (err) {
    console.error(err);

    alert("Erro ao finalizar retorno.");
  }
}

//=====================================================
// SELECIONAR TODOS OS RETORNOS
//=====================================================

document
  .getElementById("btnSelecionarTodosRetorno")
  ?.addEventListener("click", function () {
    const checkboxes = document.querySelectorAll(".chkRetorno");

    if (checkboxes.length === 0) {
      alert("Nenhum retorno disponível para seleção.");

      return;
    }

    // Verifica se todos estão selecionados

    const todosSelecionados = Array.from(checkboxes).every(
      (chk) => chk.checked,
    );

    // Alterna seleção

    checkboxes.forEach((chk) => {
      chk.checked = !todosSelecionados;
    });

    // Atualiza texto do botão

    this.innerHTML = todosSelecionados
      ? "☑ Selecionar Todos"
      : "☐ Desmarcar Todos";
  });

//=====================================================
// BOTÃO PDF RETORNO
//=====================================================

document
  .getElementById("btnPdfRetorno")
  ?.addEventListener("click", gerarPdfRetorno);

//=====================================================
// GERAR PDF RETORNO COMPONENTES
//=====================================================

async function gerarPdfRetorno() {
  const selecionados = Array.from(
    document.querySelectorAll(".chkRetorno:checked"),
  );

  if (selecionados.length === 0) {
    alert("Selecione ao menos um componente para gerar o retorno.");

    return;
  }

  // Busca dados atuais

  const dados = await api("retornos");

  if (!Array.isArray(dados)) {
    alert("Erro ao carregar dados dos retornos.");

    return;
  }

  const linhasSelecionadas = selecionados.map((chk) =>
    String(chk.dataset.linha),
  );

  const itens = dados.filter((item) =>
    linhasSelecionadas.includes(String(item.linha)),
  );

  //=====================================================
  // VALIDA CHAMADO FILHO
  //=====================================================

  const semChamado = itens.filter((item) => {
    const chamadoFilho = String(item.chamadoFilho || "").trim();

    return chamadoFilho === "";
  });

  if (semChamado.length > 0) {
    alert(
      "⚠️ Existem componentes selecionados sem CHAMADO_FILHO.\n\n" +
        "Informe o chamado filho antes de gerar o retorno.",
    );

    return;
  }

  //=====================================================
  // AGRUPAMENTO POR PEÇA
  //=====================================================

  const agrupado = {};

  itens.forEach((item) => {
    const peca = String(item.peca || "SEM IDENTIFICAÇÃO").trim();

    const chamadoFilho = String(item.chamadoFilho || "").trim();

    if (!agrupado[peca]) {
      agrupado[peca] = {
        quantidade: 0,

        chamados: [],
      };
    }

    agrupado[peca].quantidade++;

    if (chamadoFilho && !agrupado[peca].chamados.includes(chamadoFilho)) {
      agrupado[peca].chamados.push(chamadoFilho);
    }
  });

  //=====================================================
  // MONTA TABELA
  //=====================================================

  let linhasTabela = "";

  Object.keys(agrupado)

    .sort()

    .forEach((peca) => {
      const item = agrupado[peca];

      linhasTabela += `

        <tr>

          <td>
            ${item.quantidade}
          </td>


          <td>
            ${peca}
          </td>


          <td>
            ${item.chamados.join("; ")}
          </td>


        </tr>

      `;
    });

  //=====================================================
  // FILTRO LABORATÓRIO
  //=====================================================

  const laboratorio =
    document.getElementById("filtroLaboratorio")?.value || "TODOS";

  //=====================================================
  // JANELA DE IMPRESSÃO
  //=====================================================

  const janela = window.open("", "_blank");

  janela.document.write(`

<!DOCTYPE html>

<html>

<head>

<title>
Retorno de Componentes
</title>


<style>

body {

  font-family: Arial;

  padding: 30px;

}


h2 {

  text-align:center;

}


.info {

  margin-bottom:20px;

  font-weight:bold;

}


table {

  width:100%;

  border-collapse:collapse;

}


th {

  background:#005bbb;

  color:white;

  padding:10px;

}


td {

  padding:8px;

  border:1px solid #ccc;

  text-align:center;

  vertical-align:top;

}


</style>

</head>


<body>


<h2>
RETORNO DE COMPONENTES PARA MANUTENÇÃO
</h2>



<div class="info">

Laboratório:
${laboratorio}

<br>

Data:
${new Date().toLocaleDateString("pt-BR")}

</div>




<table>


<thead>

<tr>

<th>
QUANTIDADE
</th>


<th>
NOME DA PEÇA
</th>


<th>
CHAMADOS
</th>


</tr>

</thead>


<tbody>

${linhasTabela}

</tbody>


</table>


</body>

</html>

  `);

  janela.document.close();

  janela.print();
}

let listaRetornosAtual = [];
let atualizandoDashboard = false;

async function atualizarDashboard() {
  if (atualizandoDashboard) {
    return;
  }

  atualizandoDashboard = true;

  try {
    await executar(carregarIndicadores);

    await executar(carregarTopATM);

    await executar(carregarTopPecas);

    await executar(carregarMotivos);

    await executar(carregarConsumoMensal);

    await executar(carregarUltimasMovimentacoes);

    await executar(carregarReparoPorLocal);

    await executar(carregarBancada);

    await executar(carregarVandalismo);

    await executar(carregarReposicao);

    await executar(carregarRetornos);
  } finally {
    atualizandoDashboard = false;
  }
}

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executar(funcao) {
  try {
    await funcao();
  } catch (e) {
    console.error(e);
  }

  await esperar(150);
}

window.addEventListener("DOMContentLoaded", async () => {
  await atualizarDashboard();

  document.getElementById("btnPdfReposicao").onclick = imprimirReposicao;

  setInterval(atualizarDashboard, 600000);
});
