const ManagePostgreSQL = require("../../database/postgresql");
const ManageDate = require("../validation/date");


exports.verify_contact = async(
    telefone, nome, status, grupo, idmsg, idcliente, ultcons, tipo
) => {
    // Iniciar serviços de data e banco PostgreSQL
    let status_primeira = 0;
    console.log("Verificando cliente...")
    const manageDate = new ManageDate();
    const data = manageDate.generateDate();

    const postgre = new ManagePostgreSQL();
    await postgre.connect();
    await postgre.createTable();

    // Inserir ou atualizar o contato
    status_primeira = await postgre.saveRegister(
        nome, telefone, idcliente, status, grupo, data, data, idmsg
    );

    // Atualizar último processo solicitado
    let lastQuery;
    if (ultcons.length != 0 && ultcons.split("/")[0].replace(/[-.]/g, "").slice(13, 16) == "826") {
        if (tipo == 5) {
            ultcons = ultcons.replace(/\/.*/, "");
        }
        await postgre.updateLastQuery(ultcons, telefone);
    }

    if ((ultcons.length != 0 && ultcons.split("/")[0].replace(/[-.]/g, "").slice(13, 16) != "826" && [1, 5].includes(tipo)) || (ultcons.length != 0 && [11, 14].includes(ultcons.toString().replace(/[-.\/]/g, "").length) && tipo == 2)) {
        lastQuery = ultcons; 
    }else {
        lastQuery = await postgre.selectQuery(telefone);
    }

    await postgre.close();

    return { lastQuery, status_primeira };
}