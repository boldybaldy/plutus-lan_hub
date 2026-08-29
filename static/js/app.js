function setupIpBadgeQr() {
    const badgeWrap = document.getElementById('ipBadgeWrap');
    const badge = document.getElementById('ipBadge');
    const image = document.getElementById('ipQrImage');
    const popover = document.getElementById('ipQrPopover');

    if (!badgeWrap || !badge || !image || !popover) {
        return;
    }

    const url = badge.dataset.ipUrl || badge.innerText.trim();

    const renderQr = () => {
        if (!url) {
            return;
        }

        badgeWrap.classList.add('is-visible');
        popover.hidden = false;
        image.src = `/qr?url=${encodeURIComponent(url)}`;
        image.alt = `QR code for ${url}`;
    };

    const hideQr = () => {
        badgeWrap.classList.remove('is-visible');
        popover.hidden = true;
    };

    badge.addEventListener('mouseenter', renderQr);
    badge.addEventListener('focus', renderQr);
    badge.addEventListener('mouseleave', hideQr);
    badge.addEventListener('blur', hideQr);
    badge.addEventListener('click', (event) => {
        event.preventDefault();
        const isVisible = badgeWrap.classList.contains('is-visible');
        if (isVisible) {
            hideQr();
        } else {
            renderQr();
        }
    });

    document.addEventListener('click', (event) => {
        if (!badgeWrap.contains(event.target)) {
            hideQr();
        }
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('themeMode', theme);

    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.innerText = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function copyToClipboard() {
    const textarea = document.getElementById('sharedText');
    if (!textarea) {
        return;
    }

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const hasSelection = end > start;
    const textToCopy = hasSelection ? textarea.value.slice(start, end) : textarea.value;

    const showCopiedState = () => {
        const btn = document.getElementById('copyBtn');
        if (!btn) {
            return;
        }

        const originalText = btn.innerText;
        btn.innerText = 'Copied';
        setTimeout(() => {
            btn.innerText = originalText;
            syncCopyButtonLabel();
        }, 2000);
    };

    const fallbackCopy = () => {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;
        tempTextArea.setAttribute('readonly', '');
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.left = '-9999px';
        document.body.appendChild(tempTextArea);
        tempTextArea.select();

        try {
            document.execCommand('copy');
            showCopiedState();
        } finally {
            document.body.removeChild(tempTextArea);
        }
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy)
            .then(showCopiedState)
            .catch(fallbackCopy);
    } else {
        fallbackCopy();
    }
}

function syncCopyButtonLabel() {
    const textarea = document.getElementById('sharedText');
    const btn = document.getElementById('copyBtn');

    if (!textarea || !btn) {
        return;
    }

    const hasSelection = (textarea.selectionEnd ?? 0) > (textarea.selectionStart ?? 0);
    btn.innerText = hasSelection ? 'Copy selected text' : 'Copy to Clipboard';
}

function setView(mode) {
    const container = document.getElementById('fileContainer');
    const btnList = document.getElementById('btnList');
    const btnGrid = document.getElementById('btnGrid');

    if (!container || !btnList || !btnGrid) {
        return;
    }

    if (mode === 'grid') {
        container.className = 'file-container grid-view';
        btnGrid.classList.add('active');
        btnList.classList.remove('active');
        localStorage.setItem('viewMode', 'grid');
    } else {
        container.className = 'file-container list-view';
        btnList.classList.add('active');
        btnGrid.classList.remove('active');
        localStorage.setItem('viewMode', 'list');
    }
}

function openPreview(src, name) {
    const modal = document.getElementById('previewModal');
    const image = document.getElementById('previewImage');
    const title = document.getElementById('previewName');

    if (!modal || !image || !title) {
        return;
    }

    image.src = src;
    image.alt = name;
    title.innerText = name;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    const image = document.getElementById('previewImage');

    if (!modal || !image) {
        return;
    }

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    image.src = '';
}

function applyFileLogos() {
    const extensionLogos = {
        pdf: 'PDF',
        doc: 'DOC',
        docx: 'DOCX',
        xls: 'XLS',
        xlsx: 'XLSX',
        ppt: 'PPT',
        pptx: 'PPTX',
        csv: 'CSV',
        txt: 'TXT',
        md: 'MD',
        zip: 'ZIP',
        rar: 'RAR',
        '7z': '7Z',
        tar: 'TAR',
        gz: 'GZ',
        mp4: 'MP4',
        mkv: 'MKV',
        mov: 'MOV',
        mp3: 'MP3',
        wav: 'WAV',
        flac: 'FLAC',
        py: 'PY',
        js: 'JS',
        ts: 'TS',
        html: 'HTML',
        css: 'CSS',
        json: 'JSON',
        exe: 'EXE',
        apk: 'APK',
    };

    document.querySelectorAll('.file-logo[data-ext]').forEach((node) => {
        const ext = (node.dataset.ext || '').toLowerCase();
        const logo = extensionLogos[ext] || ext.slice(0, 4).toUpperCase() || 'FILE';
        node.innerText = logo;
    });
}

function showToast(title, message, kind = 'info') {
    const stack = document.getElementById('toastStack');
    if (!stack) {
        return;
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.dataset.kind = kind;
    toast.innerHTML = `
        <div>
            <strong>${title}</strong>
            <span>${message}</span>
        </div>
    `;
    stack.appendChild(toast);

    window.setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
    }, 2600);

    window.setTimeout(() => {
        toast.remove();
    }, 3000);
}

async function uploadSelectedFile(file) {
    if (!file) {
        showToast('No file selected', 'Choose a file or drag one into the drop zone.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.disabled = true;
        uploadBtn.innerText = 'Uploading...';
    }

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        const payload = await response.json();
        if (!response.ok || !payload.ok) {
            throw new Error(payload.message || 'Upload failed');
        }

        showToast('Upload complete', `${payload.filename} was added successfully.`, 'success');
        window.setTimeout(() => {
            window.location.reload();
        }, 500);
    } catch (error) {
        showToast('Upload failed', error.message || 'Please try again.', 'error');
    } finally {
        if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.innerText = 'Upload File';
        }
    }
}

