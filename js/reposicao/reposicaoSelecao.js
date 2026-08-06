/**
 * ============================================================
 * CONTROLE DE SELEÇÃO - REPOSIÇÃO
 * ============================================================
 *
 * Responsável por:
 *
 * - Selecionar todos os itens
 * - Desmarcar todos os itens
 * - Atualizar contador
 * - Atualizar texto do botão
 *
 * Não realiza:
 *
 * - Renderização da tabela
 * - Filtros
 * - PDF
 *
 * ============================================================
 */

/**
 * ============================================================
 * SELECIONAR / DESMARCAR TODOS
 * ============================================================
 */

function selecionarTodosReposicao() {
  const checks = document.querySelectorAll(".checkReposicao");

  if (!checks.length) {
    console.warn("⚠️ Nenhuma peça encontrada");

    return;
  }

  const selecionados = document.querySelectorAll(
    ".checkReposicao:checked",
  ).length;

  const marcarTodos = selecionados !== checks.length;

  checks.forEach((check) => {
    check.checked = marcarTodos;
  });

  atualizarContadorReposicao();

  atualizarTextoBotaoReposicao();
}

/**
 * ============================================================
 * ATUALIZA TEXTO DO BOTÃO
 * ============================================================
 */

function atualizarTextoBotaoReposicao() {
  const botao = document.getElementById("btnSelecionarTodos");

  if (!botao) {
    return;
  }

  const checks = document.querySelectorAll(".checkReposicao");

  const selecionados = document.querySelectorAll(".checkReposicao:checked");

  if (checks.length > 0 && selecionados.length === checks.length) {
    botao.innerHTML = "☑ Desmarcar Todos";
  } else {
    botao.innerHTML = "☐ Selecionar Todos";
  }
}

/**
 * ============================================================
 * CHECKBOX INDIVIDUAL
 * ============================================================
 *
 * Atualiza:
 *
 * - Contador
 * - Texto do botão
 *
 * ============================================================
 */

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("checkReposicao")) {
    atualizarContadorReposicao();

    atualizarTextoBotaoReposicao();
  }
});

/**
 * ============================================================
 * BOTÃO SELECIONAR TODOS
 * ============================================================
 */

document.addEventListener("click", function (e) {
  const botao = e.target.closest("#btnSelecionarTodos");

  if (!botao) {
    return;
  }

  e.preventDefault();

  selecionarTodosReposicao();
});

/**
 * ============================================================
 * ATUALIZA BOTÃO APÓS RENDERIZAÇÃO
 * ============================================================
 *
 * Útil quando a tabela é carregada
 * novamente pelo DashboardStore.
 *
 * ============================================================
 */

function resetarBotaoSelecaoReposicao() {
  const botao = document.getElementById("btnSelecionarTodos");

  if (!botao) {
    return;
  }

  botao.innerHTML = "☐ Selecionar Todos";
}
