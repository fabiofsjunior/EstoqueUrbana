/**
 * Renderização dos indicadores principais
 *
 * Os dados vêm do DashboardStore.
 * Nenhuma chamada API é feita aqui.
 */


async function carregarIndicadores(){

    const dados = DashboardStore.get("indicadores");

    if(!dados){
        console.warn(
            "⚠️ Indicadores ainda não carregados"
        );
        return;
    }



    setText(
        "ultimaAtualizacao",
        "Atualizado às " +
        formatarDataAtualizacao(
            dados.Ultima_Atualizacao
        ) +
        "h"
    );



    setText(
        "totalItens",
        dados.Total_Itens_Estoque ?? 0
    );


    setText(
        "totalPecasMaisTrocadaQtd",
        dados.Peca_Mais_Trocada_QTD ?? 0
    );


    setText(
        "totalPecasMaisTrocadaNome",
        dados.Peca_Mais_Trocada ?? "-"
    );


    setText(
        "trocasMes",
        dados.Trocas_Mes ?? 0
    );


    setText(
        "estoqueCritico",
        dados.Estoque_Critico ?? 0
    );


    setText(
        "vandalismos",
        dados.Vandalismos_Mes ?? 0
    );


    setText(
        "defeitos",
        dados.Defeitos_Mes ?? 0
    );


    setText(
        "bancada",
        dados.Laboratorio_Maior_Volume_QTD ?? 0
    );


    setText(
        "bancadaLocal",
        dados.Laboratorio_Maior_Volume ?? "-"
    );


    setText(
        "atmCriticoQTD",
        dados.ATM_Mais_Problematico_QTD ?? "-"
    );


    setText(
        "atmCritico",
        dados.ATM_Mais_Problematico ?? "-"
    );



    atualizarTrend(
        "trocasTrend",
        dados.Trocas_Variacao
    );


    atualizarTrend(
        "defeitosTrend",
        dados.Defeitos_Variacao
    );


    atualizarTrend(
        "vandalismosTrend",
        dados.Vandalismos_Variacao
    );



    setHTML(
        "totalItensTrend",
        "Estoque Atual"
    );


    setHTML(
        "totalPecasTrend",
        "Peça mais trocada"
    );


    setHTML(
        "estoqueTrend",
        `${dados.Estoque_Critico} abaixo do mínimo`
    );


    setHTML(
        "bancadaTrend",
        "LAB com maior movimentação"
    );


    setHTML(
        "atmTrend",
        "Maior Nº de chamados"
    );


}



function atualizarTrend(id, valor) {


    const elemento =
        document.getElementById(id);


    if (!elemento) return;



    valor =
        Number(valor) || 0;



    elemento.className = "trend";



    if (valor > 0) {


        elemento.innerHTML =
            `▲ +${valor}%`;


        elemento.classList.add(
            "positivo"
        );


    }

    else if (valor < 0) {


        elemento.innerHTML =
            `▼ ${valor}%`;


        elemento.classList.add(
            "negativo"
        );


    }

    else {


        elemento.innerHTML =
            "— 0%";


        elemento.classList.add(
            "neutro"
        );


    }

}