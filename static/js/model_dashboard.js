document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        // Fetch user data to verify if they are a model
        const userResponse = await fetch('http://localhost:9001/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Error al obtener datos del usuario');
        }

        const userData = await userResponse.json();
        console.log('User data:', userData);

        if (!userData.success || userData.body.role !== 'model') {
            alert('Acceso no autorizado');
            window.location.href = '/';
            return;
        }

        // Update token count
        document.getElementById('token-count').textContent = userData.body.tokens || 0;

        // Fetch model statistics
        const statsResponse = await fetch('http://localhost:9001/api/model/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!statsResponse.ok) {
            throw new Error('Error al obtener estadísticas');
        }

        const statsData = await statsResponse.json();
        console.log('Stats data:', statsData);

        if (statsData.success) {
            // Update statistics
            document.getElementById('active-subscribers').textContent = statsData.body.activeSubscribers || 0;
            document.getElementById('total-tokens').textContent = statsData.body.subscriptionEarnings || 0;
            document.getElementById('unlocked-content').textContent = statsData.body.unlockedContentCount || 0;
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Error al cargar los datos del dashboard: ' + error.message);
    }
});
