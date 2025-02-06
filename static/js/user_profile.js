document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Por favor, inicia sesión para ver tu perfil.');
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch('http://localhost:9001/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const userData = await response.json();
        console.log('User Data:', userData);
        if (userData.success) {
            document.querySelector('#username span').textContent = userData.body.username;
            document.querySelector('#creation-date span').textContent = userData.body.creationDate;
            document.querySelector('#email span').textContent = userData.body.email;
        } else {
            console.error('Error al obtener los datos del usuario:', userData.message);
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
    }

    // Manejo de cambios de correo
    document.getElementById('change-email-btn').addEventListener('click', () => {
        document.getElementById('change-email-form').classList.toggle('hidden');
        document.getElementById('change-password-form').classList.add('hidden'); // Ocultar el formulario de contraseña
    });

    document.getElementById('submit-email').addEventListener('click', async () => {
        const newEmail = document.getElementById('new-email').value;

        try {
            const response = await fetch('http://localhost:9001/api/users/change-email', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: newEmail })
            });

            const result = await response.json();
            if (result.success) {
                alert('Correo actualizado con éxito');
                document.getElementById('change-email-form').classList.add('hidden');
            } else {
                alert('Error al actualizar el correo: ' + result.message);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    });

    // Manejo de cambios de contraseña
    document.getElementById('change-password-btn').addEventListener('click', () => {
        document.getElementById('change-password-form').classList.toggle('hidden');
        document.getElementById('change-email-form').classList.add('hidden'); // Ocultar el formulario de correo
    });

    document.getElementById('submit-password').addEventListener('click', async () => {
        const newPassword = document.getElementById('new-password').value;

        try {
            const response = await fetch('http://localhost:9001/api/users/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: newPassword })
            });

            const result = await response.json();
            if (result.success) {
                alert('Contraseña actualizada con éxito');
                document.getElementById('change-password-form').classList.add('hidden');
            } else {
                alert('Error al actualizar la contraseña: ' + result.message);
            }
        } catch (error) {
            console.error('Error al conectar con la API:', error);
        }
    });
});