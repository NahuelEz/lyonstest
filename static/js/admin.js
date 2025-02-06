document.getElementById("upload-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    // Obtener datos del formulario
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").files[0];
  
    if (title && description && image) {
      // Simular subida (puedes usar un API)
      const post = {
        title,
        description,
        image: URL.createObjectURL(image),
      };
  
      // Agregar publicación a la lista
      const postsList = document.getElementById("posts-list");
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td class="px-4 py-2 text-white">${post.title}</td>
        <td class="px-4 py-2">
          <button class="text-blue-400 hover:underline mr-2">Editar</button>
          <button class="text-red-500 hover:underline">Eliminar</button>
        </td>
      `;
      postsList.appendChild(newRow);
  
      // Limpiar formulario
      document.getElementById("upload-form").reset();
    }
  });
  