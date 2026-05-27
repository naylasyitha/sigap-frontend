const token = localStorage.getItem("token");

const modal = document.getElementById("modalTambahJadwal");
const btnTambah = document.getElementById("btnTambahJadwal");
const btnBatal = document.getElementById("btnBatal");
const btnSimpan = document.getElementById("btnSimpan");

const jadwalList = document.getElementById("jadwalList");
const inputChild = document.getElementById("inputChild");

btnTambah.addEventListener("click", () => modal.classList.add("active"));
btnBatal.addEventListener("click", () => modal.classList.remove("active"));

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function mapTypeToDataType(type) {
  const map = {
    IMMUNIZATION: "imunisasi",
    WEIGHT_CHECK: "timbang",
    CONSULTATION: "bidan",
    VITAMIN: "lainnya",
  };

  return map[type] || "lainnya";
}

function mapInputType(type) {
  const map = {
    imunisasi: "IMMUNIZATION",
    timbang: "WEIGHT_CHECK",
    cek: "CONSULTATION",
    bidan: "CONSULTATION",
    lainnya: "VITAMIN",
  };

  return map[type] || "CONSULTATION";
}

async function loadChildren() {
  const res = await fetch(`${API_BASE_URL}/children`, {
    headers: getHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    alert(result.message || "Gagal mengambil data anak");
    return;
  }

  inputChild.innerHTML = "";

  result.data.forEach((child) => {
    inputChild.innerHTML += `
      <option value="${child.id}">
        ${child.name} - ${child.gender === "FEMALE" ? "Perempuan" : "Laki-laki"}
      </option>
    `;
  });
}

async function loadSchedules() {
  const res = await fetch(`${API_BASE_URL}/schedules`, {
    headers: getHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    alert(result.message || "Gagal mengambil jadwal");
    return;
  }

  renderSchedules(result.data || []);
}

function renderSchedules(schedules) {
  jadwalList.innerHTML = "";

  if (schedules.length === 0) {
    jadwalList.innerHTML = `<p>Belum ada jadwal.</p>`;
    return;
  }

  const grouped = {};

  schedules.forEach((schedule) => {
    const dateTitle = formatDate(schedule.schedule_date);

    if (!grouped[dateTitle]) {
      grouped[dateTitle] = [];
    }

    grouped[dateTitle].push(schedule);
  });

  Object.keys(grouped).forEach((dateTitle) => {
    const group = document.createElement("div");
    group.className = "jadwal-group";

    group.innerHTML = `
      <h2 class="jadwal-group-title">${dateTitle}</h2>
    `;

    grouped[dateTitle].forEach((schedule) => {
      group.innerHTML += `
        <div class="jadwal-card" data-type="${mapTypeToDataType(schedule.type)}">
          <div class="jadwal-color-block"></div>

          <div class="jadwal-card-info">
            <h4>${schedule.title}</h4>
            <p>${formatDate(schedule.schedule_date)}${schedule.location ? " – " + schedule.location : ""}</p>
          </div>
        </div>
      `;
    });

    jadwalList.appendChild(group);
  });
}

btnSimpan.addEventListener("click", async () => {
  const childID = inputChild.value;
  const jenis = document.getElementById("inputJenis").value;
  const nama = document.getElementById("inputNama").value.trim();
  const lokasi = document.getElementById("inputLokasi").value.trim();
  const tanggal = document.getElementById("inputTanggal").value;
  const waktu = document.getElementById("inputWaktu").value;

  if (!childID) {
    alert("Pilih profile anak dulu");
    return;
  }

  if (!nama) {
    alert("Nama kegiatan wajib diisi");
    return;
  }

  const scheduleDate = `${tanggal}T${waktu}:00+07:00`;

  const payload = {
    child_id: childID,
    title: nama,
    type: mapInputType(jenis),
    schedule_date: scheduleDate,
    location: lokasi,
  };

  const res = await fetch(`${API_BASE_URL}/schedules`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    alert(result.errors || result.message || "Gagal menambahkan jadwal");
    return;
  }

  document.getElementById("inputNama").value = "";
  document.getElementById("inputLokasi").value = "";

  modal.classList.remove("active");
  loadSchedules();
});

async function initJadwalPage() {
  if (!token) {
    alert("Silakan login dulu");
    window.location.href = "login.html";
    return;
  }

  await loadChildren();
  await loadSchedules();
}

initJadwalPage();