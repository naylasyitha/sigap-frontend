const token = localStorage.getItem("token");

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getAgeMonths(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

function formatTanggal(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });
}

function getWHO(gender) {
  return gender === "MALE" ? WHO_BOYS : WHO_GIRLS;
}

const WHO_GIRLS_BB_SDNEG = [2.7,3.6,4.3,4.9,5.4,5.8,6.1,6.4,6.7,6.9,7.2,7.4,7.6,7.8,8.0,8.2,8.4,8.6,8.8,9.0,9.2,9.4,9.6,9.8,10.0];
const WHO_BOYS_BB_SDNEG  = [2.9,3.9,4.9,5.6,6.2,6.7,7.1,7.4,7.7,8.0,8.2,8.4,8.6,8.8,9.0,9.2,9.4,9.6,9.8,10.0,10.2,10.4,10.6,10.8,11.0];
const WHO_GIRLS_TB_SDNEG = [45.6,50.0,53.2,55.8,58.0,59.9,61.5,63.1,64.4,65.7,67.0,68.3,69.4,70.6,71.7,72.8,73.8,74.9,75.8,76.8,77.7,78.6,79.5,80.4,81.3];
const WHO_BOYS_TB_SDNEG  = [46.1,50.8,54.4,57.3,59.7,61.7,63.3,64.8,66.2,67.5,68.7,69.9,71.0,72.1,73.1,74.1,75.1,76.0,77.0,77.9,78.8,79.7,80.5,81.4,82.2];

function assessStatus(gender, ageMonths, bb, tb) {
  const idx = Math.min(ageMonths, 24);
  const bbSdNeg = gender === "MALE" ? WHO_BOYS_BB_SDNEG[idx] : WHO_GIRLS_BB_SDNEG[idx];
  const tbSdNeg = gender === "MALE" ? WHO_BOYS_TB_SDNEG[idx] : WHO_GIRLS_TB_SDNEG[idx];

  const bbOk = bb >= bbSdNeg;
  const tbOk = tb >= tbSdNeg;

  if (bbOk && tbOk) return { title: "Status Gizi Normal", note: "Berat dan tinggi badan anak berada dalam rentang normal sesuai standar WHO.", icon: "assets/Status Gizi Normal.svg" };
  if (!bbOk && !tbOk) return { title: "Perlu Perhatian Khusus", note: "Berat dan tinggi badan anak berada di bawah standar WHO. Segera konsultasikan ke dokter.", icon: "assets/Status Gizi Kurang.svg" };
  return { title: "Status Gizi Cukup Baik", note: "Berat dan tinggi badan anak berada dalam rentang sedikit rendah dari normal. Perhatikan kembali asupan gizinya!", icon: "assets/Status Gizi Cukup Baik.svg" };
}

// ── STATE ──
let children = [];
let selectedChild = null;
let growthRecords = [];

// ── RENDER CHILD ──
function renderChild(child, records) {
  const ageMonths = getAgeMonths(child.birth_date);
  const genderText = child.gender === "FEMALE" ? "Perempuan" : "Laki-laki";
  const avatarSrc = child.gender === "FEMALE" ? "assets/perempuan.svg" : "assets/laki laki.svg";
  const last = records[records.length - 1];

  // selector toggle
  document.querySelector('.child-avatar-img').src = avatarSrc;
  document.querySelector('.child-name').textContent = child.name;
  document.querySelector('.child-sub').textContent = `${ageMonths} bulan · ${genderText}`;

  // stats card
  document.querySelector('.stats-avatar-img').src = avatarSrc;
  document.querySelector('.stats-name').textContent = child.name;
  document.querySelectorAll('.stats-tags .tag')[0].textContent = `0–${ageMonths} bulan`;
  document.querySelectorAll('.stats-tags .tag')[1].textContent = genderText;

  if (last) {
    document.querySelector('.stats-numbers .stat-item:nth-child(1) .stat-value').textContent = last.weight;
    document.querySelector('.stats-numbers .stat-item:nth-child(2) .stat-value').textContent = last.height;
    document.querySelector('.stats-numbers .stat-item:nth-child(3) .stat-value').textContent = last.head_circumference || '-';

    const status = assessStatus(child.gender, Math.min(ageMonths, 24), last.weight, last.height);
    document.querySelector('.nutrition-icon-img').src = status.icon;
    document.querySelector('.nutrition-title').textContent = status.title;
    document.querySelector('.nutrition-note').textContent = status.note;
    document.querySelector('.updated-label').textContent = `Diperbarui ${formatTanggal(last.measurement_date)}`;
  } else {
    document.querySelector('.stats-numbers .stat-item:nth-child(1) .stat-value').textContent = '-';
    document.querySelector('.stats-numbers .stat-item:nth-child(2) .stat-value').textContent = '-';
    document.querySelector('.stats-numbers .stat-item:nth-child(3) .stat-value').textContent = '-';
    document.querySelector('.nutrition-icon-img').src = 'assets/Status Gizi Cukup Baik.svg';
    document.querySelector('.nutrition-title').textContent = 'Belum ada data pengukuran';
    document.querySelector('.nutrition-note').textContent = 'Masukkan data pengukuran anak untuk melihat status gizi.';
    document.querySelector('.updated-label').textContent = 'Belum diperbarui';
  }

  document.querySelector('.info-row:nth-child(1) .info-value').textContent = child.name;
  document.querySelector('.info-row:nth-child(2) .info-value').innerHTML =
    `${formatTanggal(child.birth_date)} <span class="age-badge">${ageMonths} Bulan</span>`;
  document.querySelector('.info-row:nth-child(3) .info-value').textContent = genderText;
  document.querySelector('.info-row:nth-child(3) .info-icon-img').src =
    child.gender === "FEMALE" ? "assets/Jenis Kelamin Perempuan.svg" : "assets/Jenis Kelamin Laki.svg";
  document.querySelector('.info-row:nth-child(4) .info-value').textContent = `${child.birth_weight || '-'} kg`;
  document.querySelector('.info-row:nth-child(5) .info-value').textContent = `${child.birth_height || '-'} cm`;

  renderRiwayat(records);
}

