/**
 * ============================================================
 * PDF REPOSIÇÃO
 * ============================================================
 *
 * Recebe lista já conferida pela modal
 *
 * ============================================================
 */

function imprimirReposicao() {
  const selecionados = [
    ...document.querySelectorAll(".checkReposicao:checked"),
  ];

  if (selecionados.length === 0) {
    alert("Selecione ao menos uma peça.");

    return;
  }

  const lista = selecionados.map((check) => {
    return {
      codigo: check.dataset.codigo,

      descricao: check.dataset.descricao,

      saldo: Number(check.dataset.saldo),
    };
  });

  abrirModalReposicao(lista);
}

/**
 * GERA PDF FINAL
 */

function gerarPdfReposicao(lista) {
  const janela = window.open("", "_blank");

  let linhas = "";

  lista.forEach((item) => {
    linhas += `


        <tr>

            <td>
                ${item.codigo}
            </td>


            <td>
                ${item.descricao}
            </td>


            <td>
                ${item.saldo}
            </td>


            <td>
                ${item.quantidadeSolicitada}
            </td>


        </tr>


        `;
  });

  janela.document.write(`


<html>

<head>


<title>
Reposição de Estoque
</title>



<style>


body{

font-family:Arial;

padding:30px;

}


h2{

text-align:center;

}



table{

width:100%;

border-collapse:collapse;

}



th,td{

border:1px solid #ccc;

padding:8px;

}



th{

background:#eee;

}


</style>


</head>


<body>



<h2>

ESTOQUE CRÍTICO E REPOSIÇÃO DE PEÇAS

</h2>



<p>

Data:
${new Date().toLocaleDateString("pt-BR")}

</p>



<table>


<thead>


<tr>

<th>Código</th>

<th>Peça</th>

<th>Saldo Atual</th>

<th>Quantidade Solicitada</th>


</tr>


</thead>



<tbody>


${linhas}


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
 * BOTÃO PDF
 */

document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("btnPdfReposicao");

  if (botao) {
    botao.onclick = imprimirReposicao;
  }
});
