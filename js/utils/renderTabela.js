function obterDataRegistro(valor) {
  if (!valor) return null;

  if (typeof valor === "string" && valor.includes("/")) {
    const partes = valor.split(" ")[0].split("/");
    if (partes.length === 3) {
      const data = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
      return Number.isNaN(data.getTime()) ? null : data;
    }
  }

  // Para ISO/UTC, preserva o mês civil informado pela origem.
  const iso = String(valor).trim();
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?/);
  if (match) {
    const data = new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4] || 0),
      Number(match[5] || 0),
      Number(match[6] || 0),
    );
    return Number.isNaN(data.getTime()) ? null : data;
  }

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

function renderTabelaMensal({ dados, tbodyId, mensagemVazia }) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.replaceChildren();
  const hoje = new Date();
  const registros = Array.isArray(dados)
    ? dados
        .filter((item) => {
          const data = obterDataRegistro(item.data);
          return data && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
        })
        .sort((a, b) => obterDataRegistro(b.data) - obterDataRegistro(a.data))
    : [];

  if (registros.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.style.textAlign = "center";
    td.textContent = mensagemVazia || "Nenhum registro encontrado.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  registros.forEach((item) => {
    const tr = document.createElement("tr");
    [item.chamado, item.atm, item.peca, item.destino, item.data].forEach((valor) => {
      const td = document.createElement("td");
      td.textContent = valor == null || valor === "" ? "-" : String(valor);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
