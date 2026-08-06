/**
 * Renderização dos vandalismos do mês
 *
 * Os dados vêm do DashboardStore.
 * Nenhuma chamada API é feita aqui.
 */


async function carregarVandalismo(){


    const dados =
        DashboardStore.get("vandalismo");



    if(!Array.isArray(dados)){


        console.warn(
            "⚠️ Dados de vandalismo ainda não carregados"
        );


        return;

    }



    renderTabelaMensal({

        dados,

        tbodyId:"vandalismo-body",

        mensagemVazia:
            "Nenhum registro encontrado para este mês."

    });


}




function imprimirVandalismo(){


    const linhas = [];



    document
        .querySelectorAll("#vandalismo-body tr")
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
            "Relatório de Vandalismo",


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