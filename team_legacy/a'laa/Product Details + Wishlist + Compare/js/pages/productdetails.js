document.addEventListener('DOMContentLoaded', () => {
    const displayPrice = document.getElementById('display-price');
    const btnPrice = document.getElementById('btn-price');
    const basePrice = parseFloat(displayPrice.getAttribute('data-base')) || 0;

    // دالة حساب السعر الإجمالي وتحديثه
    function calculatePrice() {
        let additional = 0;
        
        // جمع كل الخيارات المحددة (CPU, RAM, Storage)
        const selectedRadios = document.querySelectorAll('input[type="radio"]:checked');
        selectedRadios.forEach(radio => {
            additional += parseFloat(radio.getAttribute('data-add') || 0);
        });

        // قراءة الكمية
        const qtyInput = document.getElementById('qty-input');
        const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;

        // حساب السعر النهائي
        const totalPrice = (basePrice + additional) * qty;
        const formatted = totalPrice.toLocaleString('en-US');

        if (displayPrice) displayPrice.textContent = '$' + formatted;
        if (btnPrice) btnPrice.textContent = formatted;
    }

    // ربط تغيير الـ Radio Buttons
    document.querySelectorAll('.options-radio-stack input, .options-three-grid input').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const groupName = e.target.name;
            // إزالة class التحديد من عناصر نفس المجموعة
            document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
                const card = r.closest('.config-option-card, .ram-card-item, .storage-card-item');
                if (card) card.classList.remove('selected');
            });
            // إضافة class التحديد للعنصر المختار
            const currentCard = e.target.closest('.config-option-card, .ram-card-item, .storage-card-item');
            if (currentCard) currentCard.classList.add('selected');
            
            calculatePrice();
        });
    });

    // تحكم أزرار الكمية + و -
    const qtyInput = document.getElementById('qty-input');
    const plusBtn = document.getElementById('plus-btn');
    const minusBtn = document.getElementById('minus-btn');

    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
            calculatePrice();
        });
    }

    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            if (parseInt(qtyInput.value) > 1) {
                qtyInput.value = parseInt(qtyInput.value) - 1;
                calculatePrice();
            }
        });
    }

    // زر الـ Wishlist عبر الـ AJAX
    const wishlistBtn = document.getElementById('wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const icon = this.querySelector('i');

            fetch('api/wishlist.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `product_id=${productId}`
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'added') {
                    icon.className = 'fa-solid fa-heart';
                    this.classList.add('active');
                } else if (data.status === 'removed') {
                    icon.className = 'fa-regular fa-heart';
                    this.classList.remove('active');
                }
            })
            .catch(err => console.error('Error toggling wishlist:', err));
        });
    }
});
// تشغيل أزرار إضافة الملحقات (Studio Peripherals Add+)
document.querySelectorAll('.add-mini-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const itemTitle = this.closest('.peripheral-card').querySelector('h4').textContent;
        this.textContent = 'Added ✓';
        this.style.background = '#dcfce7';
        this.style.color = '#15803d';
        setTimeout(() => {
            this.textContent = 'Add +';
            this.style.background = '#eff6ff';
            this.style.color = '#2563eb';
        }, 2000);
    });
});

// تشغيل زر كتابة التقييم (Submit Benchmark Review)
const reviewBtn = document.querySelector('.submit-bench-btn');
if (reviewBtn) {
    reviewBtn.addEventListener('click', () => {
        alert('شكراً لاهتمامك! سيتم فتح نموذج تقديم التقييم قريباً.');
    });
}