const menuGrid = document.querySelector("#menuGrid");
const searchInput = document.querySelector("#searchInput");

const API_ORIGIN = API_BASE_URL.replace("/api/v1", "");

let allMenus = [];

function formatAge(age) {
  const ages = {
    "6_8_MONTHS": "6–8 bulan",
    "9_11_MONTHS": "9–11 bulan",
    "12_24_MONTHS": "12–24 bulan",
    "24_PLUS_MONTHS": ">24 bulan",
  };

  return ages[age] || age;
}

function getImageUrl(imageUrl) {
  if (!imageUrl) return "assets/default-mpasi.jpg";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${API_ORIGIN}${imageUrl}`;
  }

  return `${API_ORIGIN}/${imageUrl}`;
}

function renderMenus(menus) {
  menuGrid.innerHTML = "";

  if (!menus || menus.length === 0) {
    menuGrid.innerHTML = `<p class="empty-menu">Menu tidak ditemukan.</p>`;
    return;
  }

  menus.forEach((menu) => {
    menuGrid.innerHTML += `
      <article class="menu-card" onclick="goToMenuDetail('${menu.id}')">
        <img 
          src="${getImageUrl(menu.image_url)}" 
          alt="${menu.name}" 
          class="menu-card-image"
        >

        <div class="menu-card-body">
          <div class="menu-card-top">
            <h3>${menu.name}</h3>
            <span class="menu-age">${formatAge(menu.age_range)}</span>
          </div>

          <p class="menu-duration">
            <img src="assets/stopwatch.png" alt="" class="duration-icon">
            ${menu.duration}
          </p>
        </div>
      </article>
    `;
  });
}

function goToMenuDetail(id) {
  window.location.href = `mpasi-detail.html?id=${id}`;
}

async function loadMenus() {
  try {
    const response = await fetch(`${API_BASE_URL}/menus`);
    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Gagal mengambil data menu");
      return;
    }

    allMenus = result.data || [];
    renderMenus(allMenus);
  } catch (error) {
    console.error(error);
    alert("Gagal terhubung ke server");
  }
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const keyword = searchInput.value.toLowerCase();

    const filteredMenus = allMenus.filter((menu) =>
      menu.name.toLowerCase().includes(keyword)
    );

    renderMenus(filteredMenus);
  });
}

loadMenus();