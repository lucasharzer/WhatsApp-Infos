exports.format_value = (valor) => {
    // Valor no formato brasileiro
    return parseFloat(valor).toLocaleString(
        "pt-BR", { style: "currency", currency: "BRL" }
    );
}