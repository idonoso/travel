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

    initSortableTables();
    initTableFilters();
    initTaskPersistence();
});

function initTaskPersistence() {
    const page = document.body.dataset.page || "page";
    document.querySelectorAll(".task-list input[type='checkbox'][data-task-id]").forEach((checkbox) => {
        const key = `travel:${page}:${checkbox.dataset.taskId}`;
        try {
            const saved = localStorage.getItem(key);
            if (saved !== null) checkbox.checked = saved === "1";
        } catch (e) {
            /* localStorage no disponible (modo privado, etc.) */
        }
        checkbox.addEventListener("change", () => {
            try {
                localStorage.setItem(key, checkbox.checked ? "1" : "0");
            } catch (e) {
                /* localStorage no disponible (modo privado, etc.) */
            }
        });
    });
}

function normalizeSearchText(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
}

function initSortableTables() {
    document.querySelectorAll("table[data-sortable]").forEach((table) => {
        table.querySelectorAll("thead th[data-sort-key]").forEach((th) => {
            th.classList.add("sortable");
            th.addEventListener("click", () => sortTableByColumn(table, th));
        });
    });
}

function sortTableByColumn(table, th) {
    const key = th.dataset.sortKey;
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    const ascending = th.dataset.sortDir !== "asc";
    table.querySelectorAll("thead th").forEach((h) => {
        delete h.dataset.sortDir;
        h.classList.remove("sort-asc", "sort-desc");
    });
    th.dataset.sortDir = ascending ? "asc" : "desc";
    th.classList.add(ascending ? "sort-asc" : "sort-desc");

    const collator = new Intl.Collator("es", { sensitivity: "base" });
    const rows = Array.from(tbody.querySelectorAll("tr"));
    rows.sort((a, b) => {
        const aVal = a.dataset[key] || "";
        const bVal = b.dataset[key] || "";
        return ascending ? collator.compare(aVal, bVal) : collator.compare(bVal, aVal);
    });
    rows.forEach((row) => tbody.appendChild(row));
}

function initTableFilters() {
    document.querySelectorAll("input[data-table-filter]").forEach((input) => {
        const tables = input.dataset.tableFilter
            .split(",")
            .map((id) => document.getElementById(id.trim()))
            .filter(Boolean);
        if (!tables.length) return;

        input.addEventListener("input", () => {
            const term = normalizeSearchText(input.value.trim());
            tables.forEach((table) => {
                const emptyMessage = table.parentElement.querySelector(".empty-filter");
                let visibleCount = 0;
                table.querySelectorAll("tbody tr").forEach((row) => {
                    const haystack = normalizeSearchText(`${row.dataset.name || ""} ${row.dataset.region || ""} ${row.dataset.country || ""}`);
                    const visible = haystack.includes(term);
                    row.hidden = !visible;
                    if (visible) visibleCount += 1;
                });
                if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
            });
        });
    });
}
