/**
 * ============================================================
 * REPOSIÇÃO DE PEÇAS
 * ============================================================
 */

function renderReposicao(dados) {
  const tbody = document.getElementById("reposicao-body");
  if (!tbody) return;
  tbody.replaceChildren();

  if (!Array.isArray(dados) || dados.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.style.textAlign = "center";
    td.textContent = "Nenhuma peça encontrada.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    atualizarContadorReposicao();
    return;
  }

  dados.forEach((item) => {
    const saldo = Number(item.saldo ?? 0);
    const tr = document.createElement("tr");
    const status = saldo === 0
      ? { linha: "linha-zerado", classe: "status-zerado", texto: "🔴 ZERADO" }
      : saldo <= 10
        ? { linha: "linha-critico", classe: "status-critico", texto: "🟡 ESTOQUE BAIXO" }
        : { linha: "linha-normal", classe: "status-normal", texto: "🟢 ESTOQUE NORMAL" };

    tr.className = status.linha;

    const checkTd = document.createElement("td");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "checkReposicao";
    check.dataset.codigo = String(item.codigo ?? "");
    check.dataset.descricao = String(item.descricao ?? "");
    check.dataset.saldo = String(saldo);
    checkTd.appendChild(check);
    tr.appendChild(checkTd);

    [item.codigo, item.descricao, saldo].forEach((valor) => {
      const td = document.createElement("td");
      td.textContent = valor == null || valor === "" ? "-" : String(valor);
      tr.appendChild(td);
    });

    const statusTd = document.createElement("td");
    const span = document.createElement("span");
    span.className = `status-reposicao ${status.classe}`;
    span.textContent = status.texto;
    statusTd.appendChild(span);
    tr.appendChild(statusTd);
    tbody.appendChild(tr);
  });

  atualizarContadorReposicao();
}

function atualizarTabelaReposicao() {
  renderReposicao(DashboardStore.get("reposicao"));
}

function atualizarContadorReposicao() {
  const contador = document.getElementById("contadorReposicao");
  if (!contador) return;
  const selecionados = document.querySelectorAll(".checkReposicao:checked").length;
  contador.textContent = selecionados === 0
    ? "Nenhum item selecionado"
    : `${selecionados} item(ns) selecionado(s)`;
}

document.addEventListener("change", (e) => {
  if (e.target?.classList?.contains("checkReposicao")) atualizarContadorReposicao();
});
