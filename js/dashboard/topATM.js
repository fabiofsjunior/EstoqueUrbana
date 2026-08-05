/**
 * Renderização Top ATM
 *
 * Os dados vêm do DashboardStore.
 * Nenhuma chamada API é feita aqui.
 */


function carregarTopATM() {

    const dados = DashboardStore.get("topATM");


    if (!Array.isArray(dados)) {

        console.warn(
            "⚠️ Top ATM ainda não carregado"
        );

        return;
    }


    const tabela =
        document.getElementById("topATM");


    if (!tabela) return;


    tabela.innerHTML = "";


    let html = "";


    dados.forEach(item => {

        html += `
            <tr>
                <td>${item[0]}</td>
                <td>${item[1]}</td>
            </tr>
        `;

    });


    tabela.innerHTML = html;

}



/**
 * Renderização Top Peças
 *
 * Os dados vêm do DashboardStore.
 * Nenhuma chamada API é feita aqui.
 */


function carregarTopPecas() {


    const dados = DashboardStore.get("topPecas");


    if (!Array.isArray(dados)) {

        console.warn(
            "⚠️ Top Peças ainda não carregado"
        );

        return;
    }


    const tabela =
        document.getElementById("topPecas");


    if (!tabela) return;


    tabela.innerHTML = "";


    let html = "";


    dados.forEach(item => {

        html += `
            <tr>
                <td>${item[0]}</td>
                <td>${item[1]}</td>
            </tr>
        `;

    });


    tabela.innerHTML = html;

}