function renderRiwayat(records) {
  const riwayatCard = document.querySelector('.riwayat-card');
  const last3 = [...records].reverse().slice(0, 3);

  riwayatCard.innerHTML = `
    <div class="riwayat-header-row">
      <span class="riwayat-count">${records.length} Pengukuran Terakhir</span>
      <a href="#" class="lihat-semua">Lihat Semua →</a>
    </div>
    ${last3.map((r, i) => {
      const prev = last3[i + 1];
      const delta = prev ? (r.weight - prev.weight).toFixed(1) : null;
      const deltaText = delta === null ? '–' : delta > 0 ? `↑ +${delta} kg` : delta < 0 ? `↓ ${delta} kg` : '→ Stabil';
      const date = new Date(r.measurement_date);
      return `
        <div class="riwayat-row">
          <div class="riwayat-tgl">
            <span class="riwayat-date">${date.getDate()}</span>
            <span class="riwayat-bln">${date.toLocaleDateString('id-ID', { month: 'short' })}</span>
          </div>
          <div class="riwayat-vals">
            <div class="riwayat-val-item"><span class="rv">${r.weight}</span><small>Kg BB</small></div>
            <div class="riwayat-val-item"><span class="rv">${r.height}</span><small>Cm TB</small></div>
            <div class="riwayat-val-item"><span class="rv">${r.head_circumference || '-'}</span><small>Cm LK</small></div>
          </div>
          <div class="riwayat-right">
            <span class="status-badge">Cukup</span>
            <span class="riwayat-delta">${deltaText}</span>
          </div>
        </div>
      `;
    }).join('')}
  `;
}

// ── RENDER DROPDOWN ──
function renderDropdown() {
  const dropdown = document.getElementById('profilAnakDropdown');
  const addBtn = dropdown.querySelector('.profil-anak-add');

  // hapus semua kecuali tombol tambah
  dropdown.querySelectorAll('.profil-anak-option:not(.profil-anak-add)').forEach(el => el.remove());

  children.forEach(child => {
    const ageMonths = getAgeMonths(child.birth_date);
    const genderText = child.gender === "FEMALE" ? "Perempuan" : "Laki-laki";
    const avatarSrc = child.gender === "FEMALE" ? "assets/perempuan.svg" : "assets/laki laki.svg";
    const isActive = selectedChild?.id === child.id;

    const option = document.createElement('div');
    option.className = `profil-anak-option${isActive ? ' active' : ''}`;
    option.dataset.id = child.id;
    option.innerHTML = `
      <img src="${avatarSrc}" alt="${child.name}" class="profil-anak-avatar">
      <div class="profil-anak-text">
        <span class="profil-anak-name">${child.name}</span>
        <span class="profil-anak-sub">${ageMonths} bulan · ${genderText}</span>
      </div>
      ${isActive ? '<span class="profil-anak-check"><img src="assets/ceklis.svg" alt="Aktif"></span>' : ''}
    `;

    option.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await selectChild(child);
      document.getElementById('profilAnakDropdown').classList.remove('open');
      document.getElementById('dropdownArrow').classList.remove('open');
      document.getElementById('childSelectorCard').classList.remove('dropdown-anak-open');
    });

    dropdown.insertBefore(option, addBtn);
  });
}

