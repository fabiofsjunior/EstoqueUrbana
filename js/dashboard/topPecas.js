function carregarTopPecas() {
  const dados = DashboardStore.get("topPecas");
  if (!Array.isArray(dados)) return;

  const tabela = document.getElementById("topPecas");
  if (!tabela) return;

  tabela.replaceChildren();
  dados.forEach((item) => {
    if (!Array.isArray(item)) return;
    const tr = document.createElement("tr");
    [item[0], item[1]].forEach((valor) => {
      const td = document.createElement("td");
      td.textContent = valor == null || valor === "" ? "-" : String(valor);
      tr.appendChild(td);
    });
    tabela.appendChild(tr);
  });
}
