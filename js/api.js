async function api(action){

  const res = await fetch(`${API_URL}?action=${action}`);

  const text = await res.text(); // <- IMPORTANTE

  return JSON.parse(text);

}