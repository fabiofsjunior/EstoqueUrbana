/**
 * ============================================================
 * FILTRO REPOSIÇÃO DE PEÇAS
 * ============================================================
 *
 * Responsável por:
 *
 * - Filtrar por texto
 * - Filtrar por status
 *
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const filtroTexto = document.getElementById("filtroReposicao");
  const filtroStatus = document.getElementById("statusReposicao");

  function aplicarFiltroReposicao() {
    const texto = (filtroTexto?.value || "").toLowerCase().trim();

    const status = (filtroStatus?.value || "").toLowerCase();

    const linhas = document.querySelectorAll("#reposicao-body tr");

    linhas.forEach((linha) => {
      const codigo = linha.cells[1]?.textContent.toLowerCase() || "";
      const descricao = linha.cells[2]?.textContent.toLowerCase() || "";
      const statusLinha = linha.cells[4]?.textContent.toLowerCase() || "";

      const passaTexto = codigo.includes(texto) || descricao.includes(texto);

      let passaStatus = true;

      if (status !== "") {
        if (status === "zerado") {
          passaStatus = statusLinha.includes("zerado");
        }

        if (status === "baixo") {
          passaStatus = statusLinha.includes("baixo");
        }

        if (status === "normal") {
          passaStatus = statusLinha.includes("normal");
        }
      }

      linha.style.display = passaTexto && passaStatus ? "" : "none";
    });
  }

  filtroTexto?.addEventListener("input", aplicarFiltroReposicao);

  filtroStatus?.addEventListener("change", aplicarFiltroReposicao);
});

/**
 * ============================================================
 * LIMPAR FILTRO
 * ============================================================
 */

function limparFiltroReposicao() {
  const filtroTexto = document.getElementById("filtroReposicao");

  const filtroStatus = document.getElementById("statusReposicao");

  if (filtroTexto) filtroTexto.value = "";

  if (filtroStatus) filtroStatus.value = "";

  document
    .querySelectorAll("#reposicao-body tr")
    .forEach((linha) => (linha.style.display = ""));
}
