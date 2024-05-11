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

        // Enviar imagem
        client.sendImage("id", "caminho até a imagem", "nome", "rúbrica");

        // Enviar arquivo
        client.sendImage("id", "caminho até o arquivo", "nome", "rúbrica");

        // Enviar figura como gif
        client.sendImageAsStickerGif("id", "caminho até a imagem");

        // Enviar vídeo como gif
        client.sendVideoAsGif("id", "caminho até o vídeo", "nome", "rúbrica");
    })
    .catch((erro) => {
        console.error(erro);
    });