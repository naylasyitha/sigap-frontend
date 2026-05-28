const WHO_GIRLS = {
  ages: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  bb: {
    median: [3.2,4.2,5.1,5.8,6.4,6.9,7.3,7.6,7.9,8.2,8.5,8.7,8.9,9.2,9.4,9.6,9.8,10.0,10.2,10.4,10.6,10.9,11.1,11.3,11.5],
    sd_neg: [2.7,3.6,4.3,4.9,5.4,5.8,6.1,6.4,6.7,6.9,7.2,7.4,7.6,7.8,8.0,8.2,8.4,8.6,8.8,9.0,9.2,9.4,9.6,9.8,10.0],
    sd_pos: [3.7,4.8,5.8,6.6,7.3,7.8,8.2,8.6,9.0,9.3,9.6,9.9,10.2,10.5,10.8,11.1,11.4,11.7,12.0,12.3,12.6,12.9,13.2,13.5,13.9]
  },
  tb: {
    median: [49.1,53.7,57.1,59.8,62.1,64.0,65.7,67.3,68.7,70.1,71.5,72.8,74.0,75.2,76.4,77.5,78.6,79.7,80.7,81.7,82.7,83.7,84.6,85.5,86.4],
    sd_neg: [45.6,50.0,53.2,55.8,58.0,59.9,61.5,63.1,64.4,65.7,67.0,68.3,69.4,70.6,71.7,72.8,73.8,74.9,75.8,76.8,77.7,78.6,79.5,80.4,81.3],
    sd_pos: [52.7,57.4,61.1,63.9,66.2,68.2,70.0,71.6,73.1,74.5,75.9,77.3,78.6,79.9,81.1,82.3,83.4,84.6,85.7,86.8,87.8,88.8,89.8,90.7,91.7]
  }
};

const WHO_BOYS = {
  ages: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
  bb: {
    median: [3.3,4.5,5.6,6.4,7.0,7.5,7.9,8.3,8.6,8.9,9.2,9.4,9.6,9.9,10.1,10.3,10.5,10.7,10.9,11.1,11.3,11.5,11.8,12.0,12.2],
    sd_neg: [2.9,3.9,4.9,5.6,6.2,6.7,7.1,7.4,7.7,8.0,8.2,8.4,8.6,8.8,9.0,9.2,9.4,9.6,9.8,10.0,10.2,10.4,10.6,10.8,11.0],
    sd_pos: [3.9,5.1,6.3,7.2,7.8,8.4,8.8,9.2,9.6,9.9,10.2,10.5,10.8,11.1,11.4,11.7,12.0,12.3,12.6,12.9,13.3,13.6,13.9,14.2,14.5]
  },
  tb: {
    median: [49.9,54.7,58.4,61.4,63.9,65.9,67.6,69.2,70.6,72.0,73.3,74.5,75.7,76.9,78.0,79.1,80.2,81.2,82.3,83.2,84.2,85.1,86.0,86.9,87.8],
    sd_neg: [46.1,50.8,54.4,57.3,59.7,61.7,63.3,64.8,66.2,67.5,68.7,69.9,71.0,72.1,73.1,74.1,75.1,76.0,77.0,77.9,78.8,79.7,80.5,81.4,82.2],
    sd_pos: [53.7,58.6,62.4,65.5,68.0,70.1,71.9,73.5,75.0,76.5,77.9,79.2,80.5,81.8,83.0,84.2,85.4,86.5,87.7,88.7,89.8,90.8,91.8,92.7,93.6]
  }
};

const token = localStorage.getItem("token");

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const state = {
  child: null,
  measurements: []
};

let children = [];
let selectedChildIdx = 0;

function getAgeMonths(birthDate, measurementDate = new Date()) {
  const birth = new Date(birthDate);
  const measure = new Date(measurementDate);
  return (
    (measure.getFullYear() - birth.getFullYear()) * 12 +
    (measure.getMonth() - birth.getMonth())
  );
}

function mapGender(gender) {
  return gender === "MALE" ? "M" : "F";
}

