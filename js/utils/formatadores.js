function formatarDataAtualizacao(data){

    if(!data){
        return "-";
    }

    const dataObj = new Date(data);

    return dataObj.toLocaleTimeString(
        "pt-BR",
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}