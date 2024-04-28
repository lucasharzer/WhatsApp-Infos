const ManagePostgreSQL = require("../../database/postgresql");
const ManageDate = require("../validation/date");


exports.verify_contact = async(
    telefone, nome, status, grupo, idmsg, idcliente, ultproc, tipo
) => {
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
    let lastProcess;
    if (ultproc.length != 0 && ultproc.split("/")[0].replace(/[-.]/g, "").slice(13, 16) == "826") {
        await postgre.updateLastProcess(ultproc, telefone);
    }

    if (ultproc.length != 0 && ultproc.split("/")[0].replace(/[-.]/g, "").slice(13, 16) != "826" && tipo == 1) {
        lastProcess = ultproc;
    }else {
        lastProcess = await postgre.selectProcess(telefone);
    }

    await postgre.close();

    return { lastProcess, status_primeira };
}