/**
 * ============================================================
 * SERVIÇO DE REPOSIÇÃO
 * ============================================================
 *
 * Responsável por:
 *
 * - Buscar os dados do DashboardStore
 * - Validar os dados recebidos
 * - Delegar a renderização para reposicao.js
 *
 * Não:
 *
 * - Monta HTML
 * - Classifica estoque
 * - Controla checkboxes
 *
 * Essas responsabilidades pertencem a:
 *
 * reposicao/reposicao.js
 *
 * ============================================================
 */

async function carregarReposicao() {
  const dados = DashboardStore.get("reposicao");

  if (!Array.isArray(dados)) {
    console.warn("⚠️ Dados de reposição não encontrados no cache");

    const tbody = document.getElementById("reposicao-body");

    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center">
            Nenhuma peça encontrada.
          </td>
        </tr>
      `;
    }

    return;
  }

  if (typeof renderReposicao !== "function") {
    console.error("❌ renderReposicao() não encontrada.");

    return;
  }

  renderReposicao(dados);
}
