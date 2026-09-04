/**
 * ============================================================
 * RENDERIZAÇÃO DOS RETORNOS
 * ============================================================
 */

function obterStatusRetorno(status) {
  switch (normalizarStatus(status)) {
    case "PENDENTE":
      return { classeLinha: "linha-pendente", classeStatus: "status-pendente", icone: "🟥", texto: "PENDENTE" };
    case "SEPARADO PARA ENVIO":
      return { classeLinha: "linha-envio", classeStatus: "status-envio", icone: "🟨", texto: "SEPARADO PARA ENVIO" };
    case "FINALIZADO":
      return { classeLinha: "linha-finalizado", classeStatus: "status-finalizado", icone: "🟩", texto: "FINALIZADO" };
    default:
      return { classeLinha: "linha-pendente", classeStatus: "status-pendente", icone: "🟥", texto: "PENDENTE" };
  }
}

function obterAcaoRetorno(status) {
  switch (normalizarStatus(status)) {
    case "PENDENTE":
      return { icone: "✏️", texto: "Editar", classe: "btn-editar-retorno", tipo: "editar" };
    case "SEPARADO PARA ENVIO":
      return { icone: "✅", texto: "Finalizar", classe: "btn-finalizar-retorno", tipo: "finalizar" };
    default:
      return { icone: "🔒", texto: "Finalizado", classe: "btn-finalizado-retorno", tipo: "bloqueado" };
  }
}

function criarBotaoAcaoRetorno(item, acao) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = `btn-acao-retorno ${acao.classe}`;
  botao.title = acao.texto;
  botao.textContent = acao.icone;
  botao.dataset.acao = acao.tipo;
  botao.dataset.linha = String(item.linha ?? "");
  botao.disabled = acao.tipo === "bloqueado";
  return botao;
}

function renderTabelaRetornos(dados) {
  const tbody = document.getElementById("retorno-body");
  if (!tbody) return;

  tbody.replaceChildren();

  if (!Array.isArray(dados) || dados.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 8;
    td.textContent = "Nenhum retorno encontrado.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    if (typeof atualizarContadorRetornos === "function") atualizarContadorRetornos();
    return;
  }

  const prioridade = { PENDENTE: 1, "SEPARADO PARA ENVIO": 2, FINALIZADO: 3 };
  const ordenados = [...dados].sort(
    (a, b) =>
      (prioridade[normalizarStatus(a.status)] ?? 99) -
      (prioridade[normalizarStatus(b.status)] ?? 99),
  );

  ordenados.forEach((item) => {
    const status = obterStatusRetorno(item.status);
    const acao = obterAcaoRetorno(item.status);
    const tr = document.createElement("tr");
    tr.className = `linha-retorno ${status.classeLinha}`;

    const checkboxTd = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkRetorno";
    checkbox.dataset.linha = String(item.linha ?? "");
    checkbox.dataset.chamadoPai = String(item.chamadoPai ?? "");
    checkbox.dataset.chamadoFilho = String(item.chamadoFilho ?? "");
    checkboxTd.appendChild(checkbox);
    tr.appendChild(checkboxTd);

    [item.chamadoPai, item.chamadoFilho, item.peca, item.laboratorio, item.atm].forEach((valor) => {
      const td = document.createElement("td");
      td.textContent = valor == null || valor === "" ? "-" : String(valor);
      tr.appendChild(td);
    });

    const statusTd = document.createElement("td");
    const statusSpan = document.createElement("span");
    statusSpan.className = `status-retorno ${status.classeStatus}`;
    statusSpan.textContent = `${status.icone} ${status.texto}`;
    statusTd.appendChild(statusSpan);
    tr.appendChild(statusTd);

    const acaoTd = document.createElement("td");
    acaoTd.appendChild(criarBotaoAcaoRetorno(item, acao));
    tr.appendChild(acaoTd);
    tbody.appendChild(tr);
  });

  if (typeof atualizarContadorRetornos === "function") atualizarContadorRetornos();
}

function inicializarAcoesRetornoRender() {
  const tbody = document.getElementById("retorno-body");
  if (!tbody || tbody.dataset.acoesInicializadas === "true") return;

  tbody.dataset.acoesInicializadas = "true";
  tbody.addEventListener("click", (event) => {
    const botao = event.target.closest("button[data-acao]");
    if (!botao || botao.disabled) return;

    const linha = botao.dataset.linha;
    if (botao.dataset.acao === "editar" && typeof editarRetorno === "function") {
      editarRetorno(linha);
    }
    if (botao.dataset.acao === "finalizar" && typeof abrirModalFinalizarRetorno === "function") {
      const retornos = DashboardStore.get("retornos") || [];
      const item = retornos.find((registro) => String(registro.linha) === String(linha));
      if (item) abrirModalFinalizarRetorno(item);
    }
  });
}

document.addEventListener("DOMContentLoaded", inicializarAcoesRetornoRender);

function atualizarTabelaRetornos() {
  const dados = DashboardStore.get("retornos");
  if (Array.isArray(dados)) renderTabelaRetornos(dados);
}
