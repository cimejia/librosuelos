// URL del archivo PDF
const PDF_URL = 'main.pdf'; // Reemplaza con tu propio PDF
let pdfDoc = null;
let currentPage = 1;
let numPages = 0;

// Referencias al DOM
const flipbookContainer = document.getElementById('flipbook');
const pageInfo = document.getElementById('page-info');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const firstPageButton = document.getElementById('first-page');
const lastPageButton = document.getElementById('last-page');
const goToPageInput = document.getElementById('go-to-page');
const goToButton = document.getElementById('go-to-button');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Cargar PDF
pdfjsLib.getDocument(PDF_URL).promise.then(function (doc_) {
    pdfDoc = doc_;
    numPages = pdfDoc.numPages;
    updatePageInfo();
    renderPage(currentPage);
});

function renderPage(num) {
    if (num < 1 || num > numPages) return;

    flipbookContainer.innerHTML = ''; // Limpiar antes de renderizar

    pdfDoc.getPage(num).then(function (page) {
        const viewport = page.getViewport({ scale: 1.4 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            pageDiv.appendChild(canvas);
            flipbookContainer.appendChild(pageDiv);
        });
    });

    currentPage = num;
    updatePageInfo();
}

// Funciones de navegación
function updatePageInfo() {
    pageInfo.textContent = `${currentPage}/${numPages}`;
}

prevButton.addEventListener('click', () => {
    if (currentPage > 1) renderPage(currentPage - 1);
});

nextButton.addEventListener('click', () => {
    if (currentPage < numPages) renderPage(currentPage + 1);
});

firstPageButton.addEventListener('click', () => {
    renderPage(1);
});

lastPageButton.addEventListener('click', () => {
    renderPage(numPages);
});

goToButton.addEventListener('click', () => {
    const pageNum = parseInt(goToPageInput.value);
    if (pageNum >= 1 && pageNum <= numPages) {
        renderPage(pageNum);
        goToPageInput.value = '';
    } else {
        alert(`Ingresa un número entre 1 y ${numPages}`);
    }
});

goToPageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        goToButton.click();
    }
});

// Pantalla completa
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});
