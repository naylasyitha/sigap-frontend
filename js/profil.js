document.addEventListener('DOMContentLoaded', () => {

  // ── HAMBURGER MOBILE ──
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('active');
      }
    });
  }

  // ── DROPDOWN PROFIL ANAK LAIN ──
  const selectorCard = document.getElementById('childSelectorCard');
  const selectorToggle = document.getElementById('childSelectorToggle');
  const profilAnakDropdown = document.getElementById('profilAnakDropdown');
  const dropdownArrow = document.getElementById('dropdownArrow');

  function closeProfilAnakDropdown() {
    profilAnakDropdown?.classList.remove('open');
    dropdownArrow?.classList.remove('open');
    selectorCard?.classList.remove('dropdown-anak-open');
  }

  function toggleProfilAnakDropdown() {
    profilAnakDropdown?.classList.toggle('open');
    dropdownArrow?.classList.toggle('open');
    selectorCard?.classList.toggle('dropdown-anak-open');
  }

  if (selectorToggle && profilAnakDropdown) {
    selectorToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleProfilAnakDropdown();
    });
  }

  selectorCard?.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', () => {
    closeProfilAnakDropdown();
  });

  // ── PILIH PROFIL ANAK ──
  document.querySelectorAll('.profil-anak-option').forEach(option => {
    option.addEventListener('click', (e) => {
      const isTambahProfil = option.classList.contains('profil-anak-add');

      if (isTambahProfil) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      document.querySelectorAll('.profil-anak-option').forEach(item => {
        item.classList.remove('active');

        const oldCheck = item.querySelector('.profil-anak-check');
        if (oldCheck) {
          oldCheck.remove();
        }
      });

      option.classList.add('active');

      const check = document.createElement('span');
      check.className = 'profil-anak-check';
      check.innerHTML = `<img src="assets/ceklis.svg" alt="Aktif">`;
      option.appendChild(check);

      const name = option.dataset.name;
      const sub = option.dataset.sub;
      const img = option.dataset.img;

      const activeImg = selectorToggle?.querySelector('.child-avatar-img');
      const activeName = selectorToggle?.querySelector('.child-name');
      const activeSub = selectorToggle?.querySelector('.child-sub');

      if (activeImg && img) {
        activeImg.src = img;
        activeImg.alt = name || 'Profil Anak';
      }

      if (activeName && name) {
        activeName.textContent = name;
      }

      if (activeSub && sub) {
        activeSub.textContent = sub;
      }

      closeProfilAnakDropdown();
    });
  });

  // ── MODAL INPUT DATA ──
  const editModal = document.getElementById('editModal');
  const closeEditBtn = document.getElementById('closeEditBtn');

  ['openEditBtn', 'openEditBtn2'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      editModal?.classList.add('open');
    });
  });

  closeEditBtn?.addEventListener('click', () => {
    editModal?.classList.remove('open');
  });

  editModal?.addEventListener('click', (e) => {
    if (e.target === editModal) {
      editModal.classList.remove('open');
    }
  });

  document.getElementById('editForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Data pengukuran berhasil disimpan! ✓');
    editModal?.classList.remove('open');
  });

  document.getElementById('btnHapus')?.addEventListener('click', () => {
    if (confirm('Hapus profil ini? Tindakan tidak dapat dibatalkan.')) {
      showToast('Profil dihapus.', 'error');
      editModal?.classList.remove('open');
    }
  });

  // ── MODAL TAMBAH PROFIL ANAK ──
  const tambahProfilModal = document.getElementById('tambahProfilModal');
  const closeTambahProfilBtn = document.getElementById('closeTambahProfilBtn');

  ['openTambahProfilBtn', 'openTambahProfilBtn2'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      closeProfilAnakDropdown();
      tambahProfilModal?.classList.add('open');
    });
  });

  closeTambahProfilBtn?.addEventListener('click', () => {
    tambahProfilModal?.classList.remove('open');
  });

  tambahProfilModal?.addEventListener('click', (e) => {
    if (e.target === tambahProfilModal) {
      tambahProfilModal.classList.remove('open');
    }
  });

  document.getElementById('tambahProfilForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = e.target;
    const namaAnak = form.namaAnak?.value.trim() || 'Profil Anak Baru';
    const jenisKelamin = form.querySelector('input[name="jenisKelamin"]:checked')?.value || 'perempuan';

    const umurText = '0 bulan';
    const genderText = jenisKelamin === 'laki' ? 'Laki-laki' : 'Perempuan';
    const imgSrc = jenisKelamin === 'laki'
      ? 'assets/laki laki.svg'
      : 'assets/perempuan.svg';

    tambahProfilBaru(namaAnak, umurText, genderText, imgSrc);

    showToast('Profil anak berhasil ditambahkan! ✓');
    tambahProfilModal?.classList.remove('open');
    form.reset();

    form.querySelectorAll('.gender-option').forEach(item => {
      item.classList.remove('selected');
    });

    form.querySelector('.gender-option[data-gender="perempuan"]')?.classList.add('selected');

    const perempuanRadio = form.querySelector('input[value="perempuan"]');
    if (perempuanRadio) {
      perempuanRadio.checked = true;
    }
  });

  document.getElementById('btnHapusTambah')?.addEventListener('click', () => {
    if (confirm('Hapus profil ini?')) {
      showToast('Profil dihapus.', 'error');
      tambahProfilModal?.classList.remove('open');
    }
  });

  // ── TAMBAH PROFIL BARU KE DROPDOWN ──
  function tambahProfilBaru(nama, umur, gender, imgSrc) {
    const addButton = document.querySelector('.profil-anak-add');

    if (!profilAnakDropdown || !addButton) {
      return;
    }

    const newOption = document.createElement('div');
    newOption.className = 'profil-anak-option';
    newOption.dataset.name = nama;
    newOption.dataset.sub = `${umur} · ${gender}`;
    newOption.dataset.img = imgSrc;

    newOption.innerHTML = `
      <img src="${imgSrc}" alt="${nama}" class="profil-anak-avatar">

      <div class="profil-anak-text">
        <span class="profil-anak-name">${nama}</span>
        <span class="profil-anak-sub">${umur} . ${gender}</span>
      </div>
    `;

    profilAnakDropdown.insertBefore(newOption, addButton);

    newOption.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      document.querySelectorAll('.profil-anak-option').forEach(item => {
        item.classList.remove('active');

        const oldCheck = item.querySelector('.profil-anak-check');
        if (oldCheck) {
          oldCheck.remove();
        }
      });

      newOption.classList.add('active');

      const check = document.createElement('span');
      check.className = 'profil-anak-check';
      check.innerHTML = `<img src="assets/ceklis.svg" alt="Aktif">`;
      newOption.appendChild(check);

      const activeImg = selectorToggle?.querySelector('.child-avatar-img');
      const activeName = selectorToggle?.querySelector('.child-name');
      const activeSub = selectorToggle?.querySelector('.child-sub');

      if (activeImg) {
        activeImg.src = imgSrc;
        activeImg.alt = nama;
      }

      if (activeName) {
        activeName.textContent = nama;
      }

      if (activeSub) {
        activeSub.textContent = `${umur} · ${gender}`;
      }

      closeProfilAnakDropdown();
    });
  }

  // ── GENDER TOGGLE ──
  document.querySelectorAll('.gender-row').forEach(row => {
    row.querySelectorAll('.gender-option').forEach(option => {
      option.addEventListener('click', () => {
        row.querySelectorAll('.gender-option').forEach(item => {
          item.classList.remove('selected');
        });

        option.classList.add('selected');

        const input = option.querySelector('input[type="radio"]');
        if (input) {
          input.checked = true;
        }
      });
    });
  });

  // ── ESC CLOSE ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProfilAnakDropdown();
      editModal?.classList.remove('open');
      tambahProfilModal?.classList.remove('open');
    }
  });

  // ── TOAST HELPER ──
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;

    toast.style.cssText = `
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%) translateY(16px);
      background: ${type === 'error' ? '#c0392b' : '#155740'};
      color: white;
      padding: 12px 24px;
      border-radius: 999px;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 13px;
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s;
      white-space: nowrap;
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2800);
  }

});