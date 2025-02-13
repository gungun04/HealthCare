document.addEventListener('DOMContentLoaded', () => {
    const infoButton = document.getElementById('infoButton');
    const floatingWindow = document.getElementById('floatingWindow');
    const closeButton = document.getElementById('closeButton');

    infoButton.addEventListener('click', () => {
        floatingWindow.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        floatingWindow.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === floatingWindow) {
            floatingWindow.style.display = 'none';
        }
    });
});