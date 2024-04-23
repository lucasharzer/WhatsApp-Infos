const { format } = require("date-fns");
const ManagePostgreSQL = require("../database/postgresql");


exports.verify_contact = async(
    telefone, nome, status, grupo, idmsg, idcliente, ultproc, tipo
) => {
    let status_primeira = 0;
    console.log("Verificando cliente...")
    const data = format(new Date(), "yyyy/MM/dd HH:mm:ss");

    const postgre = new ManagePostgreSQL();
    await postgre.connect();
    await postgre.createTable();

    // Inserir ou atualizar o contato
    if (await postgre.selectOne(telefone)) {
        await postgre.updateOne(nome, status, grupo, data, idmsg, telefone);
    }else {
        status_primeira = 1;
        await postgre.insertOne(
            nome, telefone, idcliente, status, grupo, data, data, idmsg
        );
    }

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