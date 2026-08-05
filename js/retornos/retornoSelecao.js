let retornosSelecionados = [];


/**
 * Inicializa seleção dos retornos
 */
function iniciarSelecaoRetorno(){


    const tbody =
        document.getElementById(
            "retorno-body"
        );


    if(!tbody) return;



    tbody.addEventListener(
        "change",
        function(e){


            if(
                !e.target.classList.contains(
                    "checkRetorno"
                )
            ){
                return;
            }



            atualizarSelecaoRetorno();


        }
    );



    const btnTodos =
        document.getElementById(
            "btnSelecionarTodosRetorno"
        );



    if(btnTodos){

        btnTodos.addEventListener(
            "click",
            selecionarTodosRetornos
        );

    }


}



/**
 * Atualiza lista selecionada
 */
function atualizarSelecaoRetorno(){


    retornosSelecionados =
        Array.from(
            document.querySelectorAll(
                ".checkRetorno:checked"
            )
        )
        .map(check =>
            Number(
                check.dataset.linha
            )
        );



    atualizarBotaoDuplicar();


}




/**
 * Seleciona todos
 */
function selecionarTodosRetornos(){


    const checks =
        document.querySelectorAll(
            ".checkRetorno"
        );



    const todosMarcados =

        Array.from(checks)
        .every(
            c=>c.checked
        );



    checks.forEach(check=>{

        check.checked =
            !todosMarcados;

    });



    atualizarSelecaoRetorno();


}



/**
 * Exibe botão duplicar
 */
function atualizarBotaoDuplicar(){


    const botao =
        document.getElementById(
            "btnDuplicarRetorno"
        );



    if(!botao) return;



    botao.style.display =

        retornosSelecionados.length > 0

        ? "inline-block"

        : "none";


}