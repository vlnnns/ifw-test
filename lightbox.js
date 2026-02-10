(function () {
    // 1. Ініціалізація нескінченного скролу
    document.querySelectorAll("[data-vscroll]").forEach((wrap) => {
        const track = wrap.querySelector("[data-vtrack]");
        if (!track || track.dataset.inited === "1") return;
        track.dataset.inited = "1";
        const items = Array.from(track.children);
        items.forEach((node) => track.appendChild(node.cloneNode(true)));
    });

    // 2. Елементи Лайтбоксу
    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lbImg");
    const lbCounter = document.getElementById("lbCounter"); // Елемент для тексту "1 із 5"

    if (!lb || !lbImg) return;

    const btnPrev = lb.querySelector("[data-lb-prev]");
    const btnNext = lb.querySelector("[data-lb-next]");
    const btnCloses = lb.querySelectorAll("[data-lb-close]");

    let currentList = [];
    let currentIndex = 0;

    // Оновлення контенту лайтбоксу
    function updateLightbox() {
        if (!currentList.length) return;

        // Встановлюємо фото
        lbImg.src = currentList[currentIndex];

        // Оновлюємо лічильник (якщо він є в HTML)
        if (lbCounter) {
            lbCounter.innerText = `${currentIndex + 1} із ${currentList.length}`;
        }
    }

    function openLightbox(list, index) {
        currentList = list;
        currentIndex = index;
        updateLightbox();
        lb.classList.remove("hidden");
        lb.classList.add("flex"); // Додаємо flex для центрування
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lb.classList.add("hidden");
        lb.classList.remove("flex");
        lbImg.src = "";
        document.body.style.overflow = '';
    }

    function showPrev() {
        if (!currentList.length) return;
        currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
        updateLightbox();
    }

    function showNext() {
        if (!currentList.length) return;
        currentIndex = (currentIndex + 1) % currentList.length;
        updateLightbox();
    }

    // Слухачі подій
    btnPrev?.addEventListener("click", (e) => { e.stopPropagation(); showPrev(); });
    btnNext?.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });
    btnCloses.forEach(btn => btn.addEventListener("click", closeLightbox));
    lbImg.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });

    document.addEventListener("keydown", (e) => {
        if (lb.classList.contains("hidden")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "ArrowRight") showNext();
    });

    // 3. Обробка кліку по картинці в каруселі
    document.addEventListener("click", (e) => {
        const item = e.target.closest("[data-gallery-item]");
        if (!item) return;

        const container = item.closest("[data-vscroll]");
        if (!container) return;

        const track = container.querySelector("[data-vtrack]");
        const allPhotos = Array.from(track.querySelectorAll("[data-gallery-item]"))
            .map(el => el.getAttribute("data-src"));

        const uniqueCount = Math.floor(allPhotos.length / 2);
        const uniqueList = allPhotos.slice(0, uniqueCount);

        const currentSrc = item.getAttribute("data-src");
        const index = uniqueList.indexOf(currentSrc);

        openLightbox(uniqueList, index !== -1 ? index : 0);
    });
})();

(function () {
    // 4. Логіка відкриття/закриття карток проектів
    // Використовуємо делегування подій для кращої роботи
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-toggle]");
        if (!btn) return;

        const card = btn.closest(".project-wrapper") || btn.closest(".project-card");
        if (!card) return;

        const compact = card.querySelector(".project-compact");
        const open = card.querySelector(".project-open");
        const isOpen = card.classList.contains("is-open");

        if (isOpen) {
            // Закрити поточну
            compact?.classList.remove("hidden");
            open?.classList.add("hidden");
            card.classList.remove("is-open");
        } else {
            // Закрити всі інші
            document.querySelectorAll(".is-open").forEach((other) => {
                other.querySelector(".project-compact")?.classList.remove("hidden");
                other.querySelector(".project-open")?.classList.add("hidden");
                other.classList.remove("is-open");
            });

            // Відкрити цю
            compact?.classList.add("hidden");
            open?.classList.remove("hidden");
            card.classList.add("is-open");

            // Плавний скрол до початку картки
            setTimeout(() => {
                card.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    });
})();