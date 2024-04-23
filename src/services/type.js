exports.get_type_query = async(mensagem) => {
    let caso;

    if (/^[0-9]+$/.test(mensagem.toString().replace(/[-.]/g, "").split("/")[0]) && mensagem.toString().replace(/[-.]/g, "").split("/")[0].length == 20) {
        // Processo
        caso = 1;
    }else {
        if (/^[0-9]+$/.test(mensagem) && mensagem.toString().padStart(5, "0").length == 5) {
            // Precatório
            caso = 2;
        }else {
            // Ajuda
            caso = 3;
        }
    }

    return caso;
}