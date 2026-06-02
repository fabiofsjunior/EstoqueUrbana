function api(action) {
  return new Promise((resolve, reject) => {

    const callbackName = "cb_" + Math.random().toString(36).substring(2);

    window[callbackName] = function (data) {
      resolve(data);
      delete window[callbackName];
    };

    const script = document.createElement("script");

    script.src =
      `${API_URL}?action=${action}&callback=${callbackName}`;

    script.onerror = reject;

    document.body.appendChild(script);
  });
}