/**
 * Renderização dos motivos das trocas
 *
 * Os dados vêm do DashboardStore.
 * Nenhuma chamada API é feita aqui.
 */


async function carregarMotivos() {


    const dados =
        DashboardStore.get("motivos");


    if (!Array.isArray(dados)) {

        console.warn(
            "⚠️ Motivos ainda não carregados"
        );

        return;

    }



    const tbody =
        document.getElementById(
            "motivos-body"
        );


    if (!tbody) return;



    let html = "";



    dados.forEach(item => {


        html += `

            <tr>

                <td>
                    ${item.motivo ?? "-"}
                </td>

                <td>
                    ${item.quantidade ?? 0}
                </td>

            </tr>

        `;


    });



    tbody.innerHTML = html;


}