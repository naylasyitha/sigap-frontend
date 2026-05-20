const modal = document.getElementById('modalTambahJadwal');
const btnTambah = document.getElementById('btnTambahJadwal');
const btnBatal = document.getElementById('btnBatal');
const btnSimpan = document.getElementById('btnSimpan');

btnTambah.addEventListener('click', () => modal.classList.add('active'));
btnBatal.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

btnSimpan.addEventListener('click', () => {
    const jenis = document.getElementById('inputJenis').value;
    const nama = document.getElementById('inputNama').value.trim();
    const tgl = document.getElementById('inputTanggal').value;
    const waktu = document.getElementById('inputWaktu').value;

    if (!nama) {
        alert('Nama kegiatan wajib diisi!');
        return;
    }

    const tglFormatted = new Date(tgl).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    const listEl = document.getElementById('jadwalList');
    let group = listEl.querySelector(`[data-date="${tgl}"]`);

    if (!group) {
        group = document.createElement('div');
        group.className = 'jadwal-group';
        group.setAttribute('data-date', tgl);
        group.innerHTML = `<h2 class="jadwal-group-title">${tglFormatted}</h2>`;
        listEl.appendChild(group);
    }

    const card = document.createElement('div');
    card.className = 'jadwal-card';
    card.setAttribute('data-type', jenis);
    card.innerHTML = `
        <div class="jadwal-color-block"></div>
        <div class="jadwal-card-info">
          <h4>${nama}</h4>
          <p>${tglFormatted}${waktu ? ' – ' + waktu : ''}</p>
        </div>`;
    group.appendChild(card);

    document.getElementById('inputNama').value = '';
    document.getElementById('inputLokasi').value = '';
    modal.classList.remove('active');
});