async function selectChild(child) {
  selectedChild = child;
  const res = await fetch(`${API_BASE_URL}/growth-records/child/${child.id}`, {
    headers: getHeaders()
  });
  const result = await res.json();
  growthRecords = result.data || [];
  renderChild(child, growthRecords);
  renderDropdown();
}

// ── LOAD ──
async function loadChildren() {
  const res = await fetch(`${API_BASE_URL}/children`, { headers: getHeaders() });
  const result = await res.json();

  if (!res.ok) {
    alert(result.message || "Gagal mengambil profil anak");
    return;
  }

  if (!result.data || result.data.length === 0) {
    document.querySelector('.child-name').textContent = 'Belum ada profil anak';
    document.querySelector('.child-sub').textContent = 'Tambahkan profil anak terlebih dahulu';
    document.querySelector('.riwayat-card').innerHTML = '<p class="empty-state">Belum ada data pengukuran.</p>';
    return;
  }

  children = result.data;
  await selectChild(children[0]);
}

// ── MODAL INPUT DATA ──
document.getElementById('editForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const payload = {
    child_id: selectedChild.id,
    weight: parseFloat(form.bb.value),
    height: parseFloat(form.tb.value),
    head_circumference: parseFloat(form.lk.value) || 0,
    measurement_date: `${form.tanggal.value}T00:00:00+07:00`,
  };

  const res = await fetch(`${API_BASE_URL}/growth-records`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) { alert(result.errors || "Gagal menyimpan"); return; }

  document.getElementById('editModal').classList.remove('open');
  await selectChild(selectedChild);
});

// ── MODAL TAMBAH PROFIL ──
document.getElementById('tambahProfilForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const payload = {
    name: form.namaAnak.value.trim(),
    birth_date: `${form.tanggalLahir.value}T00:00:00Z`,
    gender: form.querySelector('input[name="jenisKelamin"]:checked')?.value === 'laki' ? 'MALE' : 'FEMALE',
    birth_weight: parseFloat(form.beratLahir.value),
    birth_height: parseFloat(form.panjangLahir.value),
  };

  const res = await fetch(`${API_BASE_URL}/children`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) { alert(result.errors || "Gagal menambah profil"); return; }

  document.getElementById('tambahProfilModal').classList.remove('open');
  form.reset();

  const resChildren = await fetch(`${API_BASE_URL}/children`, { headers: getHeaders() });
  const resResult = await resChildren.json();
  children = resResult.data || [];

  const newChild = result.data || children[children.length - 1];
  if (newChild) {
    await selectChild(newChild);
  } else {
    renderDropdown();
  }
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', async () => {
  if (!token) {
    alert("Silakan login dulu");
    window.location.href = "login.html";
    return;
  }

  await loadChildren();

  // ── BUKA MODAL INPUT DATA ──
  document.getElementById('openEditBtn')?.addEventListener('click', () => {
    document.getElementById('editModal').classList.add('open');
  });
  document.getElementById('openEditBtn2')?.addEventListener('click', () => {
    document.getElementById('editModal').classList.add('open');
  });

  // ── TUTUP MODAL INPUT DATA ──
  document.getElementById('closeEditBtn')?.addEventListener('click', () => {
    document.getElementById('editModal').classList.remove('open');
  });

  // ── BUKA MODAL TAMBAH PROFIL ──
  document.getElementById('openTambahProfilBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('tambahProfilModal').classList.add('open');
  });
  document.getElementById('openTambahProfilBtn2')?.addEventListener('click', () => {
    document.getElementById('tambahProfilModal').classList.add('open');
  });

  // ── TUTUP MODAL TAMBAH PROFIL ──
  document.getElementById('closeTambahProfilBtn')?.addEventListener('click', () => {
    document.getElementById('tambahProfilModal').classList.remove('open');
  });

  // ── TUTUP MODAL KLIK OVERLAY ──
  document.querySelectorAll('.edit-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // ── DROPDOWN CHILD SELECTOR ──
  document.getElementById('childSelectorToggle')?.addEventListener('click', () => {
    document.getElementById('profilAnakDropdown').classList.toggle('open');
    document.getElementById('dropdownArrow').classList.toggle('open');
    document.getElementById('childSelectorCard').classList.toggle('dropdown-anak-open');
  });

  // ── GENDER TOGGLE TAMBAH PROFIL ──
  document.querySelectorAll('.gender-edit-row .gender-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.gender-edit-row .gender-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      option.querySelector('input[type="radio"]').checked = true;
    });
  });
});