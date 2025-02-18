console.log('index.js cargado');

document.addEventListener('DOMContentLoaded', async () => {
    await fetchPublications();
    await updateUserLink();
    await updateTokenDisplay();
});

async function fetchPublications() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Por favor, inicia sesión para ver publicaciones.');
            window.location.href = "/templates/login.html";
            return;
        }

        //Obtener publicaciones
        const response = await fetch('http://localhost:9001/api/public/publications', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error('Error en la solicitud:', response.status);
            return;
        }

        let publications = await response.json();
        publications = publications.body;

        renderPublications(publications);
        publications.forEach(async (publication) => {
            try {
                const token = localStorage.getItem("authToken");
                const likesResponse = await fetch(`http://localhost:9001/api/likes/${publication.id}/count`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                const likesData = await likesResponse.json();
        
                if (likesResponse.ok && likesData.success) {
                    updateLikesCount(publication.id, likesData.body.likes);
                } else {
                    console.error(`Error al obtener likes para publicación ${publication.id}:`, likesData.message);
                }
            } catch (error) {
                console.error(`Error al obtener likes para publicación ${publication.id}:`, error);
            }
        });
        

    } catch (error) {
        console.error('Error al conectar con el backend:', error);
    }
}

async function updateUserLink() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:9001/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const userData = await response.json();
        console.log('User Data:', userData);
        if (userData.success) {
            const userRole = userData.body.role;
            console.log('User Role:', userRole);
            const userLink = document.getElementById('user-link');
            const creatorPanelContainer = document.getElementById('creator-panel-container');

            if (userRole === 'user') {
                userLink.href = 'User_profile.html';
            } else if (userRole === 'model') {
                userLink.href = 'profile.html';
                const creatorButton = document.createElement('a');
                creatorButton.href = 'cargar.html';
                creatorButton.textContent = 'MI PANEL';
                creatorButton.classList.add('text-gray-300', 'hover:text-yellow-400', 'transition', 'duration-300', 'ml-4'); // Estilos para el botón
                creatorPanelContainer.appendChild(creatorButton);
            }
        }
    } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
    }
}

// Nueva función para actualizar el visualizador de tokens
async function updateTokenDisplay() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:9001/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const userData = await response.json();
        console.log('User Data:', userData);
        if (userData.success) {
            const tokenCount = userData.body.tokens;
            document.getElementById('token-count').textContent = tokenCount;
        }
    } catch (error) {
        console.error('Error al obtener los tokens del usuario:', error);
    }
}

function renderPublications(publications) {
    const container = document.getElementById('publications-container');
    container.innerHTML = '';

    publications.reverse();

    if (!publications.length) {
        container.innerHTML = "<p class='text-center text-gray-500'>No hay publicaciones disponibles.</p>";
        return;
    }

    console.log("Publicaciones a renderizar:", publications);

    publications.forEach((publication) => {
        console.log("Publicación actual:", publication);

        const isLiked = publication.isLiked;
        const likeIconSrc = isLiked
            ? "../static/media/Icons/corazon-hover.png"
            : "../static/media/Icons/me-gusta.png"; 

        const card = document.createElement('div');
        card.classList.add(
            'bg-gray-900', 'rounded-lg', 'shadow-md', 'p-4', 'mb-6', 'relative',
            'flex', 'flex-col', 'items-center', 'w-full', 'max-w-lg', 'mx-auto'
        );

        card.innerHTML = `
            <div class="flex items-center w-full p-2 cursor-pointer" onclick="window.location.href='/profile.html?userId=${publication.user?.id}'">
                <img src="${publication.user?.profile?.profileImage || '../static/media/default-avatar.png'}" class="w-12 h-12 rounded-full border-2 border-yellow-400">
                <div class="ml-3">
                    <p class="text-yellow-400 font-semibold">${publication.user?.profile?.stageName || 'Usuario'}</p>
                    <p class="text-gray-500 text-sm">${new Date(publication.publicationDate).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="relative w-full">
                <img src="${publication.mediaItems?.[0]?.url || '../static/media/default-placeholder.png'}" class="w-full h-auto rounded-lg">
            </div>
            <div class="mt-3 text-left w-full px-2">
                <h3 class="text-lg font-bold text-yellow-400">${publication.title}</h3>
                <p class="text-gray-300 mt-1">${publication.description}</p>
            </div>
            <div class="mt-4 flex items-center justify-between w-full px-4 text-gray-500">
                <div class="relative flex items-center gap-2 like-container cursor-pointer" 
                     data-id="${publication.id}" 
                     data-liked="${isLiked}">
                    <img src="${likeIconSrc}" class="w-6 h-6 like-icon">
                    <span class="text-sm" data-likes="${publication.id}">${publication.likes || 0} Me gusta</span>
                </div>
                <div class="relative flex items-center gap-2 comment-container cursor-pointer" data-id="${publication.id}">
                    <img src="../static/media/Icons/comente.png" class="w-6 h-6">
                    <span class="text-sm">Comentar</span>
                </div>
                <div class="relative flex items-center gap-2 share-container cursor-pointer" data-id="${publication.id}">
                    <img src="../static/media/Icons/enviar.png" class="w-6 h-6">
                    <span class="text-sm">Compartir</span>
                </div>
            </div>
            <div class="w-full mt-3 px-2 hidden comment-section" data-comments="${publication.id}">
                <input type="text" placeholder="Escribe un comentario..." class="w-full p-2 rounded bg-gray-800 text-white" data-comment-input="${publication.id}">
                <button class="mt-2 px-4 py-1 bg-yellow-400 text-gray-900 rounded" data-comment-btn="${publication.id}">Enviar</button>
                <div class="mt-2 text-white comments-list"></div>
            </div>
        `;

        console.log("HTML generado para publicación:", publication.id, card.innerHTML);

        container.appendChild(card);
    });

    attachEventListeners();
}


