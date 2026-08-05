/**
 * Renderização da reposição de peças
 *
 * Os dados vêm do DashboardStore.
 * Nenhuma chamada API é feita aqui.
 */


async function carregarReposicao(){


    const dados =
        DashboardStore.get("reposicao");



    if(!Array.isArray(dados)){


        console.warn(
            "⚠️ Dados de reposição ainda não carregados"
        );


        return;

    }



    renderTabelaReposicao(dados);


}





function renderTabelaReposicao(dados){


    const tbody =
        document.getElementById(
            "reposicao-body"
        );



    if(!tbody) return;



    let html = "";



    if(dados.length === 0){


        tbody.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhuma peça precisa de reposição.

                </td>

            </tr>

        `;


        return;

    }



    dados.forEach(item => {



        html += `

        <tr>


            <td>

                <input 
                    type="checkbox"
                    class="checkReposicao"
                    data-codigo="${item.codigo ?? ""}"
                >

            </td>


            <td>
                ${item.codigo ?? "-"}
            </td>


            <td>
                ${item.descricao ?? "-"}
            </td>


            <td>
                ${item.saldo ?? 0}
            </td>


            <td>
                ${item.status ?? "-"}
            </td>


        </tr>

        `;



    });



    tbody.innerHTML = html;


}