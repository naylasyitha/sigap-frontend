const recipe = {
    name: "Stik Tahu Sayur",
    image_url: "https://example.com/stik-tahu-sayur.jpg",
    age_range: "8_12_MONTHS",
    meal_type: "FINGER_FOOD",
    difficulty: "EASY",
    duration: "25 menit",
    portion: 2,
    calories: 120,
    ingredients: [
        { name: "Tahu Putih", amount: "100 gram", icon: "🧀" },
        { name: "Brokoli", amount: "30 gram", icon: "🥦" },
        { name: "Wortel", amount: "30 gram", icon: "🥕" },
        { name: "Telur Ayam Kampung", amount: "1 butir", icon: "🥚" },
        { name: "Tepung Roti Halus", amount: "3 sdm", icon: "🌾" },
        { name: "Bawang Putih Bubuk", amount: "1/4 sdt", icon: "🧄" },
        { name: "Unsalted Butter", amount: "1 sdt", icon: "🧈" }
    ],
    steps: [
        {
            step_number: 1,
            title: "Siapkan sayuran",
            description: "Cuci bersih brokoli dan wortel. Parut wortel halus, lalu cincang brokoli hingga sangat halus (bisa juga diblender sebentar).",
            timer: null
        },
        {
            step_number: 2,
            title: "Hancurkan tahu",
            description: "Hancurkan tahu putih menggunakan garpu hingga benar-benar halus dan tidak ada gumpalan besar. Peras sedikit untuk mengurangi kadar air berlebih.",
            timer: null
        },
        {
            step_number: 3,
            title: "Campur adonan",
            description: "Dalam mangkuk, campurkan tahu halus, brokoli cincang, wortel parut, telur, bawang putih bubuk, dan 1 sdm tepung roti. Aduk rata hingga semua bahan menyatu.",
            timer: null
        },
        {
            step_number: 4,
            title: "Bentuk stik",
            description: "Ambil satu sendok adonan, bentuk memanjang seperti stik atau jari menggunakan tangan yang sudah diolesi unsalted butter agar tidak lengket. Ulangi hingga adonan habis.",
            timer: null
        },
        {
            step_number: 5,
            title: "Balur tepung roti",
            description: "Gulingkan stik tahu ke dalam sisa tepung roti hingga seluruh permukaan terbalut rata. Ini akan membuat tekstur luar sedikit renyah.",
            timer: null
        },
        {
            step_number: 6,
            title: "Panggang stik",
            description: "Panaskan air fryer atau oven 180°C. Tata stik di loyang, olesi sedikit unsalted butter di atasnya. Panggang selama 10–15 menit, balik di pertengahan waktu, hingga kuning keemasan.",
            timer: "±15 menit"
        },
        {
            step_number: 7,
            title: "Sajikan",
            description: "Angkat stik tahu sayur, dinginkan hingga suhu aman untuk bayi. Sajikan sebagai finger food yang mudah digenggam dan dimakan sendiri oleh si kecil.",
            timer: null
        }
    ],
    nutritions: [
        { name: "Protein", value: "8 g" },
        { name: "Karbohidrat", value: "12 g" },
        { name: "Kalsium", value: "85 mg" },
        { name: "Vitamin A", value: "3200 IU" },
        { name: "Zat Besi", value: "1.5 mg" },
        { name: "Serat", value: "2 g" },
        { name: "Vitamin C", value: "25 mg" }
    ]
};

function ageRangeLabel(key) {
    const map = {
        "6_8_MONTHS": "6–8 bulan",
        "8_12_MONTHS": "8–12 bulan",
        "12_18_MONTHS": "12–18 bulan",
        "18_24_MONTHS": "18–24 bulan",
        "24_MONTHS_PLUS": "24 bulan+",
    };
    return map[key] || key;
}

function mealTypeLabel(key) {
    const map = {
        "BREAKFAST": "Sarapan",
        "LUNCH": "Makan Siang",
        "DINNER": "Makan Malam",
        "SNACK": "Snack",
        "FINGER_FOOD": "Finger Food",
    };
    return map[key] || key;
}

