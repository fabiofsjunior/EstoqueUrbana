/**
 * ============================================================
 * RETORNO PDF / ETIQUETAS
 * ============================================================
 *
 * Projeto:
 * GESTÃO DE ESTOQUE Urbana/PE
 *
 * ============================================================
 * IMPRESSÃO NORMAL
 * ============================================================
 *
 * Mantém a impressão consolidada dos retornos selecionados.
 *
 * ============================================================
 * IMPRESSÃO DE ETIQUETAS
 * ============================================================
 *
 * A4:
 * 210mm × 297mm
 *
 * Margem superior:
 * 10mm
 *
 * Margens laterais:
 * 5mm
 *
 * Frente:
 * 100mm × 50mm
 *
 * Verso:
 * 100mm × 50mm
 *
 * Frente + Verso:
 *
 * 100mm + 100mm = 200mm
 *
 * Sem gap horizontal.
 *
 * ============================================================
 */

/* ============================================================
   IMPRESSÃO NORMAL DOS RETORNOS
   ============================================================ */

function imprimirRetornosSelecionados() {
  const selecionados = document.querySelectorAll(".checkRetorno:checked");

  if (selecionados.length === 0) {
    alert("Selecione pelo menos um retorno.");

    return;
  }

  const linhasSelecionadas = Array.from(selecionados).map((item) =>
    Number(item.dataset.linha),
  );

  const retornos = DashboardStore.get("retornos") || [];

  const lista = retornos.filter((item) =>
    linhasSelecionadas.includes(Number(item.linha)),
  );

  if (lista.length === 0) {
    alert("Nenhum retorno encontrado.");

    return;
  }

  /**
   * ==========================================================
   * AGRUPAMENTO POR PEÇA
   * ==========================================================
   */

  const agrupado = {};

  lista.forEach((item) => {
    const peca = limparTexto(item.peca) || "SEM IDENTIFICAÇÃO";

    if (!agrupado[peca]) {
      agrupado[peca] = {
        quantidade: 0,

        chamados: [],
      };
    }

    agrupado[peca].quantidade++;

    const chamado = limparTexto(item.chamadoFilho) || "S/N";

    agrupado[peca].chamados.push(chamado);
  });

  /**
   * ==========================================================
   * ORDENAÇÃO
   * ==========================================================
   */

  const dados = Object.keys(agrupado)
    .sort()
    .map((peca) => {
      return {
        peca,

        quantidade: agrupado[peca].quantidade,

        chamados: agrupado[peca].chamados.join("; "),
      };
    });

  const data = new Date().toLocaleDateString("pt-BR");

  /**
   * ==========================================================
   * ABRE JANELA
   * ==========================================================
   */

  const janela = window.open("", "_blank");

  if (!janela) {
    alert("O navegador bloqueou a janela. Permita pop-ups para continuar.");

    return;
  }

  janela.document.write(`

<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<title>
Retorno de Componentes
</title>


<style>

body {

  font-family: Arial, sans-serif;

  padding: 30px;

}


h1 {

  text-align: center;

  font-size: 20px;

}


.info {

  margin-bottom: 20px;

}


table {

  width: 100%;

  border-collapse: collapse;

}


th {

  background: #eee;

}


td,
th {

  border: 1px solid #999;

  padding: 8px;

  font-size: 12px;

}


.numero {

  text-align: center;

  width: 80px;

}

</style>

</head>


<body>


<h1>
RETORNO DE COMPONENTES PARA MANUTENÇÃO
</h1>


<div class="info">

<b>Laboratório:</b>
TODOS

<br>

<b>Data:</b>
${data}

</div>


<table>

<thead>

<tr>

<th>
QUANTIDADE
</th>

<th>
NOME DA PEÇA
</th>

<th>
CHAMADOS
</th>

</tr>

</thead>


<tbody>

${dados
  .map(
    (item) => `

<tr>

<td class="numero">
${item.quantidade}
</td>

<td>
${escapeHtml(item.peca)}
</td>

<td>
${escapeHtml(item.chamados)}
</td>

</tr>

`,
  )
  .join("")}

</tbody>

</table>


<script>

window.addEventListener(
  "load",
  function() {

    setTimeout(
      function() {

        window.print();

      },
      500
    );

  }
);

</script>


</body>

</html>

  `);

  janela.document.close();
}