let chartBBInstance = null;
let chartTBInstance = null;

const GREEN       = '#155740';
const GREEN_LIGHT = 'rgba(21,87,64,0.12)';
const ORANGE      = '#F5A623';

function getWHO() {
  return state.child.gender === 'M' ? WHO_BOYS : WHO_GIRLS;
}

function buildChildDataset(key) {
  return state.measurements.map(m => ({ x: m.ageMonths, y: m[key] }));
}

async function loadChildren() {
  const res = await fetch(`${API_BASE_URL}/children`, {
    headers: getHeaders(),
  });

  const result = await res.json();

  if (!res.ok || !result.data || result.data.length === 0) {
    alert("Belum ada profil anak.");
    return;
  }

  children = result.data;
  await selectChild(0);

  const profileSelectBox = document.getElementById('profileSelectBox');
  profileSelectBox.style.cursor = 'pointer';
  profileSelectBox.addEventListener('click', async () => {
    selectedChildIdx = (selectedChildIdx + 1) % children.length;
    await selectChild(selectedChildIdx);
  });
}

async function selectChild(idx) {
  const child = children[idx];

  state.child = {
    id: child.id,
    name: child.name,
    firstName: child.name.split(" ")[0],
    ageMonths: getAgeMonths(child.birth_date),
    gender: mapGender(child.gender),
    birthDate: child.birth_date,
  };

  document.getElementById("profileName").textContent = child.name;
  document.getElementById("profileMeta").textContent =
    `${state.child.ageMonths} bulan · ${child.gender === "FEMALE" ? "Perempuan" : "Laki-laki"}`;
  document.getElementById("modalChildName").textContent = state.child.firstName;
  document.getElementById("legendBBName").textContent = state.child.firstName;
  document.getElementById("legendTBName").textContent = state.child.firstName;

  await loadGrowthRecords();
}

// ── LOAD GROWTH RECORDS ──
async function loadGrowthRecords() {
  const res = await fetch(`${API_BASE_URL}/growth-records/child/${state.child.id}`, {
    headers: getHeaders(),
  });

  const result = await res.json();

  state.measurements = (result.data || []).map((item) => ({
    ageMonths: getAgeMonths(state.child.birthDate, item.measurement_date),
    bb: item.weight,
    tb: item.height,
    lk: item.head_circumference,
    date: item.measurement_date,
  }));

  fullUpdate();
}

