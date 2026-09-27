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

    renderVisitedAggregates();
});

function renderVisitedAggregates() {
    const countryBlocks = document.querySelectorAll(".country-block");
    if (!countryBlocks.length) return;

    const STATUS_LABELS = {
        "quiere-volver": "Quiere volver",
        "visto-todo": "Visto todo",
        "falta-por-ver": "Le falta por ver",
    };

    const parsePersonaCell = (cell) => {
        const badge = cell.querySelector(".persona-badge");
        if (!badge) return null;
        const metaText = cell.querySelector(".persona-meta")?.textContent || "";
        let year = null;
        let score = null;
        metaText.split("·").map((part) => part.trim()).forEach((part) => {
            if (/^\d{4}$/.test(part)) year = parseInt(part, 10);
            else if (/^\d+(\.\d+)?\/10$/.test(part)) score = parseFloat(part);
        });
        return { status: badge.dataset.status, year, score };
    };

    const combineStatus = (entries) => {
        if (entries.some((e) => e.status === "falta-por-ver")) return "falta-por-ver";
        if (entries.some((e) => e.status === "quiere-volver")) return "quiere-volver";
        if (entries.some((e) => e.status === "visto-todo")) return "visto-todo";
        return null;
    };

    const formatScore = (score) => (Number.isInteger(score) ? `${score}/10` : `${score.toFixed(1)}/10`);

    const buildAggregate = (entries) => {
        if (!entries.length) return "—";
        const status = combineStatus(entries);
        const years = entries.map((e) => e.year).filter((y) => y !== null);
        const scores = entries.map((e) => e.score).filter((s) => s !== null);
        const metaParts = [years.length ? String(Math.max(...years)) : "Hace mucho"];
        if (scores.length) {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            metaParts.push(formatScore(avg));
        }
        return `<span class="persona-badge" data-status="${status}">${STATUS_LABELS[status]}</span><span class="persona-meta">${metaParts.join(" · ")}</span>`;
    };

    const collectEntries = (rows, personIndex) => {
        const entries = [];
        rows.forEach((row) => {
            const cell = row.children[personIndex];
            if (!cell) return;
            const entry = parsePersonaCell(cell);
            if (entry) entries.push(entry);
        });
        return entries;
    };

    const fillAggregateStats = (container, rows) => {
        if (!container) return;
        const duduSlot = container.querySelector('[data-person="dudu"]');
        const bubuSlot = container.querySelector('[data-person="bubu"]');
        if (duduSlot) duduSlot.innerHTML = `🐻 ${buildAggregate(collectEntries(rows, 1))}`;
        if (bubuSlot) bubuSlot.innerHTML = `🐼 ${buildAggregate(collectEntries(rows, 2))}`;
    };

    document.querySelectorAll(".region-group").forEach((region) => {
        const rows = Array.from(region.querySelectorAll("table.site-table tbody tr"));
        fillAggregateStats(region.querySelector(".region-title .aggregate-stats"), rows);
    });

    countryBlocks.forEach((country) => {
        const rows = Array.from(country.querySelectorAll("table.site-table tbody tr"));
        fillAggregateStats(country.querySelector(".country-title .aggregate-stats"), rows);
    });
}
