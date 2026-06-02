async function api(action){

  const response =
    await fetch(
      `${API_URL}?action=${action}`
    );

  return await response.json();

}