const previewModal = document.getElementById('previewModal');
if (previewModal) {
    previewModal.addEventListener('click', (event) => {
        if (event.target === previewModal) {
            closePreview();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closePreview();
    }
});

document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-preview-src]');
    if (!trigger) {
        return;
    }

    const src = trigger.getAttribute('data-preview-src');
    const name = trigger.getAttribute('data-preview-name') || 'Preview';
    if (src) {
        openPreview(src, name);
    }
});

const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');

if (uploadForm && fileInput && dropZone) {
    uploadForm.addEventListener('submit', (event) => {
        event.preventDefault();
        uploadSelectedFile(fileInput.files[0]);
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
        dropZone.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
            dropZone.classList.add('dragover');
        });
    });

    ['dragleave', 'dragend', 'drop'].forEach((eventName) => {
        dropZone.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
            dropZone.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', (event) => {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            fileInput.files = files;
            uploadSelectedFile(files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
            showToast('File selected', fileInput.files[0].name, 'info');
        }
    });
}

setupIpBadgeQr();

const savedTheme = localStorage.getItem('themeMode');
if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme);
} else {
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(systemDark ? 'dark' : 'light');
}

const savedView = localStorage.getItem('viewMode') || 'list';
setView(savedView);
applyFileLogos();

const textarea = document.getElementById('sharedText');
let currentVersion = Number(document.body?.dataset.appVersion || 0);

if (textarea) {
    ['select', 'keyup', 'mouseup', 'touchend', 'input', 'focus', 'blur'].forEach((eventName) => {
        textarea.addEventListener(eventName, syncCopyButtonLabel);
    });
    document.addEventListener('selectionchange', syncCopyButtonLabel);
    syncCopyButtonLabel();
}

setInterval(async () => {
    try {
        const res = await fetch('/status');
        const data = await res.json();
        if (data.version !== currentVersion && document.activeElement !== textarea) {
            window.location.reload();
        }
    } catch (err) {
        console.error('Server check failed', err);
    }
}, 2000);
