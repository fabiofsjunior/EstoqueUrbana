function obterDataRegistro(valor){


    if(!valor){
        return null;
    }


    // Formato do CACHE:
    // 05/08/2026 - 14:12

    if(
        typeof valor === "string" &&
        valor.includes("/")
    ){

        const partes =
            valor.split(" ")[0]
                .split("/");


        return new Date(
            partes[2],
            partes[1] - 1,
            partes[0]
        );

    }


    // Formato ISO antigo:
    // 2026-08-05T17:12:00.000Z

    const data =
        new Date(valor);


    if(isNaN(data)){
        return null;
    }


    return data;

}





function renderTabelaMensal({
    dados,
    tbodyId,
    mensagemVazia
}) {


    const tbody =
        document.getElementById(
            tbodyId
        );


    if(!tbody) return;



    tbody.innerHTML = "";



    const hoje =
        new Date();



    const registros =
        dados

        .filter(item => {


            const data =
                obterDataRegistro(
                    item.data
                );


            if(!data){
                return false;
            }


            return (

                data.getMonth() === hoje.getMonth()
                &&
                data.getFullYear() === hoje.getFullYear()

            );


        })


        .sort(
            (a,b)=>{

                return (
                    obterDataRegistro(b.data)
                    -
                    obterDataRegistro(a.data)
                );

            }

        );



    if(registros.length === 0){


        tbody.innerHTML = `

            <tr>

                <td colspan="5" style="text-align:center">

                    ${mensagemVazia}

                </td>

            </tr>

        `;


        return;

    }



    let html = "";



    registros.forEach(item=>{


        html += `

            <tr>

                <td>${item.chamado ?? "-"}</td>

                <td>${item.atm ?? "-"}</td>

                <td>${item.peca ?? "-"}</td>

                <td>${item.destino ?? "-"}</td>

                <td>${item.data ?? "-"}</td>

            </tr>

        `;


    });



    tbody.innerHTML = html;


}