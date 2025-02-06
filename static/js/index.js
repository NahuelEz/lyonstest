console.log('index.js cargado');

document.addEventListener('DOMContentLoaded', async () => {
    await fetchPublications();
    await updateUserLink();
    await updateTokenDisplay();
});

async function fetchPublications() {
    try {
        const token = localStorage.getItem('authToken');
        console.log('Token:', token);
        if (!token) {
            alert('Por favor, inicia sesión para ver publicaciones.');
            window.location.href = "/templates/login.html";
            return;
        }

        console.log("Obteniendo publicaciones...");

        const response = await fetch('http://localhost:9001/api/public/publications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Error en la solicitud:', response.status);
            return;
        }

        const data = await response.json();
        console.log("Publicaciones obtenidas:", data.body);

        if (data.success && Array.isArray(data.body)) {
            renderPublications(data.body);
        } else {
            console.error('Error obteniendo publicaciones:', data.message);
        }
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
            const userRole = userData.body.role; // Obtener el rol del usuario
            console.log('User Role:', userRole);
            const userLink = document.getElementById('user-link');

            // Cambiar el href según el rol
            if (userRole === 'user') {
                userLink.href = 'User_profile.html'; // Cambiar a User_profile.html
            } else if (userRole === 'model') {
                userLink.href = 'profile.html'; // Mantener en profile.html
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

    if (!publications || publications.length === 0) {
        container.innerHTML = "<p class='text-center text-gray-500'>No hay publicaciones disponibles.</p>";
        return;
    }

    publications.forEach((publication) => {
        const card = document.createElement('div');
        card.classList.add(
            'bg-gray-900', 'rounded-lg', 'shadow-md', 'p-4', 'mb-6', 'relative',
            'flex', 'flex-col', 'items-center', 'w-full', 'max-w-lg', 'mx-auto'
        );

        let currentImageIndex = 0;
        const isUnlocked = publication.publicationType !== 'token' || publication.isUnlocked;

        const imageUrl = isUnlocked
            ? publication.mediaItems?.[currentImageIndex]?.url || '../static/media/default-placeholder.png'
            : '../static/media/locked.png';

        card.innerHTML = `
            <!-- Usuario -->
            <div class="flex items-center w-full p-2 cursor-pointer" onclick="window.location.href='User_profile.html?userId=${publication.user?.id}'">
                <img src="${publication.user?.profile?.profileImage || '../static/media/default-avatar.png'}" class="w-12 h-12 rounded-full border-2 border-yellow-400">
                <div class="ml-3">
                    <p class="text-yellow-400 font-semibold">${publication.user?.profile?.stageName || 'Usuario'}</p>
                    <p class="text-gray-500 text-sm">${new Date(publication.publicationDate).toLocaleDateString()}</p>
                </div>
            </div>

            <!-- Imagen -->
            <div class="relative w-full">
                <img src="${imageUrl}" class="w-full h-auto rounded-lg">
            </div>

            <!-- Descripción -->
            <div class="mt-3 text-left w-full px-2">
                <h3 class="text-lg font-bold text-yellow-400">${publication.title}</h3>
                <p class="text-gray-300 mt-1">${publication.description}</p>
            </div>

            <!-- Interacciones (Me gusta, Comentar, Compartir, Enviar Tokens) -->
            <div class="mt-4 flex items-center justify-between w-full px-4 text-gray-500">
                <!-- Me gusta -->
                <div class="relative flex items-center gap-2 like-container cursor-pointer" data-id="${publication.id}">
                    <img src="../static/media/Icons/me-gusta.png" 
                        alt="Me gusta" 
                        class="w-6 h-6 like-icon">
                    <span class="text-sm">${publication.likes || 0} Me gusta</span>
                </div>

                <!-- Comentarios -->
                <div class="relative flex items-center gap-2 cursor-pointer">
                    <img src="../static/media/Icons/comente.png" alt="Comentar" class="w-6 h-6">
                    <span class="text-sm">Comentar</span>
                </div>

                <!-- Compartir -->
                <div class="relative flex items-center gap-2 cursor-pointer">
                    <img src="../static/media/Icons/enviar.png" alt="Compartir" class="w-6 h-6">
                    <span class="text-sm">Compartir</span>
                </div>

                <!-- Enviar Tokens -->
                <div class="relative flex items-center gap-2 cursor-pointer">
                    <img src="../static/media/Icons/signo-de-dolar.png" alt="Enviar Tokens" class="w-6 h-6">
                </div>
            </div>
        `;

        // Cambiar icono de "Me gusta" al pasar el mouse
        const likeContainer = card.querySelector('.like-container');
        const likeIcon = likeContainer.querySelector('.like-icon');

        likeContainer.addEventListener('mouseenter', () => {
            likeIcon.src = '../static/media/Icons/corazon-hover.png'; // Cambia al icono rojo
        });

        likeContainer.addEventListener('mouseleave', () => {
            likeIcon.src = '../static/media/Icons/me-gusta.png'; // Restaura al icono gris
        });

        container.appendChild(card);
    });


}
