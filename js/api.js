const API_URL =
  "https://script.google.com/macros/s/AKfycbwgwU6zyMYbrWtCO6ORZJ2-5CfHJ0-kEa4QmAYbCtDyEOvrbOow4ergdID3vxzD_zEv/exec";

// async function api(action) {
//   try {
//     const res = await fetch(`${API_URL}?action=${action}`);

//     if (!res.ok) {
//       throw new Error("Erro HTTP: " + res.status);
//     }

//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.error("Erro API:", err);
//     throw err;
//   }
// }

async function api(action, tentativas = 3) {

  for (let i = 0; i < tentativas; i++) {

    try {

      const res = await fetch(`${API_URL}?action=${action}`, {
        cache: "no-store"
      });

      if (res.ok) {

        return await res.json();

      }

    } catch (e) {
      console.warn(`Tentativa ${i + 1} falhou para ${action}`);
    }

    await esperar(500);

  }

  throw new Error(`Erro ao carregar ${action}`);

}
