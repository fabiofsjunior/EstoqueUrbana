async function carregarIndicadores() {
  const dados = await api("indicadores");

  document.getElementById("totalEstoque").innerText = dados.Total_Itens_Estoque;

  document.getElementById("trocasMes").innerText = dados.Trocas_Mes;

  document.getElementById("vandalismos").innerText = dados.Vandalismos_Mes;

  document.getElementById("defeitos").innerText = dados.Defeitos_Mes;
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
        <td>${item[4]}</td>
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
          label: "Consumo Mensal",
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

  dados.forEach((item) => {
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
}

async function carregarVandalismo() {
  const dados = await api("vandalismo");

  const tbody = document.getElementById("vandalismo-body");

  if (!tbody) return;

  tbody.innerHTML = "";

  dados.forEach((item) => {
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

  function atualizarHorario() {
    const agora = new Date();

    document.getElementById("ultimaAtualizacao").innerText =
      "Atualizado às " + agora.toLocaleTimeString("pt-BR");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  atualizarDashboard();

  setInterval(
    atualizarDashboard,
    600000, // 10 minutos
  );
});