/* ============================================================
   CONTROLE DOS BOTÕES
   ============================================================ */

/**
 * Mostra ou esconde o botão:
 *
 * #btnPdfEtiquetas
 *
 * REGRA:
 *
 * PENDENTE
 *     → NÃO mostra
 *
 * SEPARADO PARA ENVIO
 *     → mostra
 *
 * FINALIZADO
 *     → NÃO mostra
 *
 * ============================================================
 */

function atualizarBotoesRetorno() {

  const botaoEtiquetas =
    document.getElementById(
      "btnPdfEtiquetas"
    );


  if (!botaoEtiquetas) {

    return;

  }


  /**
   * ==========================================================
   * BUSCA CHECKBOXES SELECIONADOS
   * ==========================================================
   */

  const selecionados =
    document.querySelectorAll(
      ".checkRetorno:checked"
    );


  /**
   * ==========================================================
   * NENHUM SELECIONADO
   * ==========================================================
   */

  if (
    selecionados.length === 0
  ) {

    botaoEtiquetas.style.display =
      "none";

    return;

  }


  /**
   * ==========================================================
   * DASHBOARD STORE
   * ==========================================================
   */

  const retornos =
    DashboardStore.get(
      "retornos"
    ) || [];


  /**
   * ==========================================================
   * VERIFICA SE EXISTE PELO MENOS UM
   * SEPARADO PARA ENVIO
   * ==========================================================
   */

  let existeElegivel =
    false;


  selecionados.forEach(
    (checkbox) => {

      /**
       * ------------------------------------------------------
       * LINHA DO RETORNO
       * ------------------------------------------------------
       */

      const linha =
        Number(
          checkbox.dataset.linha
        );


      /**
       * ------------------------------------------------------
       * LOCALIZA ITEM NO STORE
       * ------------------------------------------------------
       */

      const item =
        retornos.find(
          (retorno) =>
            Number(
              retorno.linha
            ) === linha
        );


      if (!item) {

        return;

      }


      /**
       * ------------------------------------------------------
       * NORMALIZA STATUS
       * ------------------------------------------------------
       */

      const status =
        String(
          item.status ?? ""
        )
          .trim()
          .toUpperCase()
          .normalize("NFD")
          .replace(
            /[\u0300-\u036f]/g,
            ""
          );


      /**
       * ------------------------------------------------------
       * SOMENTE SEPARADO PARA ENVIO
       * ------------------------------------------------------
       */

      if (
        status ===
        "SEPARADO PARA ENVIO"
      ) {

        existeElegivel =
          true;

      }

    }
  );


  /**
   * ==========================================================
   * ATUALIZA BOTÃO
   * ==========================================================
   */

  if (
    existeElegivel
  ) {

    botaoEtiquetas.style.display =
      "inline-flex";

  } else {

    botaoEtiquetas.style.display =
      "none";

  }

}

/* ============================================================
   EVENTO DE SELEÇÃO
   ============================================================ */

/**
 * Usa delegação de eventos.
 *
 * Isso é importante porque os checkboxes de Retornos são
 * renderizados dinamicamente pelo projeto.
 *
 * Portanto não dependemos de:
 *
 * document.querySelectorAll(".checkRetorno")
 *
 * no momento em que o JS é carregado.
 */

function inicializarEventosEtiquetas() {
  document.addEventListener("change", function (event) {
    /**
     * Verifica se o elemento alterado é um checkbox
     * de retorno.
     */

    if (
      event.target &&
      event.target.classList &&
      event.target.classList.contains("checkRetorno")
    ) {
      atualizarBotoesRetorno();
    }
  });

  /**
   * Atualiza imediatamente.
   *
   * Isso cobre o caso em que a página já possui
   * checkboxes marcados quando o evento é inicializado.
   */

  atualizarBotoesRetorno();
}

/* ============================================================
   GERAR ETIQUETAS SELECIONADAS
   ============================================================ */

