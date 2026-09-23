/* =========================================================
   交互与渲染
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. 渲染项目列表 ---------- */
  const list = document.getElementById("projectsList");

  function renderProjects() {
    if (!list) return;
    list.innerHTML = PROJECTS.map((p, i) => {
      const num = String(PROJECTS.length - i).padStart(2, "0"); // 倒序编号
      const techs = p.tech.map((t) => `<li>${t}</li>`).join("");
      const catClass = `cat-${p.category}`;
      return `
      <article class="project project--${p.layout} ${catClass} reveal">
        <div class="project__head">
          <span class="project__num">${num}</span>
          <span class="project__cat">${p.category}</span>
          <span class="project__year">${p.year}</span>
        </div>
        <div class="project__body">
          <figure class="project__media">
            <img src="${p.image}" alt="${p.title} 项目配图" loading="lazy" />
          </figure>
          <div class="project__text">
            <h3 class="project__title">${p.title}</h3>
            ${p.tag ? `<span class="project__tag">${p.tag}</span>` : ""}
            <p class="project__summary">${p.summary}</p>
            <div class="project__divider"></div>
            <ul class="project__tech">${techs}</ul>
            <p class="project__note">${p.note}</p>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  /* ---------- 2. 移动端导航 ---------- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  function closeMenu() {
    toggle.classList.remove("is-open");
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.classList.toggle("is-open");
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* ---------- 3. 滚动：导航吸顶阴影 + 当前区域高亮 ---------- */
  const nav = document.getElementById("nav");
  const sections = ["intro", "works", "about", "contact"].map((id) =>
    document.getElementById(id)
  );
  const links = Array.from(document.querySelectorAll(".nav__link"));

  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);

    let current = "";
    const probe = window.scrollY + window.innerHeight * 0.35;
    sections.forEach((sec) => {
      if (sec && sec.offsetTop <= probe) current = sec.id;
    });
    links.forEach((link) =>
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`)
    );
  }

  /* ---------- 4. 入视口渐显 ---------- */
  function setupReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- 5. 深浅色主题切换 ---------- */
  const THEME_KEY = "theme";
  const themeBtn = document.getElementById("themeToggle");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeBtn) {
      const label = theme === "dark" ? "切换浅色主题" : "切换深色主题";
      themeBtn.setAttribute("aria-label", label);
      themeBtn.title = label;
    }
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* 隐私模式下忽略 */ }
    applyTheme(saved === "dark" ? "dark" : "light");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 忽略 */ }
    });
  }

  /* ---------- 6. 初始化 ---------- */
  initTheme();
  renderProjects();
  setupReveal();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