// Asignar eventos a los botones de interacción
function attachEventListeners() {
    document.querySelectorAll(".like-container").forEach(button => {
        button.addEventListener("click", () => {
            likePublication(button.getAttribute("data-id"));
        });
    });

    document.querySelectorAll(".comment-container").forEach(button => {
        button.addEventListener("click", async () => {
            const publicationId = button.getAttribute("data-id");
            const section = document.querySelector(`[data-comments="${publicationId}"]`);
            section.classList.toggle("hidden");
    
            if (!section.classList.contains("hidden")) {
                await loadComments(publicationId);
            }
        });
    });
    document.querySelectorAll("[data-comment-btn]").forEach(button => {
        button.addEventListener("click", () => {
            const publicationId = button.getAttribute("data-comment-btn");
            console.log("ID obtenido del botón de comentario:", publicationId);
            addComment(publicationId);
        });
    });
    document.querySelectorAll(".share-container").forEach(button => {
        button.addEventListener("click", () => {
            const publicationId = button.getAttribute("data-id");
            sharePublication(publicationId);
        });
    });
}

async function likePublication(publicationId) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Debes iniciar sesión para interactuar.");
        return;
    }

    const button = document.querySelector(`.like-container[data-id="${publicationId}"]`);

    try {
        const response = await fetch(`http://localhost:9001/api/likes/${publicationId}/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        console.log("Respuesta del backend al alternar like:", data);

        if (data.success) {
            updateLikesCount(publicationId, data.body.likes);

            const isLiked = button.getAttribute("data-liked") === "true";
            button.setAttribute("data-liked", !isLiked);
            button.classList.toggle("liked");
        } else {
            alert(data.message || "Error al procesar la acción.");
        }
    } catch (error) {
        console.error("Error al interactuar con el backend:", error);
    }
}

function updateLikesCount(publicationId, likes) {
    const likesElement = document.querySelector(`[data-likes="${publicationId}"]`);
    if (likesElement) {
        likesElement.textContent = `${likes} Me gusta`;
    }
}




function toggleLikeButton(publicationId, liked) {
    const button = document.querySelector(`.like-container[data-id="${publicationId}"]`);
    if (button) {
        if (liked) {
            button.classList.add("liked");
        } else {
            button.classList.remove("liked");
        }
        button.setAttribute("data-liked", liked);
    }
}


// Actualizar el contador de Me gusta
function updateLikesCount(publicationId, newLikesCount) {
    const likesElement = document.querySelector(`[data-likes="${publicationId}"]`);
    if (likesElement) {
        likesElement.textContent = `${newLikesCount} Me gusta`;
    }
}



// Función para agregar un comentario
async function addComment(publicationId) {
    const commentInput = document.querySelector(`[data-comment-input="${publicationId}"]`);
    if (!commentInput) {
        console.error(`No se encontró el input de comentario para la publicación con ID ${publicationId}`);
        return;
    }

    const commentValue = commentInput.value.trim();
    if (!commentValue) {
        alert("El comentario no puede estar vacío.");
        return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Debes iniciar sesión para comentar.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:9001/api/comments/${publicationId}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: commentValue }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Comentario agregado.");
            commentInput.value = "";
            loadComments(publicationId);
        } else {
            console.error("Error al agregar comentario:", data.message);
        }
    } catch (error) {
        console.error("Error al comentar:", error);
    }
}



// Función para cargar comentarios
async function loadComments(publicationId) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Debes iniciar sesión para ver los comentarios.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:9001/api/comments/${publicationId}/comments`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (data.success) {
            const commentsContainer = document.querySelector(`[data-comments="${publicationId}"] .comments-list`);
            commentsContainer.innerHTML = ""; // Limpia comentarios previos

            if (data.body.length === 0) {
                commentsContainer.innerHTML = "<p class='text-gray-400 text-sm'>No hay comentarios aún.</p>";
                return;
            }

            data.body.forEach((comment) => {
                const commentElement = document.createElement("div");
                commentElement.classList.add("comment-item", "mb-2", "p-2", "rounded", "bg-gray-800");

                commentElement.innerHTML = `
                    <div class="flex items-center mb-2">
                        <img src="${comment.user?.profileImage || '../static/media/default-avatar.png'}" 
                             class="w-8 h-8 rounded-full">
                        <span class="ml-2 text-yellow-400 font-semibold">${comment.user?.username || "Usuario"}</span>
                    </div>
                    <p class="text-gray-300">${comment.content}</p>
                `;

                commentsContainer.appendChild(commentElement);
            });
        } else {
            console.error("Error al cargar comentarios:", data.message);
        }
    } catch (error) {
        console.error("Error al conectar con el backend para cargar comentarios:", error);
    }
}



function sharePublication(publicationId) {
    const shareUrl = `${window.location.origin}/publications/${publicationId}`;

    if (navigator.share) {
        navigator.share({
            title: "¡Mira esta publicación!",
            text: "Echa un vistazo a esta publicación interesante.",
            url: shareUrl,
        })
        .then(() => console.log("Publicación compartida con éxito"))
        .catch((error) => console.error("Error al compartir:", error));
    } else {
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert("Enlace copiado al portapapeles"))
            .catch((error) => console.error("Error al copiar el enlace:", error));
    }
}
