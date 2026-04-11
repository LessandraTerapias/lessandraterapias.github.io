document.addEventListener("DOMContentLoaded", () => {
   document.body.style.opacity = 0;

   setTimeout(() => {
       document.body.style.transition = "opacity 1s";
       document.body.style.opacity = 1;
   }, 100);
});

function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}

// Cerrar si haces click fuera
window.onclick = function(e) {
  if (!e.target.matches('.dropdown-btn')) {
    const menu = document.getElementById("menu");
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
    }
  }
}