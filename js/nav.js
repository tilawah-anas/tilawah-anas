
const menuToggle = document.getElementById("menu-toggle");
const menuClose = document.getElementById("menu-close");
const sidebar = document.getElementById("nav-right");
const overlay = document.getElementById("sidebar-overlay");

function openSidebar() {
  sidebar.classList.add("open");
  overlay.classList.add("show");
  document.body.classList.add("sidebar-open");

  menuToggle.setAttribute("aria-expanded", "true");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
  document.body.classList.remove("sidebar-open");

  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", openSidebar);
menuClose.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);

// Close with Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSidebar();
  }
});

// Close after selecting a navigation link
sidebar.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeSidebar);
});