document.addEventListener('DOMContentLoaded', async () => {
    await fetchPublications();
    await updateUserLink();
    await updateTokenDisplay();
});

// Remove automatic redirection to profile

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

// Add click event for "Mi cuenta" link
document.getElementById('user-link').addEventListener('click', (event) => {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    if (token) {
        const userId = JSON.parse(atob(token.split('.')[1])).id; // Extract user ID from token
        window.location.href = `/profile.html?userId=${userId}`;
    } else {
        window.location.href = '/templates/login.html';
    }
});
