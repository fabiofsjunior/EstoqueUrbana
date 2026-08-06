/**
 * ==========================================================
 * SELEÇÃO DOS RETORNOS
 * ==========================================================
 *
 * Responsável por:
 *
 * ✔ Selecionar itens
 * ✔ Selecionar todos os itens visíveis
 * ✔ Atualizar contador
 * ✔ Exibir botão Duplicar
 * ✔ Preparar futuras ações em lote
 *
 * ==========================================================
 */

let retornosSelecionados = [];

/**
 * ==========================================================
 * Inicializa eventos
 * ==========================================================
 */

function iniciarSelecaoRetorno() {
  const tbody = document.getElementById("retorno-body");

  if (!tbody) return;

  tbody.addEventListener("change", function (e) {
    if (!e.target.classList.contains("checkRetorno")) {
      return;
    }

    atualizarSelecaoRetorno();
  });

  const btnTodos = document.getElementById("btnSelecionarTodosRetorno");

  if (btnTodos) {
    btnTodos.addEventListener("click", selecionarTodosRetornos);
  }

  atualizarSelecaoRetorno();
}

/**
 * ==========================================================
 * Atualiza lista de selecionados
 * ==========================================================
 */

function atualizarSelecaoRetorno() {
  retornosSelecionados = Array.from(
    document.querySelectorAll(".checkRetorno:checked"),
  ).map((check) => ({
    chamadoPai: check.dataset.chamadoPai,

    chamadoFilho: check.dataset.chamadoFilho,
  }));

  atualizarContadorRetornos();

  atualizarEstadoBotoes();
}

/**
 * ==========================================================
 * Seleciona / Desmarca todos os itens visíveis
 * ==========================================================
 */

function selecionarTodosRetornos() {
  const checks = document.querySelectorAll(".checkRetorno");

  if (!checks.length) return;

  const todosMarcados = Array.from(checks).every((check) => check.checked);

  checks.forEach((check) => {
    check.checked = !todosMarcados;
  });

  atualizarSelecaoRetorno();
}

/**
 * ==========================================================
 * Atualiza contador
 * ==========================================================
 */

function atualizarContadorRetornos() {
  const contador = document.getElementById("contadorRetornos");

  if (!contador) return;

  const total = document.querySelectorAll(".checkRetorno").length;

  const selecionados = document.querySelectorAll(
    ".checkRetorno:checked",
  ).length;

  if (total === 0) {
    contador.textContent = "Nenhum retorno";

    return;
  }

  if (selecionados === 0) {
    contador.textContent = "Nenhum item selecionado";

    return;
  }

  contador.textContent = `${selecionados} de ${total} selecionado${selecionados > 1 ? "s" : ""}`;
}

/**
 * ==========================================================
 * Atualiza estado dos botões
 * ==========================================================
 */

function atualizarEstadoBotoes() {
  const btnDuplicar = document.getElementById("btnDuplicarRetorno");

  if (btnDuplicar) {
    btnDuplicar.style.display = retornosSelecionados.length
      ? "inline-flex"
      : "none";
  }
}

/**
 * ==========================================================
 * Retorna os itens selecionados
 * ==========================================================
 */

function obterRetornosSelecionados() {
  return [...retornosSelecionados];
}
