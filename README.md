# ChatBot - Consulta de processos e precatórios

ChatBot de atendimento via WhatsApp feito em Node JS com consulta de processos do TJSP e consulta de precatórios desses processos. O programa salva o registro de contatos que conversam com o chat em um banco de dados PostgreSQL no docker com informações obtidas pela interação com o chat, salva o último processo pesquisado pelo contato, pega informações do processo ou precatório em um banco de dados MySQL e retorna respostas para o contato (marcando ou não a requisição).
