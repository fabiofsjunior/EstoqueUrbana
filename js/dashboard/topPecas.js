function carregarTopPecas() {
  const dados = DashboardStore.get("topPecas");

  if (!Array.isArray(dados)) {
    console.warn("⚠️ Dados Top Peças não carregados");

    return;
  }

  const tabela = document.getElementById("topPecas");

  if (!tabela) return;

  tabela.innerHTML = "";

  let html = "";

  dados.forEach((item) => {
    html += `

            <tr>

                <td>${item[0]}</td>

                <td>${item[1]}</td>

            </tr>

        `;
  });

  tabela.innerHTML = html;
}
