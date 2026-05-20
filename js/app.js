document.addEventListener('DOMContentLoaded', () => {

  // SIDEBAR MOBILE
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');

  if (sidebar) {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
    function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
    overlay.addEventListener('click', closeSidebar);
  }

  // DROPDOWN ANAK
  const selectorToggle = document.getElementById('childSelectorToggle');
  const childDropdown = document.getElementById('childDropdown');
  const dropdownArrow = document.getElementById('dropdownArrow');

  if (selectorToggle) {
    selectorToggle.addEventListener('click', () => {
      childDropdown.classList.toggle('open');
      dropdownArrow.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!document.getElementById('childSelectorCard')?.contains(e.target)) {
        childDropdown?.classList.remove('open');
        dropdownArrow?.classList.remove('open');
      }
    });
  }

  // MODAL EDIT
  const editModal = document.getElementById('editModal');
  const closeEditBtn = document.getElementById('closeEditBtn');

  ['openEditBtn', 'openEditBtn2'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => editModal?.classList.add('open'));
  });
  closeEditBtn?.addEventListener('click', () => editModal?.classList.remove('open'));
  editModal?.addEventListener('click', (e) => { if (e.target === editModal) editModal.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') editModal?.classList.remove('open'); });

  // GENDER RADIO
  document.querySelectorAll('.gender-option').forEach(label => {
    label.addEventListener('click', () => {
      document.querySelectorAll('.gender-option').forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
    });
  });

  // FORM SUBMIT
  document.getElementById('editForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Profil berhasil disimpan! ✓');
    editModal?.classList.remove('open');
  });

  // HAPUS
  document.getElementById('btnHapus')?.addEventListener('click', () => {
    if (confirm('Hapus profil ini? Tidak dapat dibatalkan.')) {
      showToast('Profil dihapus.', 'error');
      editModal?.classList.remove('open');
    }
  });

  // TOAST
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(16px);
      background:${type === 'error' ? '#c0392b' : '#155740'};
      color:white; padding:12px 24px; border-radius:30px;
      font-family:'Poppins',sans-serif; font-weight:600; font-size:13px;
      box-shadow:0 6px 24px rgba(0,0,0,0.2); z-index:9999;
      opacity:0; transition:all 0.3s; white-space:nowrap;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; });
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2800);
  }

});