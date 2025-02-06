console.log('Script create_profile.js cargado');

try {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded ejecutado');
        
        const form = document.getElementById('createProfileForm');
        if (!form) {
            console.error('No se encontró el formulario con ID "createProfileForm"');
            return;
        }

        // Verificar el token al inicio
        const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
        console.log('Token encontrado:', token);

        if (!token) {
            console.warn('No hay token de acceso');
            alert('Por favor, inicia sesión primero');
            window.location.href = '/templates/login.html';
            return;
        }

        // Previsualización de imágenes
        const imageInputs = ['frontDocumentFile', 'backDocumentFile', 'profileImageFile', 'posterImageFile', 'bannerImageFile'];
        imageInputs.forEach(inputId => {
            const input = form.querySelector(`input[name="${inputId}"]`);
            if (input) {
                input.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        // Validar tamaño del archivo (máximo 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                            alert('El archivo es demasiado grande. Máximo 5MB permitido.');
                            this.value = '';
                            return;
                        }
                    }
                });
            }
        });

        // Solo validamos las imágenes opcionales si se han seleccionado
        const optionalImageInputs = ['profileImageFile', 'posterImageFile', 'bannerImageFile'];
        optionalImageInputs.forEach(inputId => {
            const input = form.querySelector(`input[name="${inputId}"]`);
            if (input) {
                input.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        // Validar tamaño del archivo (máximo 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                            alert('El archivo es demasiado grande. Máximo 5MB permitido.');
                            this.value = '';
                            return;
                        }
                    }
                });
            }
        });

        // Validación más estricta para documentos requeridos
        const requiredDocInputs = ['frontDocumentFile', 'backDocumentFile', 'videoDocumentFile'];
        requiredDocInputs.forEach(inputId => {
            const input = form.querySelector(`input[name="${inputId}"]`);
            if (input) {
                input.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                            alert('El archivo es demasiado grande. Máximo 5MB permitido.');
                            this.value = '';
                            return;
                        }
                    }
                });
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Iniciando creación de perfil...');

            try {
                // Obtener el ID del usuario actual
                const API_URL = 'http://localhost:9001';
                const userResponse = await fetch(`${API_URL}/api/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userData = await userResponse.json();
                if (!userData.success) {
                    throw new Error('No se pudo obtener la información del usuario');
                }

                const userId = userData.body.id; // Obtener el ID del usuario
                console.log('ID del usuario:', userId);

                // Crear FormData para enviar archivos y datos
                const formData = new FormData(form);
                formData.append('userId', userId); // Agregar el ID del usuario

                console.log('Datos del formulario a enviar:');
                for (let pair of formData.entries()) {
                    console.log(pair[0] + ':', pair[1]);
                }

                // Crear el perfil
                const response = await fetch(`${API_URL}/api/profiles/create`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const data = await response.json();
                console.log('Respuesta del servidor:', data);

                if (data.success) {
                    alert('¡Perfil creado con éxito!');
                    window.location.href = '/templates/profile.html';
                } else {
                    throw new Error(data.message || 'Error al crear el perfil');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al crear el perfil: ' + error.message);
            }
        });

        console.log('Listener de submit agregado al formulario');
    });
} catch (error) {
    console.error('Error al inicializar el script:', error);
}