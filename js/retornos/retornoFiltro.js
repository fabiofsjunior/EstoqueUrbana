/**
 * ============================================================
 * FILTROS DE RETORNOS
 * ============================================================
 *
 * Responsável por:
 *
 * - Ativar filtros da tela de retornos
 * - Buscar por texto
 * - Filtrar laboratório
 * - Filtrar status
 * - Ordenar prioridade:
 *
 * 1º PENDENTE
 * 2º SEPARADO PARA ENVIO
 * 3º FINALIZADO
 *
 * ============================================================
 */


/**
 * ============================================================
 * INICIALIZA FILTROS
 * ============================================================
 */

function iniciarFiltrosRetorno(){


    const busca =
        document.getElementById(
            "filtroRetorno"
        );


    const laboratorio =
        document.getElementById(
            "filtroLaboratorio"
        );


    const status =
        document.getElementById(
            "filtroStatus"
        );



    if(busca){

        busca.addEventListener(
            "input",
            aplicarFiltroRetorno
        );

    }



    if(laboratorio){

        laboratorio.addEventListener(
            "change",
            aplicarFiltroRetorno
        );

    }



    if(status){

        status.addEventListener(
            "change",
            aplicarFiltroRetorno
        );

    }



    console.log(
        "✅ Filtros de retorno inicializados"
    );


}




/**
 * ============================================================
 * APLICA FILTROS
 * ============================================================
 */

function aplicarFiltroRetorno(){



    const dados =
        DashboardStore.get(
            "retornos"
        );



    if(!Array.isArray(dados)){


        console.warn(
            "⚠️ Nenhum retorno carregado"
        );


        return;

    }




    const texto =

        document
        .getElementById(
            "filtroRetorno"
        )
        ?.value
        .toLowerCase()
        .trim()

        || "";





    const laboratorio =

        document
        .getElementById(
            "filtroLaboratorio"
        )
        ?.value

        || "";





    const status =

        document
        .getElementById(
            "filtroStatus"
        )
        ?.value

        || "";






    /**
     * PRIORIDADE DA FILA
     */

    const prioridadeStatus = {


        "PENDENTE":1,


        "SEPARADO PARA ENVIO":2,


        "FINALIZADO":3


    };







    const filtrados = dados


        .filter(item=>{


            const textoOK =


                !texto ||

                JSON.stringify(item)

                .toLowerCase()

                .includes(texto);





            const laboratorioOK =


                !laboratorio ||

                item.laboratorio === laboratorio;





            const statusOK =


                !status ||

                item.status === status;





            return (

                textoOK &&

                laboratorioOK &&

                statusOK

            );


        })




        .sort((a,b)=>{



            const prioridadeA =

                prioridadeStatus[
                    a.status
                ]

                ?? 99;



            const prioridadeB =

                prioridadeStatus[
                    b.status
                ]

                ?? 99;



            return prioridadeA - prioridadeB;



        });






    renderTabelaRetornos(
        filtrados
    );



}




/**
 * ============================================================
 * FILTRO MANUAL
 * ============================================================
 *
 * Permite atualizar a tabela
 * após alterações externas.
 *
 * Exemplo:
 *
 * aplicarFiltroRetorno();
 *
 * ============================================================
 */



window.iniciarFiltrosRetorno =
    iniciarFiltrosRetorno;



window.aplicarFiltroRetorno =
    aplicarFiltroRetorno;