// ── CHART ──
function makeChart(canvasId, metric, whoKey, yLabel) {
  const who = getWHO();
  const ages = who.ages;
  const sdNeg = who[whoKey].sd_neg;
  const sdPos = who[whoKey].sd_pos;
  const median = who[whoKey].median;
  const childData = buildChildDataset(metric);

  const ctx = document.getElementById(canvasId).getContext('2d');

  if (canvasId === 'chartBB' && chartBBInstance) { chartBBInstance.destroy(); }
  if (canvasId === 'chartTB' && chartTBInstance) { chartTBInstance.destroy(); }

  const latestLabelPlugin = {
    id: `latestLabel_${canvasId}`,
    afterDatasetsDraw(chart) {
      const ds = chart.data.datasets.find(d => d.label === state.child.firstName);
      if (!ds || !ds.data.length) return;
      const meta = chart.getDatasetMeta(chart.data.datasets.indexOf(ds));
      const lastEl = meta.data[meta.data.length - 1];
      if (!lastEl) return;
      const { x, y } = lastEl.getProps(['x','y'], true);
      const ctx = chart.ctx;
      const lastMeasure = state.measurements[state.measurements.length - 1];
      const val = lastMeasure[metric];
      const unit = whoKey === 'bb' ? 'kg' : 'cm';
      const label = `${val}${unit}`;
      ctx.save();
      ctx.fillStyle = ORANGE;
      ctx.font = 'bold 11px Poppins, sans-serif';
      const w = ctx.measureText(label).width + 14;
      const h = 20;
      const rx = x - w / 2, ry = y - 28;
      ctx.beginPath();
      ctx.roundRect(rx, ry, w, h, 6);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, ry + h / 2);
      ctx.restore();
    }
  };

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ages,
      datasets: [
        {
          label: '+1 SD',
          data: sdPos,
          borderColor: 'transparent',
          backgroundColor: GREEN_LIGHT,
          fill: '+1',
          tension: 0.4,
          pointRadius: 0,
          order: 3
        },
        {
          label: 'Normal (median)',
          data: median,
          borderColor: GREEN,
          borderWidth: 2,
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          order: 2
        },
        {
          label: '–1 SD',
          data: sdNeg,
          borderColor: 'transparent',
          backgroundColor: GREEN_LIGHT,
          fill: '-1',
          tension: 0.4,
          pointRadius: 0,
          order: 4
        },
        {
          label: state.child.firstName,
          data: childData,
          borderColor: ORANGE,
          backgroundColor: ORANGE,
          borderWidth: 2.5,
          fill: false,
          tension: 0.35,
          pointRadius: (ctx) => ctx.dataIndex === childData.length - 1 ? 6 : 4,
          pointBackgroundColor: ORANGE,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          parsing: { xAxisKey: 'x', yAxisKey: 'y' },
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 100,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => `Usia: ${items[0].label} bulan`,
            label: (item) => {
              if (item.dataset.label === '–1 SD' || item.dataset.label === '+1 SD') return null;
              const unit = whoKey === 'bb' ? ' kg' : ' cm';
              return `${item.dataset.label}: ${item.formattedValue}${unit}`;
            }
          },
          filter: (item) => item.dataset.label !== '–1 SD' && item.dataset.label !== '+1 SD'
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: 24,
          ticks: {
            stepSize: 6,
            font: { family: 'Poppins', size: 11 },
            color: '#7a9e8e'
          },
          grid: { color: 'rgba(0,0,0,0.05)' },
          title: {
            display: true,
            text: 'usia (bulan)',
            font: { family: 'Poppins', size: 11 },
            color: '#7a9e8e'
          }
        },
        y: {
          ticks: {
            font: { family: 'Poppins', size: 11 },
            color: '#7a9e8e'
          },
          grid: { color: 'rgba(0,0,0,0.05)' },
          title: {
            display: true,
            text: yLabel,
            font: { family: 'Poppins', size: 10 },
            color: '#7a9e8e'
          }
        }
      }
    },
    plugins: [latestLabelPlugin]
  });  

  if (canvasId === 'chartBB') chartBBInstance = chart;
  if (canvasId === 'chartTB') chartTBInstance = chart;

  return chart;
}

// ── STATUS ──
function assessStatus() {
  if (!state.measurements.length) return {
    cls: 'status-warn',
    title: 'Belum Ada Data',
    desc: 'Silakan input data pengukuran anak terlebih dahulu.'
  };

  const last = state.measurements[state.measurements.length - 1];
  const who  = getWHO();
  const idx  = who.ages.indexOf(last.ageMonths) !== -1
    ? who.ages.indexOf(last.ageMonths)
    : who.ages.length - 1;

  const bbOk = last.bb >= who.bb.sd_neg[idx];
  const tbOk = last.tb >= who.tb.sd_neg[idx];

  if (bbOk && tbOk) return {
    cls: 'status-good',
    title: 'Status Gizi Normal',
    desc: 'Berat dan tinggi badan anak berada dalam rentang normal sesuai standar WHO. Pertahankan pola makan dan aktivitas si kecil!'
  };

  if (!bbOk && !tbOk) return {
    cls: 'status-alert',
    title: 'Perlu Perhatian Khusus',
    desc: 'Berat dan tinggi badan anak berada di bawah standar WHO. Segera konsultasikan ke dokter atau posyandu terdekat.'
  };

  return {
    cls: 'status-warn',
    title: 'Status Gizi Cukup Baik',
    desc: 'Berat dan tinggi badan anak berada dalam rentang sedikit rendah dari normal. Perhatikan kembali asupan gizinya!'
  };
}