/**
 * ============================================================
 * NOVO LAYOUT
 * ============================================================
 *
 * A4:
 *
 * 210mm × 297mm
 *
 * Margem superior:
 *
 * 10mm
 *
 * Margem lateral:
 *
 * 5mm
 *
 * Área horizontal:
 *
 * 200mm
 *
 * Frente:
 *
 * 100mm
 *
 * Verso:
 *
 * 100mm
 *
 * ============================================================
 *
 * RESULTADO:
 *
 * FRENTE 01 | VERSO 01
 *
 * FRENTE 02 | VERSO 02
 *
 * FRENTE 03 | VERSO 03
 *
 * FRENTE 04 | VERSO 04
 *
 * FRENTE 05 | VERSO 05
 *
 * ============================================================
 */

function gerarEtiquetasSelecionadas() {
  /**
   * ==========================================================
   * 1. BUSCAR SELECIONADOS
   * ==========================================================
   */

  const selecionados = document.querySelectorAll(".checkRetorno:checked");

  if (selecionados.length === 0) {
    alert("Selecione pelo menos um retorno para gerar as etiquetas.");

    return;
  }

  /**
   * ==========================================================
   * 2. IDENTIFICAR LINHAS
   * ==========================================================
   */

  const linhasSelecionadas = Array.from(selecionados)
    .map((item) => Number(item.dataset.linha))
    .filter((linha) => !isNaN(linha));

  if (linhasSelecionadas.length === 0) {
    alert("Não foi possível identificar os retornos selecionados.");

    return;
  }

  /**
   * ==========================================================
   * 3. DASHBOARD STORE
   * ==========================================================
   */

  const retornos = DashboardStore.get("retornos") || [];

  /**
   * ==========================================================
   * 4. FILTRAR
   * ==========================================================
   */

  const lista = retornos.filter((item) =>
    linhasSelecionadas.includes(Number(item.linha)),
  );

  if (lista.length === 0) {
    alert("Nenhum retorno encontrado.");

    return;
  }

  /**
   * ==========================================================
   * 5. ORDENAR
   * ==========================================================
   */

  lista.sort((a, b) => Number(a.linha) - Number(b.linha));

  /**
   * ==========================================================
   * 6. CONFIGURAÇÃO
   * ==========================================================
   */

  const ETIQUETAS_POR_PAGINA = 5;

  const paginas = [];

  /**
   * ==========================================================
   * 7. CRIAR PÁGINAS
   * ==========================================================
   */

  for (let i = 0; i < lista.length; i += ETIQUETAS_POR_PAGINA) {
    const grupo = lista.slice(i, i + ETIQUETAS_POR_PAGINA);

    let etiquetas = "";

    /**
     * ========================================================
     * 8. CRIAR 5 LINHAS
     * ========================================================
     */

    for (let linha = 0; linha < ETIQUETAS_POR_PAGINA; linha++) {
      const item = grupo[linha];

      /**
       * ------------------------------------------------------
       * LINHA VAZIA
       * ------------------------------------------------------
       */

      if (!item) {
        etiquetas += `

          <div class="linha-etiqueta">

            <div class="etiqueta etiqueta-vazia"></div>

            <div class="etiqueta etiqueta-vazia"></div>

          </div>

        `;

        continue;
      }

      /**
       * ------------------------------------------------------
       * FRENTE
       * ------------------------------------------------------
       */

      const frente = gerarEtiquetaFrente(item);

      /**
       * ------------------------------------------------------
       * VERSO
       * ------------------------------------------------------
       */

      const verso = `

        <div class="etiqueta etiqueta-verso">

          <img
            class="template-etiqueta"
            src="./assets/etiquetas/etiqueta_verso.png"
            alt=""
          >

        </div>

      `;

      /**
       * ------------------------------------------------------
       * PAR FRENTE + VERSO
       * ------------------------------------------------------
       */

      etiquetas += `

        <div class="linha-etiqueta">

          ${frente}

          ${verso}

        </div>

      `;
    }

    /**
     * ========================================================
     * 9. ADICIONA PÁGINA
     * ========================================================
     */

    paginas.push(`

      <section class="pagina-a4">

        ${etiquetas}

      </section>

    `);
  }

  /**
   * ==========================================================
   * 10. ABRIR JANELA
   * ==========================================================
   */

  const janela = window.open("", "_blank");

  if (!janela) {
    alert(
      "O navegador bloqueou a janela de impressão. Permita pop-ups para este site.",
    );

    return;
  }

  /**
   * ==========================================================
   * 11. DOCUMENTO
   * ==========================================================
   */

  janela.document.open();

  janela.document.write(`

<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<title>
Etiquetas Urbana-PE
</title>


<style>

/* ============================================================
   A4
   ============================================================ */

@page {

  size: A4 portrait;

  margin: 0;

}


/* ============================================================
   RESET
   ============================================================ */

* {

  box-sizing: border-box;

}


html,
body {

  width: 210mm;

  margin: 0;

  padding: 0;

  background: #ffffff;

}


/* ============================================================
   PÁGINA
   ============================================================ */

.pagina-a4 {

  width: 210mm;

  height: 297mm;

  position: relative;

  display: flex;

  flex-direction: column;

  align-items: flex-start;

  padding-top: 10mm;

  padding-left: 5mm;

  padding-right: 5mm;

  overflow: hidden;

  page-break-after: always;

}


/* ============================================================
   ÚLTIMA PÁGINA
   ============================================================ */

.pagina-a4:last-child {

  page-break-after: auto;

}


/* ============================================================
   LINHA FRENTE + VERSO
   ============================================================ */

.linha-etiqueta {

  width: 200mm;

  height: 50mm;

  display: flex;

  flex-direction: row;

  align-items: flex-start;

  gap: 0;

  margin: 0;

  padding: 0;

}


/* ============================================================
   ESPAÇAMENTO VERTICAL
   ============================================================ */

.linha-etiqueta:not(:last-child) {

  margin-bottom: 7mm;

}


/* ============================================================
   ETIQUETA
   ============================================================ */

.etiqueta {

  width: 100mm;

  height: 50mm;

  min-width: 100mm;

  max-width: 100mm;

  position: relative;

  flex: 0 0 100mm;

  overflow: hidden;

  margin: 0;

  padding: 0;

  background: #ffffff;

}


/* ============================================================
   TEMPLATE PNG
   ============================================================ */

.template-etiqueta {

  position: absolute;

  left: 0;

  top: 0;

  width: 100mm;

  height: 50mm;

  display: block;

  margin: 0;

  padding: 0;

  z-index: 1;

  object-fit: fill;

}


/* ============================================================
   CAMPOS
   ============================================================ */

.dado {

  position: absolute;

  z-index: 2;

  font-family: Arial, sans-serif;

  font-size: 7px;

  line-height: 1.05;

  color: #000000;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;

}


/* ============================================================
   ETIQUETA VAZIA
   ============================================================ */

.etiqueta-vazia {

  background: transparent;

}


/* ============================================================
   IMPRESSÃO
   ============================================================ */

@media print {

  html,
  body {

    width: 210mm;

    margin: 0;

    padding: 0;

    background: #ffffff;

    -webkit-print-color-adjust: exact;

    print-color-adjust: exact;

  }


  .pagina-a4 {

    width: 210mm;

    height: 297mm;

    margin: 0;

    padding-top: 10mm;

    padding-left: 5mm;

    padding-right: 5mm;

    overflow: hidden;

    page-break-after: always;

    break-after: page;

  }


  .pagina-a4:last-child {

    page-break-after: auto;

    break-after: auto;

  }


  .template-etiqueta {

    -webkit-print-color-adjust: exact;

    print-color-adjust: exact;

  }

}

</style>

</head>


<body>


${paginas.join("")}


<script>

window.addEventListener(
  "load",
  function() {

    setTimeout(
      function() {

        window.print();

      },
      700
    );

  }
);

</script>


</body>

</html>

  `);

  janela.document.close();
}

