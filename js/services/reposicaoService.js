async function carregarReposicao(){

    const dados = DashboardStore.reposicao;


    if(!Array.isArray(dados)){

        console.warn(
            "⚠️ Dados de reposição não encontrados"
        );

        return;
    }


    const tbody =
        document.getElementById(
            "reposicao-body"
        );


    if(!tbody) return;


    tbody.innerHTML = "";


    let html = "";


    dados.forEach(item=>{


        html += `

        <tr>

            <td>
                <input 
                    type="checkbox"
                    class="checkReposicao"
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

                ${
                    Number(item.saldo) <= 0

                    ?

                    "🔴 Zerado"

                    :

                    "🟡 Crítico"

                }

            </td>


        </tr>

        `;


    });



    tbody.innerHTML = html;


}