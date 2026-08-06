/**
 * ============================================================
 * PDF RETORNOS CONSOLIDADO
 * ============================================================
 *
 * Agrupa:
 *
 * PEÇA
 * QUANTIDADE
 * CHAMADOS LABORATÓRIO
 *
 * Dados:
 * DashboardStore
 *
 * ============================================================
 */

function imprimirRetornosSelecionados() {
  const selecionados = document.querySelectorAll(".checkRetorno:checked");

  if (selecionados.length === 0) {
    alert("Selecione pelo menos um retorno.");

    return;
  }

  const linhasSelecionadas = Array.from(selecionados).map((item) =>
    Number(item.dataset.linha),
  );

  const retornos = DashboardStore.get("retornos");

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
    const peca = item.peca || "SEM IDENTIFICAÇÃO";

    if (!agrupado[peca]) {
      agrupado[peca] = {
        quantidade: 0,

        chamados: [],
      };
    }

    agrupado[peca].quantidade++;

    const chamado =
      item.chamadoFilho && item.chamadoFilho.trim() !== ""
        ? item.chamadoFilho
        : "S/N";

    agrupado[peca].chamados.push(chamado);
  });

  /**
   * ==========================================================
   * ORDENAÇÃO POR NOME DA PEÇA
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

  const janela = window.open("", "_blank");

  janela.document.write(`


<html>


<head>


<title>
Retorno de Componentes
</title>



<style>


body{

font-family:Arial;

padding:30px;

}



h1{

text-align:center;

font-size:20px;

}



.info{

margin-bottom:20px;

}



table{

width:100%;

border-collapse:collapse;

}



th{

background:#eee;

}



td,
th{

border:1px solid #999;

padding:8px;

font-size:12px;

}



.numero{

text-align:center;

width:80px;

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

${item.peca}

</td>



<td>

${item.chamados}

</td>



</tr>


`,
  )
  .join("")}



</tbody>



</table>



<script>

window.print();

</script>



</body>


</html>



`);

  janela.document.close();
}

/**
 * ============================================================
 * EVENTO BOTÃO PDF
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("btnPdfRetorno");

  if (botao) {
    botao.addEventListener("click", imprimirRetornosSelecionados);
  }
});
