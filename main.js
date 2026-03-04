// ---------- Helpers ----------
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// ---------- Mobile nav ----------
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

navToggle?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

// Close menu on link click (mobile)
$$(".nav__link").forEach((a) => {
  a.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

// ---------- Active section link ----------
const sections = ["oferta", "admisiones", "vida", "noticias", "eventos", "portales"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const setActiveLink = () => {
  const y = window.scrollY + 120;
  let currentId = "inicio";

  for (const s of sections) {
    if (s.offsetTop <= y) currentId = s.id;
  }

  $$(".nav__link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("is-active", href === `#${currentId}`);
  });
};

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

// ---------- Counters ----------
const counters = $$("[data-counter]");
const animateCounter = (el, to) => {
  const start = 0;
  const duration = 900;
  const t0 = performance.now();

  const step = (t) => {
    const p = clamp((t - t0) / duration, 0, 1);
    const val = Math.round(start + (to - start) * (1 - Math.pow(1 - p, 3)));
    el.textContent = val.toString();
    if (p < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const to = parseInt(e.target.getAttribute("data-counter"), 10) || 0;
        animateCounter(e.target, to);
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.35 }
);

counters.forEach((c) => counterObserver.observe(c));

// ---------- Programs data + rendering ----------
const programs = [
  {
    id: "medicina",
    area: "salud",
    name: "Ciencias de la Salud",
    title: "Licenciatura en Medicina (Ejemplo)",
    desc: "Formación integral con enfoque clínico y científico. Prácticas y laboratorios.",
    bullets: ["Plan actualizado", "Prácticas supervisadas", "Laboratorios"],
    duration: "10 semestres",
    mode: "Presencial",
  },
  {
    id: "enfermeria",
    area: "salud",
    name: "Ciencias de la Salud",
    title: "Licenciatura en Enfermería",
    desc: "Competencias clínicas, gestión del cuidado y atención centrada en el paciente.",
    bullets: ["Simulación", "Clínicas", "Servicio social"],
    duration: "8 semestres",
    mode: "Presencial",
  },
  {
    id: "admin",
    area: "negocios",
    name: "Negocios",
    title: "Administración y Dirección",
    desc: "Gestión estratégica, finanzas, talento y liderazgo con enfoque en resultados.",
    bullets: ["Proyectos reales", "Emprendimiento", "Vinculación"],
    duration: "8 semestres",
    mode: "Mixta",
  },
  {
    id: "marketing",
    area: "negocios",
    name: "Negocios",
    title: "Marketing Digital",
    desc: "Estrategia, contenido, analítica y performance para ecosistemas digitales.",
    bullets: ["Analítica", "Campañas", "Portafolio"],
    duration: "8 semestres",
    mode: "Mixta",
  },
  {
    id: "software",
    area: "ingenieria",
    name: "Ingeniería",
    title: "Ingeniería en Software",
    desc: "Arquitectura, desarrollo, calidad, DevOps y proyectos colaborativos.",
    bullets: ["Full-stack", "Calidad", "DevOps"],
    duration: "9 semestres",
    mode: "Presencial",
  },
  {
    id: "industrial",
    area: "ingenieria",
    name: "Ingeniería",
    title: "Ingeniería Industrial",
    desc: "Optimización de procesos, logística, calidad y mejora continua.",
    bullets: ["Lean", "Logística", "Calidad"],
    duration: "9 semestres",
    mode: "Presencial",
  },
  {
    id: "derecho",
    area: "sociales",
    name: "Ciencias Sociales",
    title: "Licenciatura en Derecho",
    desc: "Formación jurídica con práctica en litigio, mediación y marco normativo.",
    bullets: ["Clínica jurídica", "Mediación", "Argumentación"],
    duration: "9 semestres",
    mode: "Mixta",
  },
  {
    id: "psicologia",
    area: "sociales",
    name: "Ciencias Sociales",
    title: "Licenciatura en Psicología",
    desc: "Bases científicas, intervención, evaluación y ética profesional.",
    bullets: ["Evaluación", "Intervención", "Ética"],
    duration: "8 semestres",
    mode: "Presencial",
  },
];

const programGrid = $("#programGrid");
const programFilter = $("#programFilter");
const programSearch = $("#programSearch");

function renderPrograms(list) {
  if (!programGrid) return;

  programGrid.innerHTML = list
    .map((p) => {
      return `
      <button class="card programCard" type="button" data-program="${p.id}">
        <div class="card__meta">
          <span class="pill">${p.name}</span>
          <span class="pill pill--soft">${p.mode}</span>
        </div>
        <h3>${p.title}</h3>
        <p class="muted">${p.desc}</p>
        <p class="tiny muted">Duración: ${p.duration}</p>
        <p class="link">Ver detalles →</p>
      </button>
    `;
    })
    .join("");
}

function applyProgramFilters() {
  const area = programFilter?.value || "all";
  const q = (programSearch?.value || "").trim().toLowerCase();

  const filtered = programs.filter((p) => {
    const okArea = area === "all" ? true : p.area === area;
    const hay = `${p.title} ${p.desc} ${p.name}`.toLowerCase();
    const okQuery = q ? hay.includes(q) : true;
    return okArea && okQuery;
  });

  renderPrograms(filtered);
}

programFilter?.addEventListener("change", applyProgramFilters);
programSearch?.addEventListener("input", applyProgramFilters);
renderPrograms(programs);

// ---------- Modal ----------
const modal = $("#modal");
const modalClose = $("#modalClose");
const modalBody = $("#modalBody");
const modalTitle = $("#modalTitle");
const modalCTA = $("#modalCTA");

function openModal(program) {
  if (!modal) return;
  modalTitle.textContent = program.title;

  modalBody.innerHTML = `
    <p class="muted">${program.desc}</p>
    <div style="margin-top:12px; display:grid; gap:10px;">
      <div class="pill pill--soft">Área: ${program.name}</div>
      <div class="pill pill--soft">Modalidad: ${program.mode}</div>
      <div class="pill pill--soft">Duración: ${program.duration}</div>
    </div>
    <h4 style="margin-top:16px;">Lo que aprenderás</h4>
    <ul style="margin:10px 0 0; padding-left:18px;">
      ${program.bullets.map((b) => `<li>${b}</li>`).join("")}
    </ul>
  `;

  modalCTA?.setAttribute("href", "#admisiones");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  // Accesibilidad: foco
  modalClose?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-program]");
  if (btn) {
    const id = btn.getAttribute("data-program");
    const program = programs.find((p) => p.id === id);
    if (program) openModal(program);
  }

  const close = e.target.closest('[data-close="true"]');
  if (close) closeModal();
});

modalClose?.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---------- Form validation ----------
const form = $("#infoForm");
const toast = $("#formToast");

function setError(name, message) {
  const box = $(`[data-error-for="${name}"]`);
  if (box) box.textContent = message || "";
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  // reset errors
  ["name", "email", "phone", "program"].forEach((k) => setError(k, ""));

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const program = String(data.get("program") || "").trim();

  let ok = true;

  if (name.length < 3) { setError("name", "Ingresa tu nombre (mínimo 3 caracteres)."); ok = false; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { setError("email", "Ingresa un correo válido."); ok = false; }
  if (!/^[0-9+\s()-]{7,}$/.test(phone)) { setError("phone", "Ingresa un teléfono válido."); ok = false; }
  if (!program) { setError("program", "Selecciona una opción."); ok = false; }

  if (!ok) return;

  // Demo (sin backend): mostrar confirmación
  form.reset();
  showToast("Solicitud enviada. Te contactaremos pronto.");
});

// ---------- Footer year ----------
$("#year").textContent = String(new Date().getFullYear());

// ---------- Theme toggle ----------
const btnTheme = $("#btnTheme");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") document.body.setAttribute("data-theme", "light");

btnTheme?.addEventListener("click", () => {
  const isLight = document.body.getAttribute("data-theme") === "light";
  if (isLight) {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
});