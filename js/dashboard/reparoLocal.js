/**
 * Renderização de reparos por laboratório
 *
 * Os dados vêm do DashboardStore.
 * Nenhuma chamada API é feita aqui.
 */


async function carregarReparoLocal() {


    const dados =
        DashboardStore.get("reparoLocal");



    if (!Array.isArray(dados)) {

        console.warn(
            "⚠️ Reparo por laboratório ainda não carregado"
        );

        return;

    }



    const tbody =
        document.getElementById(
            "reparoLocal"
        );



    if (!tbody) return;



    let html = "";



    dados.forEach(item => {


        html += `

            <tr>

                <td>
                    ${item.destino ?? "-"}
                </td>

                <td>
                    ${item.quantidade ?? 0}
                </td>

            </tr>

        `;


    });



    tbody.innerHTML = html;


}