/* ============================================================
   GERA ETIQUETA DE FRENTE
   ============================================================ */

function gerarEtiquetaFrente(item) {
  /**
   * ==========================================================
   * PEÇA
   * ==========================================================
   *
   * Exemplo:
   *
   * 31615 - PIN PAD GERTEC PPC 930 USB
   *
   * Código:
   * 31615
   *
   * Nome:
   * PIN PAD GERTEC PPC 930 USB
   * ==========================================================
   */

  const pecaCompleta = limparTexto(item.peca);

  let codigoPeca = "";

  let nomePeca = pecaCompleta;

  const separador = pecaCompleta.indexOf(" - ");

  if (separador !== -1) {
    codigoPeca = pecaCompleta.substring(0, separador).trim();

    nomePeca = pecaCompleta.substring(separador + 3).trim();
  }

  /**
   * ==========================================================
   * CHAMADOS
   * ==========================================================
   *
   * Regra:
   *
   * 1. Se existir chamado laboratório válido:
   *
   *    usa chamadoFilho
   *
   * 2. Se chamado laboratório estiver:
   *
   *    S/N
   *    vazio
   *    nulo
   *    undefined
   *
   *    usa chamado principal.
   *
   * ==========================================================
   *
   * A etiqueta NÃO poderá ficar sem numeração.
   * ==========================================================
   */

  const chamadoLaboratorio = limparTexto(item.chamadoFilho);

  const chamadoPrincipal = limparTexto(item.chamadoPai);

  let chamadoEtiqueta = chamadoLaboratorio;

  /**
   * ----------------------------------------------------------
   * CHAMADO LABORATÓRIO INVÁLIDO
   * ----------------------------------------------------------
   */

  const laboratorioSemNumero =
    !chamadoLaboratorio || chamadoLaboratorio.toUpperCase() === "S/N";

  /**
   * ----------------------------------------------------------
   * SE ESTIVER S/N, USA O CHAMADO PRINCIPAL
   * ----------------------------------------------------------
   */

  if (laboratorioSemNumero) {
    chamadoEtiqueta = chamadoPrincipal;
  }

  /**
   * ----------------------------------------------------------
   * ÚLTIMA PROTEÇÃO
   * ----------------------------------------------------------
   *
   * Caso, excepcionalmente, os dois estejam vazios,
   * não deixa undefined/null aparecer na etiqueta.
   *
   * Nesse caso será utilizado S/N como último recurso.
   */

  if (!chamadoEtiqueta) {
    chamadoEtiqueta = "S/N";
  }

  /**
   * ==========================================================
   * DATA
   * ==========================================================
   */

  const data = formatarDataEtiqueta(item.data);

  /**
   * ==========================================================
   * QUANTIDADE
   * ==========================================================
   */

  const quantidade = "1";

  /**
   * ==========================================================
   * CLIENTE
   * ==========================================================
   */

  const cliente = "URBANA-PE";

  /**
   * ==========================================================
   * MOTIVO DA TROCA
   * ==========================================================
   *
   * Por enquanto permanece vazio.
   *
   * Futuramente poderá utilizar:
   *
   * const motivoTroca =
   *   limparTexto(item.motivoTroca);
   *
   * ==========================================================
   */

  const motivoTroca = "";

  /**
   * ==========================================================
   * HTML DA ETIQUETA
   * ==========================================================
   */

  return `

    <div class="etiqueta etiqueta-frente">


      <!-- =====================================================
           TEMPLATE PNG
           ===================================================== -->

      <img
        class="template-etiqueta"
        src="./assets/etiquetas/etiqueta_frente.png"
        alt=""
      >


      <!-- =====================================================
           NOME DA PEÇA
           ===================================================== -->

      <div
        class="dado"
        style="
          left: 38mm;
          top: 3.5mm;
          width: 53mm;
          height: 5mm;
        "
      >
        ${escapeHtml(nomePeca)}
      </div>


      <!-- =====================================================
           DESCRIÇÃO / MOTIVO DA TROCA
           ===================================================== -->

      <div
        class="dado"
        style="
          left: 38mm;
          top: 13.5mm;
          width: 53mm;
          height: 5mm;
        "
      >
        ${escapeHtml(motivoTroca)}
      </div>


      <!-- =====================================================
           OS Nº
           ===================================================== -->

      <div
        class="dado"
        style="
          left: 37mm;
          top: 22.8mm;
          width: 19mm;
          height: 4mm;
        "
      >
        ${escapeHtml(chamadoEtiqueta)}
      </div>


      <!-- =====================================================
           DATA
           ===================================================== -->

      <div
        class="dado"
        style="
          left: 60mm;
          top: 22.8mm;
          width: 22mm;
          height: 4mm;
        "
      >
        ${escapeHtml(data)}
      </div>


      <!-- =====================================================
           QUANTIDADE
           ===================================================== -->

      <div
        class="dado"
        style="
          left: 80mm;
          top: 22.8mm;
          width: 12mm;
          height: 4mm;
          text-align: center;
        "
      >
        ${escapeHtml(quantidade)}
      </div>


      <!-- =====================================================
           SÉRIE
           ===================================================== -->

      <div
        class="dado"
        style="
          left: 43mm;
          top: 31.8mm;
          width: 52mm;
          height: 4mm;
        "
      >
        ${escapeHtml(codigoPeca)}
      </div>


      <!-- =====================================================
           CLIENTE
           ===================================================== -->

      <div
        class="dado"
        style="
          left: 44mm;
          top: 41mm;
          width: 52mm;
          height: 4mm;
        "
      >
        ${escapeHtml(cliente)}
      </div>


    </div>

  `;
}

