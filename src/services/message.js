const ManageMySQL = require("../database/mysqldb");


exports.get_response = async(tipo, processo_completo, n_precatorio, primeira) => {
    const mysql = new ManageMySQL();
    await mysql.getConnection();
    await mysql.connect();

    let infos;
    let mensagem = "", processo = "";

    // Definir processo
    if (processo_completo == null && tipo == 2) {
        mensagem = "A consulta do precatório está vinculada ao último processo do TJSP pesquisado. Como ainda não houve consulta anterior, é necessário primeiro buscar o processo desejado antes de acessar as informações do precatório";
    }else {
        if (tipo != 3) {
            processo = processo_completo.split("/")[0];
        }

        // Preparar mensagem
        switch(tipo) {
            case 1:
                // Processo
                if (processo.replace(/[-.]/g, "").slice(13, 16) != "826") {
                    mensagem = `O processo ${processo} não é do TJSP`;
                }else {
                    try {
                        infos = await mysql.getProcesso(processo);
                        mensagem = `Informações do processo ${processo}:\n\n• Processo Depre: ${infos.NroProcessoDepre}\n• Natureza: ${infos.Natureza}\n• Data Protocolo: ${infos.DataProtocolo}\n• Devedora: ${infos.Devedora}\n• Ano: ${infos.Ano}\n• Requisitado: ${infos.Requisitado}\n• Principal Bruto: ${infos.PrincipalBruto}\n• Vara: ${infos.Vara}\n• Assunto: ${infos.Assunto}\n• Foro: ${infos.Foro}\n• Advogado Principal: ${infos.AdvogadoPrincipal}\n`;
                        let precatorios = await mysql.getPrecatorios(processo);
                        if (precatorios.length == 0) {
                            mensagem += "Não há precatórios"
                        }else {
                            mensagem += "• Precatórios: " + precatorios.map(p => p.Precatorio).join(", ");
                        }
                    }catch(TypeError) {
                        mensagem = `Não há informações do processo ${processo}`;
                    }
                }
                break;
            case 2:
                // Precatório
                let numero = n_precatorio.toString().padStart(5, "0");
                let precatorio = `precatório - ${numero}`;
                infos = await mysql.getPrecatorio(processo, precatorio);
                try {
                    mensagem = `Informações do precatório ${numero} do processo ${processo}:\n\n• Arquivo: ${infos.NomeArquivo}\n• Nome do Requisitante: ${infos.NomeRequisitante}\n• Documento: ${infos.Documento}\n• Tipo de Documento: ${infos.TipoDocumento}\n• Data de Nascimento: ${infos.DataNascimento}\n• Número Depre: ${infos.NumeroDepre}\n• Ordem: ${infos.Ordem}\n• Requisitado: ${infos.Requisitado}\n• Principal Bruto: ${infos.PrincipalBruto}\n• dataOficio: ${infos.dataOficio}\n• dataBase: ${infos.dataBase}\n• Ano: ${infos.Ano}\n• Código da situação: ${infos.flgApagar}`;
                }catch(TypeError) {
                    mensagem = `Não há informações do precatório ${numero} do processo ${processo}`;
                }
                break;
            case 3:
                // Ajuda
                if (primeira == 1) {
                    mensagem = "Olá, seja bem-vindo ao chat de atendimento via WhatsApp. ";
                }
                mensagem += "Para utilizar o serviço de consulta de processos do TJSP você pode:\n\n• Digitar o número do processo e obter informações do mesmo\n• Digitar o número do precatório e obter informações do mesmo vinculado ao último processo digitado\n\nObs: Será necessário consultar o processo antes do precatório."
                break;
        }
    }

    return mensagem.replace(/null/g, "Não informado");
}