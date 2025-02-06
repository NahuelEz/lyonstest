document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postForm");
  const postType = document.getElementById("postType");
  const costField = document.getElementById("costField");
  const postCost = document.getElementById("postCost");

  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  console.log("Rol del usuario:", userRole);

  if (!authToken || userRole !== "model") {
    alert("Acceso denegado. Solo los usuarios con rol de 'model' pueden acceder a esta página.");
    window.location.href = "login.html";
    return;
  }

  // Mostrar/ocultar el campo de costo según el tipo de publicación
  postType.addEventListener("change", () => {
      if (postType.value === "token") {
          costField.classList.remove("hidden");
      } else {
          costField.classList.add("hidden");
          postCost.value = "";
      }
  });

  form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = document.getElementById("postTitle").value.trim();
      const description = document.getElementById("postDescription").value.trim();
      const type = postType.value;
      const cost = postCost.value || 0;
      const files = document.getElementById("postImages").files;

      if (!title || !description || files.length === 0 || (type === "token" && cost <= 0)) {
          alert("Por favor, completa todos los campos requeridos.");
          return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("cost", cost);

      for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
      }

      try {
          const response = await fetch("http://localhost:9001/api/publications", {
              method: "POST",
              headers: {
                  Authorization: `Bearer ${authToken}`,
              },
              body: formData,
          });

          const data = await response.json();

          if (data.success) {
              alert("¡Publicación subida con éxito!");
              form.reset();
              costField.classList.add("hidden");
              fetchPublications();
          } else {
              alert(`Error: ${data.message}`);
          }
      } catch (error) {
          console.error("Error al subir la publicación:", error);
          alert("Hubo un problema al conectar con el servidor.");
      }
  });

  fetchPublications();
});
