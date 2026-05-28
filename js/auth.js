const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstName = document.querySelector("#name").value;
    const lastName = document.querySelector("#last-name").value;
    const name = `${firstName} ${lastName}`;
    const email = document.querySelector("#email-register").value;
    const password = document.querySelector("#password-register").value;

    const passwordError = document.querySelector("#password-error");
    if (password.length < 8) {
      passwordError.textContent = "Kata sandi minimal 8 karakter!";
      passwordError.style.display = "block";
      return;
    } else {
      passwordError.textContent = "";
      passwordError.style.display = "none";
    }    

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
      const emailError = document.querySelector("#email-error");

      const pesanServer = result.errors || result.message || "";
      const emailSudahAda = pesanServer.toLowerCase().includes("email") && 
      (pesanServer.toLowerCase().includes("already") || 
      pesanServer.toLowerCase().includes("exist") || 
      pesanServer.toLowerCase().includes("terdaftar") || 
      response.status === 409);
      if (emailSudahAda) {
        emailError.textContent = "Email ini sudah terdaftar. Silakan login atau pakai email lain.";
        emailError.style.display = "block";
      } else {
        alert(pesanServer || "Terjadi kesalahan. Coba lagi.");
      }
      return;
    }

      alert("Registrasi berhasil!");

      window.location.href = "login.html";
    } catch (error) {
      alert("Terjadi kesalahan");
      console.error(error);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const loginError = document.querySelector("#login-error");

        if (response.status === 401 || response.status === 400) {
          loginError.textContent = "Email atau kata sandi salah. Coba lagi!";
          loginError.style.display = "block";
        } else {
          alert(result.errors || result.message || "Terjadi kesalahan. Coba lagi.");
        }
        return;
      }

      localStorage.setItem("token", result.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(result.data.user)
      );

      alert("Login berhasil!");

      window.location.href = "index.html";
    } catch (error) {
      alert("Terjadi kesalahan");
      console.error(error);
    }
  });
}