/**
 * ============================================================
 * FILTRO REPOSIÇÃO DE PEÇAS
 * ============================================================
 *
 * Responsável por:
 *
 * - Filtrar peças exibidas na tabela
 * - Buscar por código ou descrição
 *
 * Não realiza:
 *
 * - Renderização da tabela
 * - Controle de checkbox
 * - Seleção de itens
 * - Geração de PDF
 *
 * ============================================================
 */

/**
 * ============================================================
 * FILTRO DINÂMICO
 * ============================================================
 */

document.addEventListener("input", function (e) {
  if (e.target.id !== "filtroReposicao") {
    return;
  }

  const termo = e.target.value.toLowerCase().trim();

  const linhas = document.querySelectorAll("#reposicao-body tr");

  linhas.forEach((linha) => {
    const textoLinha = linha.textContent.toLowerCase();

    if (textoLinha.includes(termo)) {
      linha.style.display = "";
    } else {
      linha.style.display = "none";
    }
  });
});

/**
 * ============================================================
 * LIMPAR FILTRO
 * ============================================================
 *
 * Caso queira limpar via botão futuramente
 *
 * ============================================================
 */

function limparFiltroReposicao() {
  const campo = document.getElementById("filtroReposicao");

  if (!campo) {
    return;
  }

  campo.value = "";

  const linhas = document.querySelectorAll("#reposicao-body tr");

  linhas.forEach((linha) => {
    linha.style.display = "";
  });
}
