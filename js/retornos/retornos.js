/**
 * ============================================================
 * CARREGA RETORNOS
 * ============================================================
 *
 * A lista inicial também passa pelo filtro,
 * garantindo:
 *
 * - prioridade de status
 * - ordenação
 * - regras futuras
 *
 * ============================================================
 */

function carregarRetornos() {
  const dados = DashboardStore.get("retornos");

  if (!Array.isArray(dados)) {
    console.warn("⚠️ Retornos ainda não carregados");

    return;
  }

  // aplica a mesma regra usada nos filtros

  aplicarFiltroRetorno();
}
