/**
 * ============================================================
 * MODAL AJUSTE DE QUANTIDADE REPOSIÇÃO
 * ============================================================
 *
 * Responsável por:
 *
 * - Conferência antes do PDF
 * - Mostrar saldo atual
 * - Ajustar quantidade solicitada
 * - Enviar dados para PDF
 *
 * ============================================================
 */

let reposicaoSelecionadaPDF = [];

/**
 * ABRIR MODAL
 */

function abrirModalReposicao(lista) {
  reposicaoSelecionadaPDF = lista;

  const modal = document.getElementById("modalReposicao");

  const container = document.getElementById("listaQuantidadeReposicao");

  if (!modal || !container) {
    console.warn("Modal reposição não encontrado");

    return;
  }

  let html = "";

  lista.forEach((item, index) => {
    html += `


        <div class="item-modal-reposicao">


            <div class="dados-reposicao">


                <span>

                    <b>Código:</b>
                    ${item.codigo}

                </span>


                <span>

                    <b>Peça:</b>
                    ${item.descricao}

                </span>


                <span>

                    <b>Saldo Atual:</b>
                    ${item.saldo}

                </span>



            </div>



            <div class="campo-quantidade">


                <label>

                    Quantidade Solicitar

                </label>



                <input


                    type="number"


                    min="1"


                    class="quantidadeReposicao"


                    data-index="${index}"


                    value="5"



                >


            </div>



        </div>



        `;
  });

  container.innerHTML = html;

  modal.style.display = "flex";
}

/**
 * FECHAR MODAL
 */

function fecharModalReposicao() {
  const modal = document.getElementById("modalReposicao");

  if (modal) {
    modal.style.display = "none";
  }
}

/**
 * CONFIRMAR E GERAR PDF
 */

function confirmarReposicaoPDF() {
  const campos = document.querySelectorAll(".quantidadeReposicao");

  const listaFinal = reposicaoSelecionadaPDF.map((item, index) => {
    return {
      codigo: item.codigo,

      descricao: item.descricao,

      saldo: Number(item.saldo),

      quantidadeSolicitada: Number(campos[index].value),
    };
  });

  fecharModalReposicao();

  gerarPdfReposicao(listaFinal);
}

/**
 * EVENTOS
 */

document.addEventListener("DOMContentLoaded", () => {
  const fechar = document.getElementById("fecharModalReposicao");

  const cancelar = document.getElementById("cancelarModalReposicao");

  const confirmar = document.getElementById("confirmarModalReposicao");

  if (fechar) {
    fechar.onclick = fecharModalReposicao;
  }

  if (cancelar) {
    cancelar.onclick = fecharModalReposicao;
  }

  if (confirmar) {
    confirmar.onclick = confirmarReposicaoPDF;
  }
});