function difficultyLabel(key) {
    const map = {
        "EASY": "mudah",
        "MEDIUM": "sedang",
        "HARD": "sulit",
    };
    return map[key] || key;
}

function difficultyIcon(key) {
    const map = { EASY: "🌿", MEDIUM: "⚡", HARD: "🔥" };
    return map[key] || "🌿";
}

function render(data) {
    const container = document.getElementById('mpasi-content');
    const isPlaceholder = !data.image_url || data.image_url.includes('example.com');
    const imgHTML = isPlaceholder
        ? `<div class="mpasi-hero-placeholder">🍽️</div>`
        : `<img class="mpasi-hero-img" src="${data.image_url}" alt="${data.name}" onerror="this.outerHTML='<div class=\\'mpasi-hero-placeholder\\'>🍽️</div>'">`;

    const tagsHTML = `
        <div class="mpasi-tags">
          <span class="mpasi-tag recommended">⭐ Direkomendasikan</span>
          <span class="mpasi-tag">${ageRangeLabel(data.age_range)}</span>
          <span class="mpasi-tag">${mealTypeLabel(data.meal_type)}</span>
        </div>`;

    const statsHTML = `
        <div class="mpasi-stats">
          <div class="mpasi-stat">
            <span class="stat-icon">⏱️</span>
            <span class="stat-value">${data.duration}</span>
            <span class="stat-label">menit</span>
          </div>
          <div class="mpasi-stat">
            <span class="stat-icon">🍼</span>
            <span class="stat-value">${data.portion}</span>
            <span class="stat-label">porsi anak</span>
          </div>
          <div class="mpasi-stat">
            <span class="stat-icon">🔥</span>
            <span class="stat-value">${data.calories}</span>
            <span class="stat-label">kkal</span>
          </div>
          <div class="mpasi-stat">
            <span class="stat-icon">${difficultyIcon(data.difficulty)}</span>
            <span class="stat-value">${difficultyLabel(data.difficulty)}</span>
            <span class="stat-label">tingkat</span>
          </div>
        </div>`;

    const nutritionHTML = `
        <div>
          <p class="mpasi-section-title">KANDUNGAN GIZI</p>
          <div class="nutrition-grid">
            ${data.nutritions.map(n => `
              <div class="nutrition-chip">
                <span class="nutr-value">${n.value}</span>
                <span class="nutr-label">${n.name}</span>
              </div>`).join('')}
          </div>
        </div>`;

    const leftHTML = `
        <div class="mpasi-left">
          ${imgHTML}
          ${tagsHTML}
          <h1 class="mpasi-title">${data.name}</h1>
          ${statsHTML}
          ${nutritionHTML}
        </div>`;

    const ingredientsHTML = `
        <div>
          <p class="mpasi-section-title">BAHAN-BAHAN</p>
          <div class="ingredients-grid">
            ${data.ingredients.map(ing => `
              <div class="ingredient-card">
                <div class="ingredient-icon">${ing.icon || '🥄'}</div>
                <div class="ingredient-info">
                  <span class="ingr-name">${ing.name}</span>
                  <span class="ingr-amount">${ing.amount}</span>
                </div>
              </div>`).join('')}
          </div>
        </div>`;

    const stepsHTML = `
        <div>
          <p class="mpasi-section-title">CARA MEMBUAT</p>
          <div class="steps-list">
            ${data.steps.map(s => `
              <div class="step-item">
                <div class="step-number">${s.step_number}</div>
                <div class="step-content">
                  <h4>${s.title}</h4>
                  <p>${s.description}</p>
                </div>
              </div>`).join('')}
          </div>
        </div>`;

    const rightHTML = `
        <div class="mpasi-right">
          ${ingredientsHTML}
          ${stepsHTML}
        </div>`;

    container.innerHTML = leftHTML + rightHTML;
}

render(recipe);