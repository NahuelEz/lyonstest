document.addEventListener("DOMContentLoaded", () => {
  const apiBaseUrl = "http://localhost:9001/api";

  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, verifica que no eres un robot.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

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
        body: JSON.stringify({ email, password, recaptchaResponse }),
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
          Swal.fire({
            title: '¡Error!',
            text: 'Error al obtener el rol del usuario.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      } else {
        Swal.fire({
          title: '¡Error!',
          text: data.message || 'Error al iniciar sesión',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error("Error en login:", error);
      Swal.fire({
        title: '¡Error!',
        text: 'Error de conexión con el servidor',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  });

  document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, verifica que no eres un robot.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const ageCheck = document.getElementById("ageCheck").checked;
    const termsCheck = document.getElementById("termsCheck").checked;

    if (!ageCheck) {
      Swal.fire({
        title: '¡Error!',
        text: 'Debes confirmar que eres mayor de 18 años.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (!termsCheck) {
      Swal.fire({
        title: '¡Error!',
        text: 'Debes aceptar los términos y condiciones.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const role = "user";

    if (password !== confirmPassword) {
      Swal.fire({
        title: '¡Error!',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          confirmPassword, 
          role,
          recaptchaResponse,
          isAdult: ageCheck,
          acceptedTerms: termsCheck
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: '¡Registro exitoso!',
          text: 'Por favor, inicia sesión.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          window.location.href = "http://localhost:9001/login";
        });
      } else {
        Swal.fire({
          title: '¡Error!',
          text: data.message || 'Error en el registro',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error("Error en registro:", error);
      Swal.fire({
        title: '¡Error!',
        text: 'Error de conexión con el servidor',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
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
    grecaptcha.reset();
  });

  registerTab.addEventListener('click', () => {
    registerTab.classList.add('bg-yellow-400', 'text-gray-900');
    registerTab.classList.remove('text-gray-300');
    loginTab.classList.remove('bg-yellow-400', 'text-gray-900');
    loginTab.classList.add('text-gray-300');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    grecaptcha.reset();
  });
});

function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  
  notificationMessage.textContent = message;
  notification.classList.remove('hidden');
  notification.style.opacity = 1;

  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 500);
  }, 3000);
}
