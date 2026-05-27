document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const protectedPages = ["grafik.html", "jadwal.html", "profile.html"];
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  function goLoginWarning(event) {
    if (event) event.preventDefault();
    alert("Silakan login terlebih dahulu untuk mengakses halaman ini.");
    window.location.href = "login.html";
  }

  // Guard: halaman yang wajib login
  if (!token && protectedPages.includes(currentPage)) {
    goLoginWarning();
    return;
  }

  // Hamburger mobile
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
      });
    });
  }

  // Navbar setelah login: tombol Masuk berubah jadi Profile
  const loginBtn = document.querySelector(".login-btn");
  const mobileLogin = document.querySelector(".mobile-login");

  if (token) {
    if (loginBtn) {
      loginBtn.textContent = "Profile";
      loginBtn.href = "profile.html";
    }

    if (mobileLogin) {
      mobileLogin.textContent = "Profile";
      mobileLogin.href = "profile.html";
    }
  }

  // Kalau belum login, cegah akses Grafik/Jadwal/Profile dari navbar
  if (!token) {
    document.querySelectorAll('a[href="grafik.html"], a[href="jadwal.html"], a[href="profile.html"]').forEach((link) => {
      link.addEventListener("click", goLoginWarning);
    });
  }
});
