document.addEventListener("DOMContentLoaded", async () => {
    const apiBaseUrl = "http://localhost:9001/api/public/models/";
    const profilesContainer = document.getElementById("profilesContainer");

    try {
        const response = await fetch(apiBaseUrl);
        const data = await response.json();

        console.log("Datos de la API:", data);

        if (data.success) {
            data.body.forEach(item => {
                const profile = item.profile;

                if (profile) {
                    const profileCard = document.createElement("div");
                    profileCard.className = "bg-gray-900 rounded-lg p-4 text-center m-2";

                    const img = document.createElement("img");
                    img.src = profile.posterImage || "ruta_por_defecto.jpg";
                    img.alt = profile.stageName || "Nombre desconocido";
                    img.className = "w-full h-auto rounded-lg";

                    const name = document.createElement("p");
                    name.className = "text-white mt-2";
                    name.textContent = profile.stageName || "Nombre desconocido";

                    profileCard.appendChild(img);
                    profileCard.appendChild(name);
                    profilesContainer.appendChild(profileCard);
                }
            });
        } else {
            console.error("Error al cargar los perfiles:", data.message);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
});
