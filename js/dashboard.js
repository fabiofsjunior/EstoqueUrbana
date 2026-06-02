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
  const dados = await api("motivos");

  console.log("DEBUG motivos:", dados);

  if (!Array.isArray(dados)) {
    console.error("Esperado array, veio:", dados);
    return;
  }

  dados.forEach((item) => {
    console.log(item);
  });
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

window.onload = async () => {
  await carregarIndicadores();
  await carregarTopATM();
  await carregarTopPecas();

  await carregarMotivos();
  await carregarConsumoMensal();
  await carregarUltimasMovimentacoes();
};
