(() => {
  const root = document.documentElement;
  const appearanceButton = document.querySelector(".appearance");
  const clock = document.querySelector(".menu-clock");
  const dateLabel = clock.querySelector(".menu-date");
  const timeLabel = clock.querySelector(".menu-time");
  const dateFormat = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

  function updateClock() {
    const now = new Date();
    clock.dateTime = now.toISOString();
    dateLabel.textContent = dateFormat.format(now);
    timeLabel.textContent = timeFormat.format(now);
    setTimeout(updateClock, 60000 - now.getTime() % 60000);
  }

  function showAppearance() {
    const action = root.dataset.look === "dark" ? "밝은 화면으로 전환" : "어두운 화면으로 전환";
    appearanceButton.setAttribute("aria-label", action);
    appearanceButton.title = action;
  }

  updateClock();
  clock.hidden = false;
  showAppearance();
  appearanceButton.hidden = false;
  appearanceButton.addEventListener("click", () => {
    root.dataset.look = root.dataset.look === "dark" ? "light" : "dark";
    showAppearance();
    try { localStorage.setItem("portfolio-appearance", root.dataset.look); } catch {}
  });

  const space = document.querySelector(".workspace");
  const windows = new Map(Array.from(space.querySelectorAll("[data-window]"), win => [win.dataset.window, win]));
  if (!windows.size) return; // Article pages use their ordinary navigation links.

  const dock = document.querySelector(".dock");
  const links = new Map(Array.from(dock.querySelectorAll("[data-open]"), link => [link.dataset.open, link]));
  const currentLabel = document.querySelector(".current-app");
  const status = document.querySelector("[role=status]");
  const narrow = matchMedia("(max-width: 590px)");
  const siteTitle = document.body.dataset.siteTitle;
  let order = [];
  let running = new Set();
  let drag = null;

  function moveTo(win, x, y) {
    const left = Math.max(0, Math.min(x, space.clientWidth - win.offsetWidth));
    const top = Math.max(0, Math.min(y, space.clientHeight - win.offsetHeight));
    win.style.setProperty("--moved-x", left + "px");
    win.style.setProperty("--moved-y", top + "px");
  }

  function keepInBounds(win) {
    if (narrow.matches || win.hidden || win.dataset.large === "true" || !win.style.getPropertyValue("--moved-x")) return;
    moveTo(win, win.offsetLeft, win.offsetTop);
  }

  function render() {
    const front = order.at(-1);
    for (const [id, win] of windows) {
      const index = order.indexOf(id);
      win.hidden = index < 0;
      win.dataset.front = String(id === front);
      win.style.zIndex = String(index + 1);
      const link = links.get(id);
      link.dataset.running = String(running.has(id));
      if (id === front) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
      const large = win.dataset.large === "true";
      const zoom = win.querySelector('[data-control="zoom"]');
      zoom.setAttribute("aria-pressed", String(large));
      zoom.setAttribute("aria-label", link.dataset.title + (large ? " 창 원래 크기로" : " 창 크게 보기"));
      keepInBounds(win);
    }
    currentLabel.textContent = front ? links.get(front).querySelector(".dock-label").textContent : "Desktop";
    document.title = links.get(front || "home").dataset.title + " · " + siteTitle;
  }

  function recordNavigation() {
    const target = links.get(order.at(-1) || "home");
    const state = { portfolio: { order: [...order], running: [...running] } };
    if (target.pathname === location.pathname) {
      history.replaceState(state, "");
    } else {
      history.pushState(state, "", target.href);
    }
  }

  function restoreNavigation(state) {
    const saved = state?.portfolio;
    if (Array.isArray(saved?.order) && Array.isArray(saved?.running)) {
      order = [...new Set(saved.order.filter(id => windows.has(id)))];
      running = new Set([...saved.running.filter(id => windows.has(id)), ...order]);
    } else {
      const path = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "");
      const match = [...links.values()].find(link => link.pathname.replace(/\/$/, "") === path);
      const id = match?.dataset.open || document.body.dataset.initial;
      order = id === "home" || !windows.has(id) ? ["home"] : ["home", id];
      running = new Set(order);
    }
    render();
  }

  function activate(id) {
    if (order.at(-1) === id) return;
    running.add(id);
    order = order.filter(previous => previous !== id);
    order.push(id);
    render();
    recordNavigation();
  }

  function dismiss(id, close) {
    order = order.filter(previous => previous !== id);
    if (close) {
      running.delete(id);
      const win = windows.get(id);
      delete win.dataset.large;
      win.style.removeProperty("--moved-x");
      win.style.removeProperty("--moved-y");
    }
    render();
    recordNavigation();
    const link = links.get(id);
    link.focus({ preventScroll: true });
    status.textContent = link.dataset.title + (close ? " 창을 닫았습니다." : " 창을 최소화했습니다.");
  }

  function maximize(win) {
    win.dataset.large = String(win.dataset.large !== "true");
    render();
  }

  root.classList.add("enhanced");
  for (const win of windows.values()) {
    win.querySelector(".window-controls").hidden = false;
    win.tabIndex = -1;
  }
  restoreNavigation(history.state);
  window.addEventListener("popstate", event => restoreNavigation(event.state));

  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-open]");
    if (link) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = link.dataset.open;
      if (!windows.has(id)) return;
      event.preventDefault();
      if (dock.contains(link) && order.at(-1) === id) {
        dismiss(id, false);
      } else {
        activate(id);
        windows.get(id).focus({ preventScroll: true });
        status.textContent = links.get(id).dataset.title + " 창을 열었습니다.";
      }
      return;
    }
    const control = event.target.closest("[data-control]");
    if (!control) return;
    const win = control.closest("[data-window]");
    if (control.dataset.control === "zoom") maximize(win);
    else dismiss(win.dataset.window, control.dataset.control === "close");
  });

  space.addEventListener("focusin", event => {
    const win = event.target.closest("[data-window]");
    if (win && !win.hidden) activate(win.dataset.window);
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !order.length) return;
    dismiss(order.at(-1), true);
    event.preventDefault();
  });

  space.addEventListener("pointerdown", event => {
    const win = event.target.closest("[data-window]");
    if (!win || event.button !== 0 || !event.isPrimary) return;
    activate(win.dataset.window);
    const bar = event.target.closest(".titlebar");
    if (!bar || event.target.closest("button") || win.dataset.large === "true" || narrow.matches) return;
    const rect = win.getBoundingClientRect();
    drag = { id: event.pointerId, win, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
    bar.setPointerCapture(event.pointerId);
  });
  space.addEventListener("pointermove", event => {
    if (!drag || drag.id !== event.pointerId) return;
    const area = space.getBoundingClientRect();
    moveTo(drag.win, event.clientX - area.left - drag.dx, event.clientY - area.top - drag.dy);
  });
  space.addEventListener("lostpointercapture", () => { drag = null; });
  space.addEventListener("dblclick", event => {
    const bar = event.target.closest(".titlebar");
    if (bar && !event.target.closest("button") && !narrow.matches) maximize(bar.closest("[data-window]"));
  });
  new ResizeObserver(() => {
    for (const win of windows.values()) keepInBounds(win);
  }).observe(space);
})();
