/**
 * Renderização do gráfico de consumo mensal
 *
 * Os dados vêm do DashboardStore.
 * Nenhuma chamada API é feita aqui.
 */


let graficoConsumo = null;



function carregarConsumoMensal() {


    const dados =
        DashboardStore.get("consumo");


    if (!Array.isArray(dados)) {

        console.warn(
            "⚠️ Consumo mensal ainda não carregado"
        );

        return;
    }



    const labels = [];

    const valores = [];



    dados.forEach(item => {


        let mes = item[0];



        if (
            typeof mes === "string" &&
            mes.includes("T")
        ) {


            const data =
                new Date(mes);



            mes =
                String(
                    data.getMonth() + 1
                ).padStart(2, "0")
                +
                "/"
                +
                data.getFullYear();

        }



        labels.push(mes);

        valores.push(item[1]);


    });



    const canvas =
        document.getElementById(
            "graficoConsumo"
        );


    if (!canvas) return;



    if (!graficoConsumo) {


        graficoConsumo =
            new Chart(

                canvas,

                {

                    type: "bar",


                    data: {

                        labels,


                        datasets: [

                            {

                                label:
                                    "Nº de Trocas",

                                data:
                                    valores

                            }

                        ]

                    },


                    options: {

                        responsive: true,

                        maintainAspectRatio: false

                    }

                }

            );


        return;

    }



    graficoConsumo.data.labels =
        labels;



    graficoConsumo.data.datasets[0].data =
        valores;



    graficoConsumo.update();

}