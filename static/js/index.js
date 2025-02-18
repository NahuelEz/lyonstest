document.addEventListener('DOMContentLoaded', async () => {
    await fetchPublications();
    await updateUserLink();
    await updateTokenDisplay();

    // Check if the user is a model and fetch their profile
    const token = localStorage.getItem('authToken');
    if (token) {
        const userResponse = await fetch('http://localhost:9001/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const userData = await userResponse.json();
        if (userData.success && userData.body.role === 'model') {
            const userId = userData.body.id; // Get the user ID
            window.location.href = `/profile.html?userId=${userId}`; // Redirect to the profile page
        }
    }
});

async function fetchPublications() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Por favor, inicia sesión para ver publicaciones.');
            window.location.href = "/templates/login.html";
            return;
        }

        // Obtener publicaciones
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
        
        console.log('Publications received:', publications);
        console.log('First publication comments:', publications[0]?.Comments);

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

    publications.forEach((publication) => {
        const card = document.createElement('div');
        card.classList.add(
            'bg-gray-900', 'rounded-lg', 'shadow-md', 'p-4', 'mb-6', 'relative',
            'flex', 'flex-col', 'items-center', 'w-full', 'max-w-lg', 'mx-auto'
        );

        card.innerHTML = `
            <div class="flex items-center w-full p-2">
                <img src="${publication.user?.profile?.profileImage || '../static/media/default-avatar.png'}" 
                     class="w-12 h-12 rounded-full border-2 border-yellow-400 cursor-pointer" 
                     onclick="window.location.href='/profile.html?userId=${publication.user?.profile?.userId}'">
                <div class="ml-3">
                    <p class="text-yellow-400 font-semibold cursor-pointer" 
                       onclick="window.location.href='/profile.html?userId=${publication.user?.profile?.userId}'">${publication.user?.profile?.stageName || 'Usuario'}</p>
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
                     data-id="${publication.id}">
                    <img src="../static/media/Icons/me-gusta.png" class="w-6 h-6 like-icon">
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
        `;

        container.appendChild(card);
    });

    attachEventListeners();
}

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
}

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
            commentsContainer.innerHTML = "";
            data.body.forEach((comment) => {
                const commentElement = document.createElement("div");
                commentElement.classList.add("comment-item", "mb-2", "p-2", "rounded", "bg-gray-800");
                commentElement.innerHTML = `
                    <div class="flex items-center mb-2">
                        <img src="${comment.User?.Profile?.profileImage || '../static/media/default-avatar.png'}" 
                             class="w-8 h-8 rounded-full">
                        <span class="ml-2 text-yellow-400 font-semibold">${comment.User?.Profile?.stageName || "Usuario"}</span>
                    </div>
                    <p class="text-gray-300">${comment.content}</p>
                `;
                commentsContainer.appendChild(commentElement);
            });
        }
    } catch (error) {
        console.error("Error al cargar comentarios:", error);
    }
}
