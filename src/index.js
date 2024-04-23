const venom = require("venom-bot"); 
const { verify_contact } = require("./services/contact");
const { get_type_query } = require("./services/type");
const { get_response } = require("./services/message");


venom
    .create({
        session: "session-infos",
    })
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

  
function start(client) {
    client.onMessage(async(message) => {
        if (message.sender.id == "5511963262552@c.us" && message.isGroupMsg === false) {
            // Dados da mensagem
            let idcliente = message.sender.id;
            let idmsg = message.id;
            let nome = message.notifyName;
            let telefone = idcliente.replace("@c.us", "");
            let texto = message.body.trim();
            let status;
            if (message.isOnline){
                status = "online";
            }else{
                status = "offline";
            }
            let de_grupo = message.isGroupMsg;

            console.log(`\nId do cliente: ${idcliente}\nId da mensagem: ${idmsg}\nNome: ${nome}\nTelefone: ${telefone}\nTexto: ${texto}\nStatus: ${status}\nDe Grupo: ${de_grupo}`);

            let grupo;
            if (de_grupo) {
                grupo = message.groupInfo.name;
                console.log(`Grupo: ${grupo}`);
            }else {
                grupo = "";
            }
            // Mapear tipo da resposta
            let tipo = await get_type_query(texto);
            // Verificar contato
            let ultprocesso = "";
            if (tipo == 1) {
                ultprocesso = texto;
            }
            const contato = await verify_contact(
                telefone, nome, status, grupo, idmsg, idcliente, ultprocesso, tipo
            );
            // Mapear resposta
            console.log("Enviando mensagem...")
            let mensagem = await get_response(tipo, contato.lastProcess, texto, contato.status_primeira);
            if (tipo == 3) {
                client.sendText(idcliente, mensagem);
            }else {
                client.reply(idcliente, mensagem, idmsg);
            }
        }else {
            console.log("\noutra mensagem");
        }
    });
}
