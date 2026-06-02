const API_URL =
  "https://script.google.com/macros/s/AKfycbwgwU6zyMYbrWtCO6ORZJ2-5CfHJ0-kEa4QmAYbCtDyEOvrbOow4ergdID3vxzD_zEv/exec";

async function api(action) {
  try {
    const res = await fetch(`${API_URL}?action=${action}`);
    
    if (!res.ok) {
      throw new Error("Erro HTTP: " + res.status);
    }

    const data = await res.json();
    return data;

  } catch (err) {
    console.error("Erro API:", err);
    throw err;
  }
}