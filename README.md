# ChatBot - Consulta de processos e precatórios

ChatBot de atendimento via WhatsApp feito em node js com consulta de processos do TJSP e consulta de precatórios desses processos. O programa salva o registro de contatos que conversam com o chat em um banco de dados PostgreSQL no docker com informações obtidas pela interação com o chat, salva o último processo pesquisado pelo contato, pega informações do processo ou precatório em um banco de dados MySQL e retorna respostas para o contato (marcando ou não a requisição). Além disso, há também uma interface gráfica por meio de um web site exibindo os contatos que interagiram com o serviço.

# Pacotes
- dotenv: biblioteca do node js para acessar variáveis de ambiente no .env;
- date-fns: biblioteca do node js para manipulação de datas;
- express: biblioteca do node js, sendo um ótimo framework web;
- moment: biblioteca do node js para manipular, validar e formatar datas;
- mysql2: biblioteca do node js para conexão e execução de queries em um banco de dados MySQL;
- pg: biblioteca do node js para conexão e execução de queries em um banco de dados PostgreSQL;
- venom-bot: biblioteca do node js para comunicação via WhatsApp com diversas funcionalidades.

# Comandos
- node js | Instalar dependências:
```bash
npm install
```
- node js | Instalar corretamente o venom-bot:
```bash
npm install --save venom-bot
```
- node js | Executar chatbot:
```bash
npm start
```
- node js | Executar web server:
```bash
npm run server
```
- docker | Executar banco de dados PostgreSQL:
```bash
docker run --name <nome do contêiner> -e POSTGRES_PASSWORD=<senha do banco> -p 5432:5432 -d postgres
```

# Resultados
- ChatBot
<span>
    <img src="https://github.com/lucasharzer/Bancos_Dados-Tipos/assets/85804895/784978b7-640a-4633-8020-35f454958846">
</span>
<span>
    <img src="https://github.com/lucasharzer/Bancos_Dados-Tipos/assets/85804895/d15141be-0b89-4cee-8d8f-9e2a93d2241a">
</span>
<span>
    <img src="https://github.com/lucasharzer/Bancos_Dados-Tipos/assets/85804895/29bb7d75-af52-489c-9613-0c50af369295">
</span>
- Banco PostgreSQL
<span>
    <img src="https://github.com/lucasharzer/Bancos_Dados-Tipos/assets/85804895/23c43361-3c9c-4649-909d-a2a4ceff5b8a">
</span>