function updateStats() {
  if (!state.measurements.length) {
    document.getElementById('statBB').textContent = '-';
    document.getElementById('statTB').textContent = '-';
    document.getElementById('statLK').textContent = '-';
    return;
  }
  const last = state.measurements[state.measurements.length - 1];
  document.getElementById('statBB').textContent = last.bb;
  document.getElementById('statTB').textContent = last.tb;
  document.getElementById('statLK').textContent = last.lk || '-';
}

function updateStatus() {
  const s = assessStatus();
  const banner = document.getElementById('statusBanner');
  banner.className = `grafik-status-banner ${s.cls}`;
  document.getElementById('statusTitle').textContent = s.title;
  document.getElementById('statusDesc').textContent  = s.desc;
}

function updateCharts() {
  chartBBInstance = makeChart('chartBB', 'bb', 'bb', 'kg');
  chartTBInstance = makeChart('chartTB', 'tb', 'tb', 'cm');
}

function fullUpdate() {
  updateStats();
  updateStatus();
  updateCharts();
}

const modal     = document.getElementById('modalInputData');
const btnInput  = document.getElementById('btnInputData');
const btnBatal  = document.getElementById('btnBatal');
const btnSimpan = document.getElementById('btnSimpan');

btnInput.addEventListener('click', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('inputTanggal').value = today;
  modal.classList.add('active');
});

btnBatal.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

btnSimpan.addEventListener("click", async () => {
  const bb  = parseFloat(document.getElementById("inputBB").value);
  const tb  = parseFloat(document.getElementById("inputTB").value);
  const lk  = parseFloat(document.getElementById("inputLK").value);
  const tgl = document.getElementById("inputTanggal").value;

  const bbError  = document.querySelector("#bb-error");
  const tbError  = document.querySelector("#tb-error");
  const lkError  = document.querySelector("#lk-error");
  const tglError = document.querySelector("#tgl-error");

  let adaError = false;

  if (!tgl) {
    tglError.textContent = "Tanggal pengukuran wajib diisi!";
    tglError.style.display = "block";
    adaError = true;
  } else {
    tglError.style.display = "none";
  }

  if (!document.getElementById("inputBB").value || isNaN(bb) || bb <= 0) {
    bbError.textContent = "Berat badan harus lebih dari 0 kg!";
    bbError.style.display = "block";
    adaError = true;
  } else {
    bbError.style.display = "none";
  }

  if (!document.getElementById("inputTB").value || isNaN(tb) || tb <= 0) {
    tbError.textContent = "Tinggi badan harus lebih dari 0 cm!";
    tbError.style.display = "block";
    adaError = true;
  } else {
    tbError.style.display = "none";
  }

  if (document.getElementById("inputLK").value && (isNaN(lk) || lk <= 0)) {
    lkError.textContent = "Lingkar kepala harus lebih dari 0 cm!";
    lkError.style.display = "block";
    adaError = true;
  } else {
    lkError.style.display = "none";
  }

  if (adaError) return;

  const payload = {
    child_id: state.child.id,
    weight: bb,
    height: tb,
    head_circumference: lk || 0,
    measurement_date: `${tgl}T00:00:00+07:00`,
  };

  const res = await fetch(`${API_BASE_URL}/growth-records`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    alert(result.errors || result.message || "Gagal menyimpan data");
    return;
  }

  document.getElementById("inputBB").value = "";
  document.getElementById("inputTB").value = "";
  document.getElementById("inputLK").value = "";
  modal.classList.remove("active");

  await loadGrowthRecords();
});

[
  { inputId: "#inputBB",  errorId: "#bb-error"  },
  { inputId: "#inputTB",  errorId: "#tb-error"  },
  { inputId: "#inputLK",  errorId: "#lk-error"  },
  { inputId: "#inputTanggal", errorId: "#tgl-error" },
].forEach(({ inputId, errorId }) => {
  document.querySelector(inputId)?.addEventListener("input", function () {
    document.querySelector(errorId).style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  if (!token) {
    alert("Silakan login dulu");
    window.location.href = "login.html";
    return;
  }

  await loadChildren();
});