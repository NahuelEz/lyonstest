document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.log('No auth token found');
        window.location.href = '/login.html';
        return;
    }

    try {
        console.log('Fetching user data...');
        // Fetch user data to verify if they are a model
        const userResponse = await fetch('http://localhost:9001/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            console.error('User response not ok:', userResponse.status);
            throw new Error('Error al obtener datos del usuario');
        }

        const userData = await userResponse.json();
        console.log('User data:', userData);

        if (!userData.success || userData.body.role !== 'model') {
            console.error('User is not a model:', userData);
            alert('Acceso no autorizado');
            window.location.href = '/';
            return;
        }

        // Update token count
        document.getElementById('token-count').textContent = userData.body.tokens || 0;

        console.log('Fetching model stats...');
        // Fetch model statistics
        const statsResponse = await fetch('http://localhost:9001/api/model/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!statsResponse.ok) {
            console.error('Stats response not ok:', statsResponse.status);
            throw new Error('Error al obtener estadísticas');
        }

        const statsData = await statsResponse.json();
        console.log('Stats data:', statsData);

        if (statsData.success) {
            // Update statistics
            document.getElementById('active-subscribers').textContent = statsData.body.activeSubscribers || 0;
            document.getElementById('total-tokens').textContent = statsData.body.subscriptionEarnings || 0;
            document.getElementById('unlocked-content').textContent = statsData.body.unlockedContentCount || 0;
        } else {
            console.error('Stats data not successful:', statsData);
            throw new Error(statsData.message || 'Error al obtener estadísticas');
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Error al cargar los datos del dashboard: ' + error.message);
        // Optionally redirect to login page if there's an authentication error
        if (error.message.includes('401') || error.message.includes('403')) {
            window.location.href = '/login.html';
        }
    }
});