/* ============================================================
   LIMPAR TEXTO
   ============================================================ */

function limparTexto(valor) {
  if (valor === null || valor === undefined) {
    return "";
  }

  return String(valor).trim();
}

/* ============================================================
   FORMATAR DATA
   ============================================================ */

function formatarDataEtiqueta(valor) {
  if (!valor) {
    return "";
  }

  const data = new Date(valor);

  if (isNaN(data.getTime())) {
    return "";
  }

  return data.toLocaleDateString("pt-BR", {
    timeZone: "America/Recife",
  });
}

/* ============================================================
   ESCAPAR HTML
   ============================================================ */

function escapeHtml(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

/**
 * ============================================================
 * IMPORTANTE
 * ============================================================
 *
 * O botão #btnPdfEtiquetas começa com:
 *
 * style="display: none"
 *
 * no HTML.
 *
 * Portanto precisamos controlar sua visibilidade quando os
 * checkboxes forem selecionados.
 *
 * Usamos delegação de eventos porque os checkboxes são
 * renderizados dinamicamente.
 * ============================================================
 */

function iniciarModuloRetornoPdf() {
  /**
   * ----------------------------------------------------------
   * EVITA DUPLICAR O EVENTO
   * ----------------------------------------------------------
   */

  if (window._retornoPdfInicializado) {
    return;
  }

  window._retornoPdfInicializado = true;

  /**
   * ==========================================================
   * EVENTO CHANGE
   * ==========================================================
   */

  document.addEventListener("change", function (event) {
    if (
      event.target &&
      event.target.classList &&
      event.target.classList.contains("checkRetorno")
    ) {
      atualizarBotoesRetorno();
    }
  });

  /**
   * ==========================================================
   * BOTÃO PDF
   * ==========================================================
   */

  const botaoPdf = document.getElementById("btnPdfRetorno");

  if (botaoPdf) {
    /**
     * Evita duplicação.
     */

    if (!botaoPdf.dataset.retornoPdfEvento) {
      botaoPdf.addEventListener("click", imprimirRetornosSelecionados);

      botaoPdf.dataset.retornoPdfEvento = "true";
    }
  }

  /**
   * ==========================================================
   * BOTÃO ETIQUETAS
   * ==========================================================
   */

  const botaoEtiquetas = document.getElementById("btnPdfEtiquetas");

  if (botaoEtiquetas) {
    /**
     * Evita duplicação.
     */

    if (!botaoEtiquetas.dataset.retornoEtiquetaEvento) {
      botaoEtiquetas.addEventListener("click", gerarEtiquetasSelecionadas);

      botaoEtiquetas.dataset.retornoEtiquetaEvento = "true";
    }
  }

  /**
   * ==========================================================
   * ESTADO INICIAL
   * ==========================================================
   */

  atualizarBotoesRetorno();
}

/* ============================================================
   INICIALIZAÇÃO SEGURA
   ============================================================ */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarModuloRetornoPdf);
} else {
  iniciarModuloRetornoPdf();
}
