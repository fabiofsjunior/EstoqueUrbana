/**
 * ==========================================================
 * SELEÇÃO DOS RETORNOS
 * ==========================================================
 */

let retornosSelecionados = [];

function iniciarSelecaoRetorno() {
  const tbody = document.getElementById("retorno-body");
  if (!tbody || tbody.dataset.selecaoInicializada === "true") return;

  tbody.dataset.selecaoInicializada = "true";
  tbody.addEventListener("change", (e) => {
    if (!e.target?.classList?.contains("checkRetorno")) return;
    atualizarSelecaoRetorno();
  });

  const btnTodos = document.getElementById("btnSelecionarTodosRetorno");
  if (btnTodos) btnTodos.addEventListener("click", selecionarTodosRetornos);
  atualizarSelecaoRetorno();
}

function obterChecksRetornoVisiveis() {
  const tbody = document.getElementById("retorno-body");
  return tbody ? Array.from(tbody.querySelectorAll("input.checkRetorno")) : [];
}

function atualizarSelecaoRetorno() {
  const checks = obterChecksRetornoVisiveis();
  retornosSelecionados = checks
    .filter((check) => check.checked)
    .map((check) => ({
      linha: check.dataset.linha,
      chamadoPai: check.dataset.chamadoPai,
      chamadoFilho: check.dataset.chamadoFilho,
    }));

  atualizarContadorRetornos();
  atualizarEstadoBotoes();
}

function selecionarTodosRetornos() {
  const checks = obterChecksRetornoVisiveis();
  if (!checks.length) {
    atualizarSelecaoRetorno();
    return;
  }

  const todosMarcados = checks.every((check) => check.checked);
  checks.forEach((check) => {
    check.checked = !todosMarcados;
  });

  atualizarSelecaoRetorno();
}

function atualizarContadorRetornos() {
  const contador = document.getElementById("contadorRetornos");
  if (!contador) return;

  const checks = obterChecksRetornoVisiveis();
  const total = checks.length;
  const selecionados = checks.filter((check) => check.checked).length;

  if (total === 0) {
    contador.textContent = "Nenhum retorno";
  } else if (selecionados === 0) {
    contador.textContent = "Nenhum item selecionado";
  } else {
    contador.textContent = `${selecionados} de ${total} selecionado${selecionados > 1 ? "s" : ""}`;
  }
}

function atualizarEstadoBotoes() {
  const btnDuplicar = document.getElementById("btnDuplicarRetorno");
  if (btnDuplicar) {
    btnDuplicar.style.display = retornosSelecionados.length ? "inline-flex" : "none";
  }

  if (typeof atualizarBotoesRetorno === "function") atualizarBotoesRetorno();
}

function obterRetornosSelecionados() {
  return [...retornosSelecionados];
}
