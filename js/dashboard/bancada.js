/**
 * Renderização dos reparos em bancada
 *
 * Os dados vêm do DashboardStore.
 * Nenhuma chamada API é feita aqui.
 */


async function carregarBancada(){


    const dados =
        DashboardStore.get("bancada");



    if(!Array.isArray(dados)){

        console.warn(
            "⚠️ Dados de bancada ainda não carregados"
        );

        return;

    }



    renderTabelaMensal({

        dados,

        tbodyId:"bancada-body",

        mensagemVazia:
            "Nenhum reparo encontrado neste mês."

    });


}
//// BOtão imprimir
document.addEventListener("DOMContentLoaded", () => {

    const btnPdfBancada =
        document.getElementById("btnPdfBancada");

    if (btnPdfBancada) {
        btnPdfBancada.addEventListener("click", imprimirBancada);
    }

});



function imprimirBancada(){


    const linhas = [];



    document
        .querySelectorAll("#bancada-body tr")
        .forEach(tr=>{


            const td =
                tr.querySelectorAll("td");



            if(td.length===5){


                linhas.push([

                    td[0].innerText,

                    td[1].innerText,

                    td[2].innerText,

                    td[3].innerText,

                    td[4].innerText

                ]);


            }


        });



    abrirJanelaImpressao({

        titulo:
            "Relatório de Bancada",


        subtitulo:
            new Date()
            .toLocaleString("pt-BR"),


        colunas:[

            "Chamado",

            "ATM",

            "Peça",

            "Destino",

            "Data"

        ],


        linhas


    });


}