async function carregarIndicadores() {

  const dados =
    await api("indicadores");

  document.getElementById("totalEstoque").innerText =
    dados.Total_Itens_Estoque || 0;

  document.getElementById("trocasMes").innerText =
    dados.Trocas_Mes || 0;

  document.getElementById("vandalismos").innerText =
    dados.Vandalismos || 0;

  document.getElementById("defeitos").innerText =
    dados.Defeitos_Mes || 0;

  const bancada =
    document.getElementById("bancada");

  if (bancada) {
    bancada.innerText =
      dados.Bancada || 0;
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
    labels.push(item[0]);
    valores.push(item[1]);
  });

  new Chart(
    document.getElementById("graficoConsumo"),

    {
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
    },
  );
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

  const tbody = document.getElementById("pecasBancada");

  tbody.innerHTML = "";

  dados.forEach((item) => {
    tbody.innerHTML += `
      <tr>
        <td>${item.data}</td>
        <td>${item.chamado}</td>
        <td>${item.atm}</td>
        <td>${item.peca}</td>
        <td>${item.destino}</td>
      </tr>
    `;
  });
}

async function carregarVandalismos() {
  const dados = await api("vandalismosLista");

  const tbody = document.getElementById("pecasVandalismos");

  tbody.innerHTML = "";

  dados.forEach((item) => {
    tbody.innerHTML += `
      <tr>
        <td>${item.data}</td>
        <td>${item.chamado}</td>
        <td>${item.atm}</td>
        <td>${item.peca}</td>
        <td>${item.destino}</td>
      </tr>
    `;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  carregarIndicadores().catch(console.error);
  carregarTopATM().catch(console.error);
  carregarTopPecas().catch(console.error);
  carregarMotivos().catch(console.error);
  carregarConsumoMensal().catch(console.error);
  carregarUltimasMovimentacoes().catch(console.error);
  carregarReparoPorLocal().catch(console.error);
  carregarBancada().catch(console.error);
  carregarVandalismos().catch(console.error);
});
