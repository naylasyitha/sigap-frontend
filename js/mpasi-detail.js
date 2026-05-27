const API_ORIGIN = API_BASE_URL.replace("/api/v1", "");

function getMenuIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getImageUrl(imageUrl) {
  if (!imageUrl) return "assets/default-mpasi.jpg";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${API_ORIGIN}/${imageUrl}`;
}

function ageRangeLabel(key) {
  const map = {
    "6_8_MONTHS": "6–8 bulan",
    "9_11_MONTHS": "9–11 bulan",
    "12_24_MONTHS": "12–24 bulan",
    "24_PLUS_MONTHS": "24 bulan+",
  };
  return map[key] || key;
}

function mealTypeLabel(key) {
  const map = {
    BREAKFAST: "Sarapan",
    LUNCH: "Makan Siang",
    DINNER: "Makan Malam",
    SNACK: "Snack",
    FINGER_FOOD: "Finger Food",
  };
  return map[key] || key;
}

function difficultyLabel(key) {
  const map = {
    EASY: "mudah",
    MEDIUM: "sedang",
    HARD: "sulit",
  };
  return map[key] || key;
}

// function difficultyIcon(key) {
//   const map = {
//     EASY: "🌿",
//     MEDIUM: "⚡",
//     HARD: "🔥",
//   };
//   return map[key] || "🌿";
// }

function render(data) {
  const container = document.getElementById("mpasi-content");

  const imgHTML = !data.image_url
    ? `<div class="mpasi-hero-placeholder">🍽️</div>`
    : `<img 
        class="mpasi-hero-img" 
        src="${getImageUrl(data.image_url)}" 
        alt="${data.name}" 
        onerror="this.outerHTML='<div class=\\'mpasi-hero-placeholder\\'>🍽️</div>'"
      >`;

  const tagsHTML = `
    <div class="mpasi-tags">
      <span class="mpasi-tag">${ageRangeLabel(data.age_range)}</span>
      <span class="mpasi-tag">${mealTypeLabel(data.meal_type)}</span>
    </div>
  `;

    const statsHTML = `
    <div class="mpasi-stats">

    <div class="mpasi-stat">
        <img src="assets/timer-detail.png" class="stat-img">
        <span class="stat-value">${data.duration}</span>
    </div>

    <div class="mpasi-stat">
        <img src="assets/portion-detail.png" class="stat-img">
        <span class="stat-value">${data.portion} porsi anak</span>
    </div>

    <div class="mpasi-stat">
        <img src="assets/calories-detail.png" class="stat-img">
        <span class="stat-value">${data.calories} kkal</span>
    </div>

    <div class="mpasi-stat">
        <img src="assets/difficulty-detail.png" class="stat-img">
        <span class="stat-value">${difficultyLabel(data.difficulty)}</span>
    </div>

    </div>
    `;

  const nutritionHTML = `
    <div>
      <p class="mpasi-section-title">KANDUNGAN GIZI</p>
      <div class="nutrition-grid">
        ${(data.nutritions || []).map(n => `
          <div class="nutrition-chip">
            <span class="nutr-value">${n.value}</span>
            <span class="nutr-label">${n.name}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  const ingredientsHTML = `
    <div>
    <p class="mpasi-section-title">BAHAN-BAHAN</p>

    <div class="ingredients-grid">
        ${(data.ingredients || []).map(ing => `
        <div class="ingredient-card">
            <span class="ingr-name">${ing.name}</span>
            <span class="ingr-amount">${ing.amount}</span>
        </div>
        `).join("")}
    </div>
    </div>
    `;

  const stepsHTML = `
    <div>
      <p class="mpasi-section-title">CARA MEMBUAT</p>
      <div class="steps-list">
        ${(data.steps || []).map(s => `
          <div class="step-item">
            <div class="step-number">${s.step_number}</div>
            <div class="step-content">
              <h4>${s.title}</h4>
              <p>${s.description}</p>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  container.innerHTML = `
    <div class="mpasi-left">
      ${imgHTML}
      ${tagsHTML}
      <h1 class="mpasi-title">${data.name}</h1>
      ${statsHTML}
      ${nutritionHTML}
    </div>

    <div class="mpasi-right">
      ${ingredientsHTML}
      ${stepsHTML}
    </div>
  `;
}

async function loadMenuDetail() {
  const id = getMenuIdFromUrl();

  if (!id) {
    alert("Menu tidak ditemukan");
    window.location.href = "mpasi.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`);
    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Gagal mengambil detail menu");
      window.location.href = "mpasi.html";
      return;
    }

    render(result.data);
  } catch (error) {
    console.error(error);
    alert("Gagal terhubung ke server");
  }
}

loadMenuDetail();