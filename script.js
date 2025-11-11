document.addEventListener("DOMContentLoaded", () => {
    // --- Variabel Global ---
    // GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT ANDA
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwoNUMTA3CHYe_PR5h2qagL2ThQVqV3w3iGLQJyul8qh0-HE-TWibDY7BWQ3jhc7cQbGw/exec"; 

    const landingPage = document.getElementById("landing-page");
    const envelopeContainer = document.getElementById("envelope-container");
    const envelope = document.getElementById("envelope");
    const mainContent = document.getElementById("main-content");
    const openButton = document.getElementById("open-button");
    
    const guestNameEl = document.getElementById("guest-name");
    const guestNameMainEl = document.getElementById("guest-name-main");
    
    const countdownDays = document.getElementById("days");
    const countdownHours = document.getElementById("hours");
    const countdownMinutes = document.getElementById("minutes");
    const countdownSeconds = document.getElementById("seconds");
    
    const calendarButton = document.getElementById("calendar-button");
    const copyButton = document.getElementById("copy-button");
    const rsvpForm = document.getElementById("rsvp-form");
    const doaForm = document.getElementById("doa-form");

    const backgroundMusic = document.getElementById("background-music");
    const musicToggle = document.getElementById("music-toggle");
    const iconPlay = document.getElementById("icon-play");
    const iconPause = document.getElementById("icon-pause");

    const openDoaViewerBtn = document.getElementById("open-doa-viewer");
    const closeDoaViewerBtn = document.getElementById("close-doa-viewer");
    const doaViewer = document.getElementById("doa-viewer");
    const doaList = document.getElementById("doa-list");
    const doaLoading = document.getElementById("doa-loading");
    
    // --- 1. Logika Nama Tamu ---
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get('to') || 'Tamu Undangan';
    guestName = guestName.replace(/\+/g, ' ');
    guestNameEl.textContent = guestName;
    guestNameMainEl.textContent = guestName;

    // --- 2. Logika Buka Undangan & Animasi Amplop ---
    openButton.addEventListener("click", () => {
        // Mainkan musik
        // Perbaikan: Panggil play() langsung, jangan bungkus dengan fungsi.
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Autoplay berhasil
                musicToggle.classList.add("playing");
                iconPlay.classList.add("hidden");
                iconPause.classList.remove("hidden");
            }).catch(error => {
                // Autoplay gagal (mis. diblok browser)
                console.warn("Autoplay musik gagal:", error);
                // Tombol akan tetap menunjukkan 'play', pengguna harus klik manual
            });
        }

        landingPage.style.transition = "opacity 0.5s ease-out";
        landingPage.style.opacity = "0";
        setTimeout(() => landingPage.classList.add("hidden"), 500);

        envelopeContainer.classList.remove("hidden");
        envelopeContainer.classList.add("flex");

        setTimeout(() => envelope.classList.add("envelope-open"), 100);

        setTimeout(() => {
            envelopeContainer.style.transition = "opacity 0.5s ease-out";
            envelopeContainer.style.opacity = "0";
            setTimeout(() => envelopeContainer.classList.add("hidden"), 500);

            mainContent.classList.remove("hidden");
            setTimeout(() => {
                mainContent.style.opacity = 1;
                mainContent.style.transition = "opacity 1s ease-in";
            }, 100);
        }, 2500); // Tunggu 2.5 detik untuk animasi amplop
    });
    
    // --- 3. Logika Kontrol Musik ---
    function playMusic() {
        backgroundMusic.play().catch(e => console.warn("Autoplay musik gagal:", e));
        musicToggle.classList.add("playing");
        iconPlay.classList.add("hidden");
        iconPause.classList.remove("hidden");
    }
    function pauseMusic() {
        backgroundMusic.pause();
        musicToggle.classList.remove("playing");
        iconPlay.classList.remove("hidden");
        iconPause.classList.add("hidden");
    }

    musicToggle.addEventListener("click", () => {
        if (backgroundMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });

    // --- 4. Logika Hitungan Mundur ---
    const targetDate = new Date("2025-11-15T09:00:00").getTime();
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        if (distance < 0) {
            countdownDays.textContent = "00"; countdownHours.textContent = "00";
            countdownMinutes.textContent = "00"; countdownSeconds.textContent = "00";
            clearInterval(countdownInterval); return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownDays.textContent = String(days).padStart(2, '0');
        countdownHours.textContent = String(hours).padStart(2, '0');
        countdownMinutes.textContent = String(minutes).padStart(2, '0');
        countdownSeconds.textContent = String(seconds).padStart(2, '0');
    };
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- 5. Logika Google Calendar ---
    calendarButton.addEventListener("click", (e) => {
        e.preventDefault();
        const title = encodeURIComponent("Khitanan Adam Faiq Arrizky");
        const startDate = "20251115T020000Z"; 
        const endDate = "20251115T100000Z";
        const details = encodeURIComponent("Syukuran Khitanan Adam Faiq Arrizky.");
        const location = encodeURIComponent("Jl.Maharmartanegara 002/008 , kmp.cimuncang , Cimahi selatan (depan pt.afiat)");
        const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
        window.open(calendarUrl, "_blank");
    });

    // --- 6. Logika Salin Nomor Rekening ---
    copyButton.addEventListener("click", () => {
        const rekeningNumber = document.getElementById("rekening-number").textContent;
        const feedbackEl = document.getElementById("copy-feedback");
        try {
            const tempInput = document.createElement("textarea");
            tempInput.value = rekeningNumber;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            feedbackEl.textContent = "Berhasil disalin!";
        } catch (err) {
            feedbackEl.textContent = "Gagal menyalin.";
        }
        setTimeout(() => { feedbackEl.textContent = ""; }, 2000);
    });

    // --- 7. Logika Form (RSVP & Doa) ke Google Sheets ---
    function handleFormSubmit(form, feedbackEl, button, payload) {
        if (APPS_SCRIPT_URL === "URL_WEB_APP_ANDA_DISINI") {
            feedbackEl.textContent = "Error: URL Apps Script belum diatur.";
            feedbackEl.style.color = "red";
            return;
        }
        
        button.disabled = true;
        button.textContent = "Mengirim...";
        feedbackEl.textContent = "";

        fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Penting untuk request 'simple' ke Apps Script
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => {
            // Karena mode 'no-cors', kita tidak bisa membaca respons.
            // Kita anggap berhasil jika tidak ada network error.
            feedbackEl.textContent = "Data Anda berhasil terkirim!";
            feedbackEl.style.color = "green";
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            feedbackEl.textContent = "Gagal mengirim data. Coba lagi.";
            feedbackEl.style.color = "red";
        })
        .finally(() => {
            button.disabled = false;
            button.textContent = form.id === "rsvp-form" ? "Kirim Konfirmasi" : "Kirim Do'a";
        });
    }

    // Handler RSVP
    rsvpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("rsvp-name").value;
        const count = document.getElementById("rsvp-count").value;
        const status = document.querySelector('input[name="rsvp-status"]:checked').value;
        
        const payload = {
            form: "rsvp",
            nama: name,
            jumlah: status === "Hadir" ? count : 0,
            status: status
        };
        
        handleFormSubmit(rsvpForm, document.getElementById("rsvp-feedback"), document.getElementById("rsvp-button"), payload);
    });

    // Handler Doa
    doaForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("doa-name").value;
        const doa = document.getElementById("doa-message").value;
        
        const payload = {
            form: "doa",
            nama: name,
            doa: doa
        };
        
        handleFormSubmit(doaForm, document.getElementById("doa-feedback"), document.getElementById("doa-button"), payload);
    });

    // --- 8. Logika Tampilan Doa ---
    function loadDoas() {
        if (APPS_SCRIPT_URL === "URL_WEB_APP_ANDA_DISINI") {
            doaLoading.textContent = "Error: URL Apps Script belum diatur.";
            return;
        }

        doaLoading.textContent = "Memuat do'a...";
        doaList.innerHTML = ''; // Kosongkan list
        doaList.appendChild(doaLoading);
        
        fetch(APPS_SCRIPT_URL + "?action=getDoas")
            .then(response => response.json())
            .then(data => {
                doaLoading.remove();
                if (data && data.doas && data.doas.length > 0) {
                    // Balik urutan agar doa terbaru di atas
                    data.doas.reverse().forEach(item => {
                        const [nama, doa] = item;
                        if (!nama || !doa) return; // Skip baris kosong
                        
                        const bubble = document.createElement("div");
                        bubble.className = "chat-bubble";
                        bubble.innerHTML = `
                            <div class="name">${nama}</div>
                            <p>${doa}</p>
                        `;
                        doaList.appendChild(bubble);
                    });
                } else {
                    doaList.innerHTML = '<p class="text-center text-gray-600">Belum ada do\'a yang masuk.</p>';
                }
            })
            .catch(error => {
                console.error("Error fetching doas:", error);
                doaLoading.textContent = "Gagal memuat do'a. Coba lagi nanti.";
            });
    }

    openDoaViewerBtn.addEventListener("click", () => {
        doaViewer.classList.add("show");
        loadDoas(); // Muat doa setiap kali dibuka
    });
    
    closeDoaViewerBtn.addEventListener("click", () => {
        doaViewer.classList.remove("show");
    });

    // --- 9. Logika Animasi Scroll ---
    const sectionsToFade = document.querySelectorAll(".fade-in");
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sectionsToFade.forEach(section => {
        observer.observe(section);
    });
});
