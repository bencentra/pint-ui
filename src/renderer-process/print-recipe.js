const { ipcRenderer } = require('electron');

const printPdfBtn = document.getElementById('pint-print-recipe');

printPdfBtn.addEventListener('click', () => {
  ipcRenderer.send('print-to-pdf');
});

ipcRenderer.on('wrote-pdf', (event, path) => {
  const message = `Wrote PDF to: ${path}`;
});