const { cpf, cnpj } = require('cpf-cnpj-validator');


exports.validate_document = (documento) => {
    // Validar CPF/CNPJ
    let valido;
    if (documento.length == 11) {
        valido = cpf.isValid(documento);
    }else {
        valido = cnpj.isValid(documento);
    }

    return valido;
}