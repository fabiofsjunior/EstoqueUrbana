function abrirJanelaImpressao({
    titulo,
    subtitulo = "",
    colunas = [],
    linhas = []
}) {

    const janela = window.open("", "_blank");

    if (!janela) {
        alert("O navegador bloqueou a janela de impressão.");
        return;
    }

    const cabecalho = colunas
        .map(col => `<th>${col}</th>`)
        .join("");

    const corpo = linhas
        .map(linha => `
            <tr>
                ${linha.map(col => `<td>${col}</td>`).join("")}
            </tr>
        `)
        .join("");

    janela.document.write(`

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>${titulo}</title>

<style>

body{

    font-family:Arial,sans-serif;

    padding:30px;

}

h2{

    text-align:center;

    margin-bottom:10px;

}

p{

    margin-bottom:20px;

    color:#555;

}

table{

    width:100%;

    border-collapse:collapse;

}

th{

    background:#005bbb;

    color:white;

}

th,td{

    border:1px solid #ccc;

    padding:8px;

    text-align:left;

}

</style>

</head>

<body>

<h2>${titulo}</h2>

<p>${subtitulo}</p>

<table>

<thead>

<tr>

${cabecalho}

</tr>

</thead>

<tbody>

${corpo}

</tbody>

</table>

</body>

</html>

`);

    janela.document.close();

    janela.focus();

    setTimeout(() => {

        janela.print();

        janela.close();

    },500);

}