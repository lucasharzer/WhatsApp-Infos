const { verify_contact } = require("./services/information/contact");
const { get_response } = require("./services/information/message");
const ManageType = require("./services/validation/type");
const venom = require("venom-bot"); 


// Iniciar Chat do WhatsApp
venom
    .create({
        session: "session-infos"
    })
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });


// Serviço de atendimento do Chat
function start(client) {
    client.onMessage(async(message) => {
        if (message.type == "chat" && message.isGroupMsg === false) { 
            // Dados da mensagem
            let idcliente = message.sender.id;
            let idmsg = message.id;
            let nome = message.notifyName;
            let telefone = idcliente.replace("@c.us", "");
            let texto;
            if (message.body != undefined) {
                texto = message.body.toString().trim().replace(/\s/g, "");
            }else {
                texto = "";
            }
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
            // Obs: Também é possível ver o tipo da mensagem (chat, image, video, sticker...): message.type
            // Mapear tipo da resposta
            const mapeamento = new ManageType(texto);
            let tipo = await mapeamento.get_type_query();
            // Padronizar tipo de consulta
            texto = await mapeamento.standardize_type();
            // Mensagem de espera que antecede a principal
            if (tipo.caso != 4) {
                client.sendText(idcliente, `Processando informações do ${tipo.consulta}...`)
            }
            // Verificar contato
            let ultconsulta = "";
            if ([1, 2, 5].includes(tipo.caso)) {
                if (tipo.caso == 5) {
                    ultconsulta = texto.split("/")[0]
                }
                ultconsulta = texto;
            }
            const contato = await verify_contact(
                telefone, nome, status, grupo, idmsg, idcliente, ultconsulta, tipo.caso
            );
            // Simular digitação...
            client.startTyping(idcliente);
            // Mapear resposta
            console.log("Enviando mensagem...")
            let mensagem = await get_response(
                tipo.caso, contato.lastQuery, texto, contato.status_primeira, nome
            );
            if (tipo.caso == 3) {
                client
                    .sendText(idcliente, mensagem)
                    .then(() => {
                        console.log("Respondido");
                    }).catch((error) => {
                        console.error(error);
                    });
            }else {
                client
                    .reply(idcliente, mensagem, idmsg)
                    .then(() => {
                        console.log("Respondido");
                    }).catch((error) => {
                        console.error(error);
                    });
            }
    });
}