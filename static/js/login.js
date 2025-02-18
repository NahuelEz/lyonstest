document.addEventListener("DOMContentLoaded", () => {
  const apiBaseUrl = "http://localhost:9001/api";

  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      const response = await fetch(`${apiBaseUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.body.token) {
        localStorage.setItem("authToken", data.body.token);

        const userResponse = await fetch(`${apiBaseUrl}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.body.token}`,
          },
        });

        const userData = await userResponse.json();
        if (userData.success) {
          localStorage.setItem("userRole", userData.body.role);
          Swal.fire({
            title: '¡Login exitoso!',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            window.location.href = "http://localhost:9001/";
          });
        } else {
          alert("Error al obtener el rol del usuario.");
        }
      } else {
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error de conexión con el servidor");
    }
  });

  document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const role = "user";

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmPassword, role }),
      });

      const data = await response.json();

      if (data.success) {
        alert("¡Registro exitoso! Inicia sesión ahora.");
        window.location.href = "http://localhost:9001/login";
      } else {
        alert(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error de conexión con el servidor");
    }
  });

  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  loginTab.addEventListener('click', () => {
    loginTab.classList.add('bg-yellow-400', 'text-gray-900');
    loginTab.classList.remove('text-gray-300');
    registerTab.classList.remove('bg-yellow-400', 'text-gray-900');
    registerTab.classList.add('text-gray-300');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });

  registerTab.addEventListener('click', () => {
    registerTab.classList.add('bg-yellow-400', 'text-gray-900');
    registerTab.classList.remove('text-gray-300');
    loginTab.classList.remove('bg-yellow-400', 'text-gray-900');
    loginTab.classList.add('text-gray-300');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notificationMessage.textContent = message;
    notification.classList.remove('hidden');
    notification.style.opacity = 1;

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = 0;
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 500);
    }, 3000);
}
