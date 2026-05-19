const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

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
        alert(result.errors || result.message);
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
        alert(result.errors || result.message);
        return;
      }

      localStorage.setItem("token", result.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(result.data.user)
      );

      alert("Login berhasil!");

      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Terjadi kesalahan");
      console.error(error);
    }
  });
}