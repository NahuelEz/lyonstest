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

        const userData = await userResponse.json();
        if (!userData.success || userData.body.role !== 'model') {
            alert('Acceso no autorizado');
            window.location.href = '/';
            return;
        }

        // Update token count
        document.getElementById('token-count').textContent = userData.body.tokens || 0;

        // Fetch subscription statistics
        const subscriptionsResponse = await fetch(`http://localhost:9001/api/subscriptions/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const subscriptionsData = await subscriptionsResponse.json();
        if (subscriptionsData.success) {
            document.getElementById('active-subscribers').textContent = subscriptionsData.body.activeSubscribers || 0;
            document.getElementById('subscription-income').textContent = subscriptionsData.body.subscriptionIncome || 0;
        }

        // Fetch recent subscribers
        const recentSubscribersResponse = await fetch(`http://localhost:9001/api/subscriptions/recent`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const recentSubscribersData = await recentSubscribersResponse.json();
        if (recentSubscribersData.success) {
            const subscribersTable = document.getElementById('recent-subscribers');
            subscribersTable.innerHTML = recentSubscribersData.body.map(sub => `
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
            `).join('');
        }

        // Fetch recent activities
        const activitiesResponse = await fetch(`http://localhost:9001/api/activities/recent`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const activitiesData = await activitiesResponse.json();
        if (activitiesData.success) {
            const activitiesContainer = document.getElementById('recent-activities');
            activitiesContainer.innerHTML = activitiesData.body.map(activity => `
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
            `).join('');
        }

        // Fetch top unlocked content
        const topContentResponse = await fetch(`http://localhost:9001/api/content/top-unlocked`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const topContentData = await topContentResponse.json();
        if (topContentData.success) {
            const topContentContainer = document.getElementById('top-content');
            topContentContainer.innerHTML = topContentData.body.map(content => `
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
            `).join('');
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Error al cargar los datos del dashboard');
    }
});
