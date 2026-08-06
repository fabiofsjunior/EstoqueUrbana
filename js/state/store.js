/**
 * Store global do Dashboard
 *
 * Responsável por armazenar todos
 * os dados carregados pela API dashboard.
 */

const DashboardStore = {


    dados: {


        indicadores: null,

        topATM: [],

        topPecas: [],

        motivos: [],

        consumo: [],

        ultimas: [],

        reparoLocal: [],

        bancada: [],

        vandalismo: [],

        reposicao: [],

        retornos: []

    },


    /**
     * Atualiza todos os dados recebidos
     * da API dashboard
     */
    set(dados){

        this.dados = {

            ...this.dados,

            ...dados

        };

    },


    /**
     * Busca um módulo específico
     *
     * Exemplo:
     *
     * DashboardStore.get("indicadores")
     */
    get(chave){

        return this.dados[chave] ?? null;

    },


    /**
     * Limpa informações carregadas
     */
    clear(){

        this.dados = {

            indicadores:null,

            topATM:[],

            topPecas:[],

            motivos:[],

            consumo:[],

            ultimas:[],

            reparoLocal:[],

            bancada:[],

            vandalismo:[],

            reposicao:[],

            retornos:[]

        };

    },


    /**
     * Verifica se já existe carga
     */
    possuiDados(){

        return Object.keys(this.dados).length > 0;

    }


};


window.DashboardStore = DashboardStore;