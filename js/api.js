async function api(action){

  const response = await fetch(`${API_URL}?action=${action}`, {
    method: "GET",
    mode: "cors"
  });

  const text = await response.text();
  return JSON.parse(text);

}