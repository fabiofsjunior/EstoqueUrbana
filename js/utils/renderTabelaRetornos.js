function renderTabelaRetornos(dados){

    const tbody =
        document.getElementById(
            "retorno-body"
        );


    if(!tbody) return;


    tbody.innerHTML="";


    if(dados.length===0){

        tbody.innerHTML=`

        <tr>
            <td colspan="8">
                Nenhum retorno encontrado.
            </td>
        </tr>

        `;

        return;
    }


    let html="";


    dados.forEach(item=>{


        html += `

        <tr>


            <td>
                <input 
                type="checkbox"
                class="checkRetorno"
                data-id="${item.id ?? ''}">
            </td>


            <td>
                ${item.chamadoPrincipal ?? "-"}
            </td>


            <td>
                ${item.chamadoFilho ?? "-"}
            </td>


            <td>
                ${item.peca ?? "-"}
            </td>


            <td>
                ${item.destino ?? "-"}
            </td>


            <td>
                ${item.atm ?? "-"}
            </td>


            <td>
                ${item.status ?? "PENDENTE"}
            </td>


            <td>

                <button 
                class="btn-acao"
                onclick="">
                ⚙️
                </button>

            </td>


        </tr>

        `;


    });


    tbody.innerHTML=html;


}