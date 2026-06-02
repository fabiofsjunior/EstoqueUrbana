const API_URL =
  "https://script.google.com/macros/s/AKfycbwgwU6zyMYbrWtCO6ORZJ2-5CfHJ0-kEa4QmAYbCtDyEOvrbOow4ergdID3vxzD_zEv/exec";
function api(action) {
  return new Promise((resolve, reject) => {
    const callbackName = "jsonp_" + Date.now();

    window[callbackName] = function (data) {
      resolve(data);

      delete window[callbackName];

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    const script = document.createElement("script");

    script.src = `${API_URL}?action=${action}&callback=${callbackName}`;

    script.onerror = function () {
      reject(new Error("Falha ao carregar API"));

      delete window[callbackName];

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    document.body.appendChild(script);
  });
}
