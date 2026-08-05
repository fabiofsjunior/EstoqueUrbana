const API_URL =
"https://script.google.com/macros/s/AKfycbwgwU6zyMYbrWtCO6ORZJ2-5CfHJ0-kEa4QmAYbCtDyEOvrbOow4ergdID3vxzD_zEv/exec";



function esperar(ms){

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}




function api(
    action,
    params = {}
){

    return new Promise((resolve, reject)=>{


        const callback =
            "callback_" + Date.now();



        window[callback] = function(data){


            delete window[callback];


            script.remove();


            resolve(data);


        };



        const query =
            new URLSearchParams({

                action,

                callback,

                ...params

            });



        const script =
            document.createElement("script");



        script.src =
            `${API_URL}?${query}`;



        script.onerror = function(){


            delete window[callback];


            reject(
                new Error(
                    "Erro ao carregar API"
                )
            );


        };



        document.body.appendChild(script);



    });

}



window.api = api;