// const venom = require('venom-bot');


// venom
//     .create({
//         session: "session-infos"
//     })
//     .then(async (client) => {
//         // Inicio
//         console.log("Começando os testes...");

//         // Enviar mensagem de texto 
//         client.sendText("5511963262552@c.us", "teste");
//         console.log("Mensagem enviada");

//         // // Enviar Contato 
//         client.sendContactVcard("5511963262552@c.us", "5511970854531@c.us", "Name of contact");
//         console.log("Contato enviado");

//         // Enviar Lista de contatos
//         client.sendContactVcardList("5511963262552@c.us", ["5511970854531@c.us", "5511989961444@c.us"]);
//         console.log("Contatos enviados");

//         // Enviar Localização
//         client.sendLocation("5511963262552@c.us", "-13.6561589", "-69.7309264", "Brasil");
//         console.log("localização enviada");

//         // Enviar Link
//         client.sendLinkPreview("5511963262552@c.us", "https://www.youtube.com/watch?v=88vEe8MmG24", "Burro");
//         console.log("link enviado");

//         // Digitar
//         client.startTyping("5511963262552@c.us");

//         // Responder
//         // client.reply(message.from, message.body, message.id.toString())
//     })
//     .catch((erro) => {
//         console.log(erro);
//     });

const ManagePostgreSQL = require("./src/database/postgresql");


async function main() {
    const db = new ManagePostgreSQL();
    await db.connect();
    await db.createTable();

    // await db.deleteOne("5511963262552");

    console.log(await db.selectAll());
    await db.close();
}


main();

// 1029713-09.2021.8.26.0053 - Sucesso
// 0011237-82.2003.4.03.6183 - Não é TJSP
// 1025713-09.2023.8.26.0001 - Sem resultado
// 1006170-90.2019.8.26.0038 - Sem precatórios