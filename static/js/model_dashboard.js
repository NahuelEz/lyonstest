document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.log('No auth token found');
        window.location.href = '/login.html';
        return;
    }

    try {
        // Set up axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch user data to verify if they are a model
        const userResponse = await axios.get('http://localhost:9001/api/users/me');
        console.log('User data:', userResponse.data);

        if (!userResponse.data.success || userResponse.data.body.role !== 'model') {
            console.error('User is not a model:', userResponse.data);
            alert('Acceso no autorizado');
            window.location.href = '/';
            return;
        }

        // Update token count
        document.getElementById('token-count').textContent = userResponse.data.body.tokens || 0;

        // Fetch model statistics
        const statsResponse = await axios.get('http://localhost:9001/api/model/stats');
        console.log('Stats data:', statsResponse.data);

        if (statsResponse.data.success) {
            // Update statistics
            document.getElementById('active-subscribers').textContent = statsResponse.data.body.activeSubscribers || 0;
            document.getElementById('total-tokens').textContent = statsResponse.data.body.subscriptionEarnings || 0;
            document.getElementById('unlocked-content').textContent = statsResponse.data.body.unlockedContentCount || 0;
        }

        // Fetch earnings overview
        const earningsResponse = await axios.get('http://localhost:9001/api/model/earnings');
        console.log('Earnings data:', earningsResponse.data);

        if (earningsResponse.data.success) {
            document.getElementById('subscription-income').textContent = earningsResponse.data.body.subscriptionEarnings || 0;
            document.getElementById('premium-content-income').textContent = earningsResponse.data.body.contentEarnings || 0;
            // For now, donations are not implemented
            document.getElementById('donations-income').textContent = '0';
        }

        // Fetch recent subscribers
        const subscribersResponse = await axios.get('http://localhost:9001/api/model/subscribers/recent');
        console.log('Subscribers data:', subscribersResponse.data);

        if (subscribersResponse.data.success) {
            const subscribersTable = document.getElementById('recent-subscribers');
            subscribersTable.innerHTML = subscribersResponse.data.body.map(sub => `
                <tr class="border-t border-gray-800">
                    <td class="p-4">
                        <div class="flex items-center">
                            <img src="${sub.subscriber?.profile?.profileImage || '../static/media/default-avatar.png'}" 
                                 class="w-8 h-8 rounded-full mr-3">
                            <span>${sub.subscriber?.profile?.stageName || 'Usuario'}</span>
                        </div>
                    </td>
                    <td class="p-4">${new Date(sub.suscribedAt).toLocaleDateString()}</td>
                    <td class="p-4">${sub.cost}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 rounded-full text-xs ${
                            sub.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }">${sub.status}</span>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="4" class="text-center p-4">No hay suscriptores recientes</td></tr>';
        }

        // Fetch recent activities
        const activitiesResponse = await axios.get('http://localhost:9001/api/model/activities/recent');
        console.log('Activities data:', activitiesResponse.data);

        if (activitiesResponse.data.success) {
            const activitiesContainer = document.getElementById('recent-activities');
            activitiesContainer.innerHTML = activitiesResponse.data.body.map(activity => `
                <div class="flex items-center justify-between py-2">
                    <div class="flex items-center">
                        <div class="w-2 h-2 rounded-full ${
                            activity.type === 'subscription' ? 'bg-green-500' :
                            activity.type === 'unlock' ? 'bg-blue-500' :
                            'bg-yellow-500'
                        } mr-3"></div>
                        <span>${activity.description}</span>
                    </div>
                    <span class="text-sm text-gray-400">${new Date(activity.createdAt).toLocaleString()}</span>
                </div>
            `).join('') || '<div class="text-center text-gray-500">No hay actividades recientes</div>';
        }

        // Fetch top unlocked content
        const topContentResponse = await axios.get('http://localhost:9001/api/model/content/top-unlocked');
        console.log('Top content data:', topContentResponse.data);

        if (topContentResponse.data.success) {
            const topContentContainer = document.getElementById('top-content');
            topContentContainer.innerHTML = topContentResponse.data.body.map(content => `
                <div class="bg-gray-800 rounded-lg overflow-hidden">
                    <img src="${content.mediaItems?.[0]?.url || '../static/media/default-placeholder.png'}" 
                         class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="font-semibold mb-2">${content.title}</h3>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">Desbloqueos:</span>
                            <span>${content.unlockCount}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">Tokens generados:</span>
                            <span>${content.tokensEarned}</span>
                        </div>
                    </div>
                </div>
            `).join('') || '<div class="text-center text-gray-500">No hay contenido desbloqueado</div>';
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
            alert('Sesión expirada o no autorizada');
            window.location.href = '/login.html';
        } else {
            alert('Error al cargar los datos del dashboard: ' + error.message);
        }
    }
});
