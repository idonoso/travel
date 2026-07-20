document.addEventListener("DOMContentLoaded", () => {
    const current = document.body.dataset.page;
    if (current) {
        document.querySelectorAll(".topnav-links a").forEach((link) => {
            if (link.dataset.page === current) {
                link.classList.add("active");
            }
        });
    }

    const tabs = document.querySelectorAll(".tab");
    const panels = document.querySelectorAll(".tab-panel");
    if (tabs.length && panels.length) {
        if (!document.querySelector(".tab.active")) {
            tabs[0].classList.add("active");
            panels[0].classList.add("active");
        }
        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const target = tab.dataset.tab;
                tabs.forEach((t) => t.classList.remove("active"));
                panels.forEach((p) => p.classList.remove("active"));
                tab.classList.add("active");
                const panel = document.querySelector(`.tab-panel[data-tab="${target}"]`);
                if (panel) panel.classList.add("active");
            });
        });
    }
});
