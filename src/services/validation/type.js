class ManageType {
    constructor(mensagem) {
        this.mensagem = mensagem;
        this.consulta;
        this.caso;
        this.padrao;
    }

    async get_type_query() {
        // Encontrar tipo de consulta
        if (/^[0-9]+$/.test(this.mensagem.replace(/[-.]/g, "").split("/")[0]) && this.mensagem.replace(/[-.]/g, "").split("/")[0].length == 20) {
            if (this.mensagem.includes("/") && ![undefined, ""].includes(this.mensagem.split("/")[1]) && ![0, NaN].includes(parseInt(this.mensagem.split("/")[1]))) {
                // Processo e Precatório
                this.consulta = "precatório";
                this.caso = 5;
            }else {
                // Processo
                this.consulta = "processo";
                this.caso = 1;
            }
        }else {
            if (/^[0-9]+$/.test(this.mensagem.replace(/[-.\/]/g, "")) && [11, 14].includes(this.mensagem.replace(/[-.\/]/g, "").length)) {
                // Documento
                this.consulta = "documento";
                this.caso = 2;
            }else {
                if (/^[0-9]+$/.test(this.mensagem) && this.mensagem.padStart(5, "0").length == 5) {
                    // Precatório
                    this.consulta = "precatório";
                    this.caso = 3;
                }else {
                    // Ajuda
                    this.caso = 4;
                    this.consulta = "outros";
                }
            }
        }

        return { caso: this.caso, consulta: this.consulta };
    }

    async standardize_type() {
        // Padronizar tipo
        switch(this.caso) {
            case 1:
                // Processo
                this.padrao = this.mensagem.replace("/", "").replace(
                    /^(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})$/, "$1-$2.$3.$4.$5.$6"
                );
                break;
            case 2:
                // Documento
                if (this.mensagem.replace(/[-.\/]/g, "").length == 11) {
                    this.padrao = this.mensagem.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
                }else {
                    this.padrao = this.mensagem.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
                }
                break;
            case 3:
                // Precatório
                this.padrao = this.mensagem.padStart(5, "0");
                break;
            case 4:
                // Outra mentém
                this.padrao = this.mensagem;
                break;
            case 5:
                // Processo e precatório
                const partes = this.mensagem.split("/");
                this.padrao = partes[0].replace(
                    /^(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})$/, "$1-$2.$3.$4.$5.$6"
                ) + "/" + partes[1].padStart(5, "0");
                break;
        }

        return this.padrao;
    }
}

module.exports = ManageType;