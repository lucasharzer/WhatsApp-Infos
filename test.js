const venom = require('venom-bot');


venom
    .create({
        session: "session-infos"
    })
    .then(async (client) => {
        // Enviar mensagem de texto 
        client.sendText("id", "texto");
        console.log("Mensagem enviada");

        // // Enviar Contato 
        client.sendContactVcard("id", "contato", "Nome");
        console.log("Contato enviado");

        // Enviar Lista de contatos
        client.sendContactVcardList("id", ["contato 1", "contato 2"]);
        console.log("Contatos enviados");

        // Enviar Localização
        client.sendLocation("id", "latitude", "longitude", "Brasil");
        console.log("localização enviada");

        // Enviar Link
        client.sendLinkPreview("id", "link", "título");
        console.log("link enviado");

        // Digitar
        client.startTyping("id");

        // Responder
        client.reply("id", "texto", "id mensagem");
    })
    .catch((erro) => {
        console.error(erro);
    });