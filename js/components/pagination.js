// js/components/pagination.js
//
// الاستخدام:
//   const pagination = createPagination({
//       container: document.getElementById('pagination'),
//       pageSize: 9,
//       itemLabel: 'high-performance laptops',
//       onPageChange: () => renderPage()
//   });
//   pagination.setTotal(results.length, { resetPage: true });
//   const pageItems = pagination.paginate(results);

export function createPagination({ container, pageSize = 9, itemLabel = 'items', onPageChange } = {}) {
    if (!container) return null;

    let total = 0;
    let page = 1;

    const totalPages = () => Math.max(1, Math.ceil(total / pageSize));
    const clamp = (n) => Math.min(Math.max(1, Math.trunc(Number(n)) || 1), totalPages());

    // 1 ... 4 5 6 ... 12
    function pageNumbers() {
        const last = totalPages();
        if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

        const pages = [1];
        const start = Math.max(2, page - 1);
        const end = Math.min(last - 1, page + 1);
        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < last - 1) pages.push('...');
        pages.push(last);
        return pages;
    }

    function render() {
        // مفيش نتائج: نخفي الشريط (الصفحة بتعرض رسالة "No products found")
        if (total === 0) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        container.style.display = '';
        const last = totalPages();
        const from = (page - 1) * pageSize + 1;
        const to = Math.min(page * pageSize, total);

        container.innerHTML = `
            <span>Showing <strong>${from}–${to}</strong> of <strong>${total}</strong> ${itemLabel}</span>
            <div class="pagination-pages">
                <button class="page-btn" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>‹ Prev</button>
                ${pageNumbers().map(p => p === '...'
                    ? '<span>...</span>'
                    : `<button class="page-btn ${p === page ? 'active' : ''}" data-page="${p}">${p}</button>`
                ).join('')}
                <button class="page-btn" data-page="${page + 1}" ${page === last ? 'disabled' : ''}>Next ›</button>
            </div>
            <div class="jump-to">
                Jump to: <input type="number" min="1" max="${last}" value="${page}" style="width:50px; text-align:center;">
            </div>
        `;
    }

    function goTo(n) {
        const next = clamp(n);
        if (next === page) {
            render(); // يرجّع قيمة خانة Jump لو اتكتب رقم غلط
            return;
        }
        page = next;
        render();
        if (typeof onPageChange === 'function') onPageChange(page);
    }

    container.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-page]');
        if (btn && !btn.disabled) goTo(btn.dataset.page);
    });

    container.addEventListener('change', (e) => {
        if (e.target.matches('.jump-to input')) goTo(e.target.value);
    });

    return {
        // resetPage: true لما الفلاتر أو البحث أو الترتيب يتغيروا
        setTotal(newTotal, { resetPage = false } = {}) {
            total = Math.max(0, Number(newTotal) || 0);
            page = resetPage ? 1 : clamp(page);
            render();
        },
        getPage: () => page,
        getTotalPages: totalPages,
        // بيرجّع عناصر الصفحة الحالية بس
        paginate(items) {
            return items.slice((page - 1) * pageSize, page * pageSize);
        }
    };
}