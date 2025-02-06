console.log('1. Script cargado');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('2. DOM Loaded');
    
    const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
    console.log('3. Token:', token ? 'Encontrado' : 'No encontrado');

    const API_URL = 'http://localhost:9001';
    
    try {
        const userResponse = await fetch(`${API_URL}/api/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const userData = await userResponse.json();
        console.log('User Data:', userData);

        if (userData.success) {
            const userId = userData.body.id;
            console.log('User ID:', userId);

            const profileResponse = await fetch(`${API_URL}/api/profiles`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const profileData = await profileResponse.json();
            if (profileData.success) {
                console.log('Perfil cargado:', profileData.body);
                renderProfile(profileData.body);
                renderStats(profileData.body);
                updateSubscribeButton(profileData.body);

                // Cargar publicaciones con el ID del usuario actual
                const publicationsResponse = await fetch(`${API_URL}/api/users/${userId}/publications`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const publicationsData = await publicationsResponse.json();
                if (publicationsData.success) {
                    renderPublications(publicationsData.body);
                    document.querySelector('[data-stat="publications"]').textContent = publicationsData.body.length;
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function renderProfile(profile) {
    // Banner
    const bannerContainer = document.getElementById('bannerContainer');
    const bannerImage = document.getElementById('bannerImage');
    
    if (profile.bannerImage && profile.bannerImage.trim() !== '' && profile.bannerImage.endsWith('.jpg') || profile.bannerImage.endsWith('.png')) {
        bannerImage.src = profile.bannerImage;
        bannerImage.style.display = 'block';
        bannerContainer.style.background = 'none';
    } else {
        bannerImage.style.display = 'none';
        bannerContainer.style.background = 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)';
    }

    // Foto de perfil
    const profileImage = document.getElementById('profileImage');
    if (profile.profileImage) {
        profileImage.src = profile.profileImage;
    }

    // Nombre y usuario
    document.getElementById('stageName').textContent = profile.stageName || 'Nombre Artístico';
    document.getElementById('publicUserName').textContent = `@${profile.publicUserName}`;

    // Información
    const infoContainer = document.querySelector('.bg-gray-900.rounded-lg.p-6:nth-child(2)');
    if (infoContainer) {
        infoContainer.innerHTML = `
            <h3 class="text-lg font-semibold text-yellow-400 mb-4">Información</h3>
            <div class="space-y-4">
                ${profile.instagram ? `
                    <div class="flex items-center space-x-3">
                        <div class="w-6 h-6">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-pink-500">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </div>
                        <a href="https://instagram.com/${profile.instagram}" 
                           target="_blank"
                           class="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                            @${profile.instagram}
                        </a>
                    </div>
                ` : ''}
                
                ${profile.residenceCountry ? `
                    <div class="flex items-center space-x-3">
                        <div class="w-6 h-6 flex items-center justify-center">
                            <span class="text-2xl">${getCountryFlag(profile.residenceCountry)}</span>
                        </div>
                        <span class="text-gray-300">${profile.residenceCountry}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

function renderStats(profile) {
    // Actualizar estadísticas
    const statsContainer = document.querySelector('.bg-gray-900.rounded-lg.p-6:first-child');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <h3 class="text-lg font-semibold text-yellow-400 mb-4">Estadísticas</h3>
            <div class="space-y-3">
                <div class="flex justify-between">
                    <span class="text-gray-400">Publicaciones</span>
                    <span class="text-white font-semibold" data-stat="publications">0</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Suscriptores</span>
                    <span class="text-white font-semibold" data-stat="followers">${profile.followersCount || 0}</span>
                </div>
                <div class="flex justify-between">

                    <span class="text-gray-400">Me gusta</span>
                    <span class="text-white font-semibold" data-stat="likes">${profile.likesCount || 0}</span>
                </div>
            </div>
        `;
    }
}

function renderPublications(publications) {
    const container = document.getElementById('publicationsGrid');
    if (!container) return;

    container.className = 'w-full max-w-lg mx-auto space-y-6';
    container.innerHTML = '';

    if (!publications || publications.length === 0) {
        container.innerHTML = "<p class='text-center text-gray-500'>No hay publicaciones disponibles.</p>";
        return;
    }

    publications.forEach((publication) => {
        const card = document.createElement('div');
        card.classList.add(
            'bg-gray-800', 'rounded-lg', 'shadow-md', 'p-4', 'mb-6', 'relative',
            'flex', 'flex-col', 'items-center', 'w-full'
        );

        const isUnlocked = publication.publicationType !== 'token' || publication.isUnlocked;
        const imageUrl = isUnlocked
            ? publication.mediaItems?.[0]?.url || '../static/media/default-placeholder.png'
            : '../static/media/locked.png';

        card.innerHTML = `
            <!-- Usuario -->
            <div class="flex items-center w-full p-2">
                <img src="${publication.user?.profile?.profileImage || '../static/media/default-avatar.png'}" 
                     class="w-12 h-12 rounded-full border-2 border-yellow-400">
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

            <!-- Interacciones -->
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

        // Eventos de hover para el botón de "Me gusta"
        const likeContainer = card.querySelector('.like-container');
        const likeIcon = likeContainer.querySelector('.like-icon');

        likeContainer.addEventListener('mouseenter', () => {
            likeIcon.src = '../static/media/Icons/corazon-hover.png';
        });

        likeContainer.addEventListener('mouseleave', () => {
            likeIcon.src = '../static/media/Icons/me-gusta.png';
        });

        // Evento de click para "Me gusta"
        likeContainer.addEventListener('click', async () => {
            try {
                const postId = likeContainer.getAttribute("data-id");
                const token = localStorage.getItem('access_token');

                const likeResponse = await fetch(`http://localhost:9001/api/likes/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                const likeData = await likeResponse.json();
                if (likeData.success) {
                    alert('¡Te gustó esta publicación!');
                    // Recargar las publicaciones
                    loadProfileAndPublications(token);
                } else {
                    alert(`Error al dar like: ${likeData.message}`);
                }
            } catch (error) {
                console.error('Error al dar like:', error);
            }
        });

        container.appendChild(card);
    });
}

function getCountryFlag(countryName) {
    const countryToCode = {
        'Argentina': 'AR',
        'Brasil': 'BR',
        'Chile': 'CL',
        'Colombia': 'CO',
        'España': 'ES',
        'Mexico': 'MX',
        'Peru': 'PE',
        'Uruguay': 'UY',
        'Venezuela': 'VE'
    };

    const code = countryToCode[countryName];
    if (!code) return '🌎';

    // Convertir código de país a emojis de bandera
    return code
        .split('')
        .map(char => String.fromCodePoint(char.charCodeAt(0) + 127397))
        .join('');
}

function updateSubscribeButton(profile) {
    // Buscamos el botón específicamente por su texto y clase
    const subscribeButton = document.querySelector('button.Suscribirse') || 
                           document.querySelector('button[class*="bg-yellow-400"]') ||
                           document.querySelector('button:contains("Suscribirse")');
    
    if (subscribeButton) {
        subscribeButton.innerHTML = `
            Suscribirse 
            <span class="ml-2">${profile.basicSubscriptionCost || 0} Tokens</span>
        `;
        // Asegurarnos de mantener los estilos originales
        subscribeButton.className = 'bg-yellow-400 text-gray-900 px-6 py-2 rounded-full hover:bg-yellow-500 transition-colors duration-300';
    } else {
        console.log('No se encontró el botón de suscripción');
    }
}
