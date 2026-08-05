function el(id) {
    return document.getElementById(id);
}

function setText(id, texto) {

    const elemento = el(id);

    if (!elemento) return;

    elemento.innerText = texto;

}

function setHTML(id, html) {

    const elemento = el(id);

    if (!elemento) return;

    elemento.innerHTML = html;

}

function limpar(id){

    setHTML(id,"");

}