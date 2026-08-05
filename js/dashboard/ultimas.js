/**
 * Renderização das últimas movimentações
 *
 * Os dados vêm do DashboardStore.
 * Nenhuma chamada API é feita aqui.
 */


async function carregarUltimas() {


    const dados =
        DashboardStore.get("ultimas");



    if (!Array.isArray(dados)) {

        console.warn(
            "⚠️ Últimas movimentações ainda não carregadas"
        );

        return;

    }



    const tbody =
        document.getElementById(
            "ultimasMov"
        );



    if (!tbody) return;



    let html = "";



    dados.forEach(item => {


        html += `

            <tr>

                <td>
                    ${item[0] ?? "-"}
                </td>

                <td>
                    ${item[1] ?? "-"}
                </td>

                <td>
                    ${item[2] ?? "-"}
                </td>

                <td>
                    ${item[3] ?? "-"}
                </td>

            </tr>

        `;


    });



    tbody.innerHTML = html;


}