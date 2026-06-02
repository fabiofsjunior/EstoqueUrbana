function api(action) {
  return new Promise((resolve, reject) => {

    const callbackName = "cb_" + Date.now();

    window[callbackName] = function (data) {
      resolve(data);
      delete window[callbackName];
      script.remove();
    };

    const script = document.createElement("script");

    script.src =
      `${API_URL}?action=${action}&callback=${callbackName}`;

    script.onerror = function (err) {
      reject(new Error("Falha ao carregar API"));
    };

    document.body.appendChild(script);
  });
}