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

  document.getElementById("bancada").innerText = dados.Laboratorio_Maior_Volume_QTD ?? 0;

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

function atualizarDashboard() {
  carregarIndicadores().catch(console.error);
  carregarTopATM().catch(console.error);
  carregarTopPecas().catch(console.error);
  carregarMotivos().catch(console.error);
  carregarConsumoMensal().catch(console.error);
  carregarUltimasMovimentacoes().catch(console.error);
  carregarReparoPorLocal().catch(console.error);
  carregarBancada().catch(console.error);
  carregarVandalismo().catch(console.error);
  carregarReposicao().catch(console.error);

  document.location.reload;
}

window.addEventListener("DOMContentLoaded", () => {
  atualizarDashboard();
  document.getElementById("btnPdfReposicao").onclick = imprimirReposicao;

  setInterval(() => {
    atualizarDashboard();
  }, 600000); // 10 minutos
});
