async function getBaseURL() {
  try {
    const response = await fetch("http://localhost:9001/env"); // Puerto correcto
    if (!response.ok) throw new Error("Error al obtener el env");
    const env = await response.json();
    return env.API_BASE_URL || "http://localhost:9001/api";
  } catch (error) {
    console.error("Error al obtener las variables de entorno:", error);
    return "http://localhost:9001/api"; // Valor predeterminado
  }
}

let apiClient;
(async function initializeApiClient() {
  const baseURL = await getBaseURL();
  apiClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Axios configurado con baseURL:", baseURL);
})();
