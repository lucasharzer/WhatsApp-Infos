const { validate_document } = require("../validation/document");
const { format_value } = require("../validation/value");
const ManageMySQL = require("../../database/mysqldb");
const ManageDate = require("../validation/date");


exports.get_response = async(tipo, processo_completo, n_precatorio, primeira, nome) => {
    // Iniciar serviços de data e banco MySQL
    const manageDate = new ManageDate();
    const mysql = new ManageMySQL();
    await mysql.getConnection();
    await mysql.connect();

    let infos;
    let mensagem = "", processo = "";

    // Definir processo
    if (processo_completo == null && tipo == 3) {
        mensagem = "A consulta do precatório está vinculada ao último processo do TJSP pesquisado. Como ainda não houve consulta anterior, é necessário primeiro buscar o processo desejado antes de acessar as informações do precatório, a menos que use a segunda forma de consultar precatório.";
    }else {
        if (tipo != 4) {
            if (tipo != 2) {
                processo = processo_completo.split("/")[0];
            }else {
                documento = processo_completo;
            }
        }

        // Preparar mensagem
        switch(tipo) {
            case 1:
                // Processo
                if (processo.replace(/[-.]/g, "").slice(13, 16) != "826") {
                    mensagem = `O processo *${processo}* não é do TJSP.`;
                }else {
                    try {
                        infos = await mysql.getProcesso(processo.replace(/[-.]/g, ""));
                        // - Formatar algumas informações
                        let dataProtocolo = manageDate.convertDate(infos.DataProtocolo, "data e hora");
                        let requisitado = format_value(infos.Requisitado);
                        let principalBruto = format_value(infos.PrincipalBruto);
                        let principalLiquido = format_value(infos.PrincipalLiquido);
                        let jurosMoratorios = format_value(infos.jurosMoratorio);
                        // - Mensagem
                        mensagem = `Informações do processo *${processo}*:\n\n• Processo Depre:  ${infos.NroProcessoDepre}\n• Natureza:  ${infos.Natureza}\n• Data Protocolo:  ${dataProtocolo}\n• Devedora:  ${infos.Devedora}\n• Ano:  ${infos.Ano}\n• Requisitado:  ${requisitado}\n• Principal Bruto:  ${principalBruto}\n• Principal Líquido:  ${principalLiquido}\n• Juros Moratórios:  ${jurosMoratorios}\n• Vara:  ${infos.Vara}\n• Assunto:  ${infos.Assunto}\n• Foro:  ${infos.Foro}\n• Advogado Principal:  ${infos.AdvogadoPrincipal}\n`;
                        let precatorios = await mysql.getPrecatorios(processo.replace(/[-.]/g, ""));
                        if (precatorios.length == 0) {
                            mensagem += "\nNão há precatórios";
                        }else {
                            mensagem += "\n• Precatórios:  " + precatorios.map(p => `*${p.Precatorio}*`).join(", ");
                        }
                    }catch(TypeError) {
                        mensagem = `Não há informações do processo *${processo}*.`;
                    }
                }
                break; 
            case 2:
                // Documento
                if (!validate_document(documento.replace(/[-.\/]/g, ""))) {
                    mensagem = `O documento *${documento}* é inválido.`;
                }else {
                    infos = await mysql.getProcessosPrecatorios(documento.replace(/[-.\/]/g, ""));
                    if (infos.length != 0) {
                        // Agrupar processos e precatórios
                        const processos = {};
                        infos.forEach(item => {
                            if (!processos[item.NroAutos]) {
                                processos[item.NroAutos] = [];
                            }
                            processos[item.NroAutos].push(`*${item.NomeArquivo.split(" - ")[1]}*`);
                        });
                        // - Mensagem
                        mensagem = `Precatórios vinculados ao documento *${documento}*:\n`;
                        for (const item in processos) {
                            const precatorios = processos[item].join(", ");
                            mensagem += `\n\n• Processo *${item.trim()}*:  ${precatorios}`;
                        }
                    }else {
                        mensagem = `Não há precatórios vinculados ao documento *${documento}*.`;
                    }
                } 
                break;
            case 5: 
                // Precatório passando o processo diretamente 
                if (processo.replace(/[-.]/g, "").slice(13, 16) != "826") {
                    mensagem = `O processo *${processo}* não é do TJSP.`;
                    break;
                }
            case 3:
                // Precatório
                let numero;
                if (tipo == 3) {
                    numero = n_precatorio.toString()
                }else {
                    numero = n_precatorio.split("/")[1]
                }
                let precatorio = `precatório - ${numero}`;
                try {
                    infos = await mysql.getPrecatorio(processo.replace(/[-.]/g, ""), precatorio);
                    // - Formatar algumas informações
                    let arquivo = infos.NomeArquivo.charAt(0).toUpperCase() + infos.NomeArquivo.slice(1);
                    let dataNascimento = manageDate.convertDate(infos.DataNascimento, "data");
                    let dataOficio = manageDate.convertDate(infos.dataOficio, "data");
                    let dataBase = manageDate.convertDate(infos.dataBase, "data");
                    let requisitado = format_value(infos.Requisitado);
                    let principalBruto = format_value(infos.PrincipalBruto);
                    let principalLiquido = format_value(infos.PrincipalLiquido);
                    let jurosMoratorios = format_value(infos.jurosMoratorio);
                    // - Mensagem
                    mensagem = `Informações do precatório *${numero}* do processo *${processo}*:\n\n• Arquivo:  ${arquivo}\n• Nome do Requisitante:  ${infos.NomeRequisitante}\n• Documento:  ${infos.Documento}\n• Tipo de Documento:  ${infos.TipoDocumento}\n• Data de Nascimento:  ${dataNascimento}\n• Número Depre:  ${infos.NumeroDepre}\n• Ordem:  ${infos.Ordem}\n• Requisitado:  ${requisitado}\n• Principal Bruto:  ${principalBruto}\n• Principal Líquido:  ${principalLiquido}\n• Juros Moratórios:  ${jurosMoratorios}\n• data Oficio:  ${dataOficio}\n• data Base:  ${dataBase}\n• Ano:  ${infos.Ano}\n• Situação:  ${infos.StatusApagar} (${infos.flgApagar})`;
                }catch(TypeError) {
                    mensagem = `Não há informações do precatório *${numero}* do processo *${processo}*.`;
                }
                break;
            case 4:
                // Outro (Mensagem de ajuda)
                if (primeira == 1) {
                    if (nome.toString().trim() != ".") {
                        mensagem = `Olá *${nome}*, `;
                    }else {
                        mensagem = "Olá, ";
                    }
                    mensagem += `seja bem-vindo ao chat de atendimento via WhatsApp.\n\n`;
                }
                mensagem += `Para utilizar o serviço de consulta de processos do TJSP você pode:\n\n• *Consultar Processo*: Basta digitar o número do processo e obter informações do mesmo (Padrão de processo: *XXXXXXX-XX.XXXX.8.26.XXXX*)!\n\n• *Consultar Documento*: Basta digitar o número do documento (CPF/CNPJ) e obter os precatórios em que ele aparece\n\n• *Consultar Precatório* (2 formas): Na primeira forma, basta digitar o número do precatório e obter informações do mesmo vinculado ao último processo digitado (Padrão de precatório: *XXXXX*). Na segunda forma, basta digitar o número do processo e o número do precatório separados por "/" (Padrão de precatório: *XXXXXXX-XX.XXXX.8.26.XXXX/XXXXX*)!\n\nObs: Será necessário consultar o processo antes do precatório, a menos que use a segunda forma de consultar precatório.`;
                break;
        }
    }

    return mensagem.replace(/null/g, "Não informado").replace(/NaN/g, "0,00").replace(/Invalid date/g, "Não informado");
}