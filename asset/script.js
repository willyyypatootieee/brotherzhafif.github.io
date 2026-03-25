// ==========================================
// SMART LIGHTBOX: PAUSE SWIPER & CUSTOM COUNTER
// ==========================================
function refreshLightbox() {
	if (typeof customLightbox !== 'undefined' && customLightbox) {
		customLightbox.destroy();
	}

	customLightbox = GLightbox({
		selector: '.glightbox',
		touchNavigation: true, // Ini udah otomatis bikin bisa di-swipe horizontal di HP
		loop: true,
		zoomable: true
	});

	// 1. AUTO-PAUSE: Matikan semua autoplay Swiper pas zoom dibuka
	customLightbox.on('open', () => {
		if (typeof certSwiper !== 'undefined' && certSwiper.autoplay) certSwiper.autoplay.stop();
		if (typeof softwareSwiper !== 'undefined' && softwareSwiper.autoplay) softwareSwiper.autoplay.stop();
		if (typeof creativeSwiper !== 'undefined' && creativeSwiper.autoplay) creativeSwiper.autoplay.stop();
	});

	// 2. AUTO-RESUME: Nyalakan lagi autoplay pas zoom ditutup
	customLightbox.on('close', () => {
		if (typeof certSwiper !== 'undefined' && certSwiper.autoplay) certSwiper.autoplay.start();
		if (typeof softwareSwiper !== 'undefined' && softwareSwiper.autoplay) softwareSwiper.autoplay.start();
		if (typeof creativeSwiper !== 'undefined' && creativeSwiper.autoplay) creativeSwiper.autoplay.start();

		// Bersihkan UI indikator custom
		const customCounter = document.getElementById('custom-g-counter');
		if (customCounter) customCounter.remove();
	});

	// 3. UI INDIKATOR & SCROLLBAR: Update posisi gambar saat digeser
	customLightbox.on('slide_changed', ({ prev, current }) => {
		if (!current) return;

		const total = customLightbox.elements.length; // Total multiple post
		const index = current.slideIndex + 1; // Urutan ke berapa

		// Kalau gambarnya cuma 1, nggak usah nampilin indikator
		if (total <= 1) return;

		let counterEl = document.getElementById('custom-g-counter');
		if (!counterEl) {
			counterEl = document.createElement('div');
			counterEl.id = 'custom-g-counter';
			// Posisi ditaruh di Kanan Atas, di bawah tombol Close bawaan
			counterEl.className = 'absolute top-16 right-4 sm:right-8 z-[99999] font-mono text-xs sm:text-sm pointer-events-none flex flex-col items-end gap-1.5 opacity-0 transition-opacity duration-300';

			const glightboxContainer = document.querySelector('.glightbox-container');
			if (glightboxContainer) {
				glightboxContainer.appendChild(counterEl);
				setTimeout(() => counterEl.classList.remove('opacity-0'), 100);
			}
		}

		// Tampilan Indikator Kanan Atas & Scrollbar (Progress Line)
		counterEl.innerHTML = `
            <div class="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg text-white">
                <i class="bi bi-images text-blue-400"></i> ${index} / ${total}
            </div>
            <div class="w-full h-1 bg-white/20 rounded-full overflow-hidden shadow-lg mt-1">
                <div class="h-full bg-blue-500 transition-all duration-300" style="width: ${(index / total) * 100}%"></div>
            </div>
        `;
	});
}

// ==========================================
// LOGIKA SMART NAVBAR (CONTEXTUAL APPEARANCE)
// ==========================================

const initSmartNavbar = () => {
	const nav = document.getElementById('main-nav');
	const achievementSection = document.getElementById('Achievement');

	if (!nav || !achievementSection) return;

	window.addEventListener('scroll', () => {
		// Ambil posisi section Achievement relatif terhadap layar
		const sectionPos = achievementSection.getBoundingClientRect();

		// LOGIKA: Muncul jika Achievement menyentuh TOP (<= 0)
		if (sectionPos.top <= 0) {
			if (nav.classList.contains('nav-hidden')) {
				// Hapus class pembatas
				nav.classList.remove('nav-hidden', 'opacity-0');

				// Animasi Masuk (Slide Down)
				anime.remove(nav); // Bersihkan sisa animasi lama
				anime({
					targets: nav,
					translateY: [-100, 0],
					opacity: [0, 1],
					duration: 800,
					easing: 'easeOutExpo'
				});
			}
		} else {
			// LOGIKA: Sembunyi jika scroll balik ke atas Achievement
			if (!nav.classList.contains('nav-hidden')) {
				anime.remove(nav);
				anime({
					targets: nav,
					translateY: -100,
					opacity: 0,
					duration: 600,
					easing: 'easeInExpo',
					complete: () => {
						nav.classList.add('nav-hidden', 'opacity-0');
					}
				});
			}
		}
	});
};

// Toggle Menu Mobile
const toggleMobileMenu = () => {
	const menu = document.getElementById('mobile-menu');
	const icon = document.getElementById('menu-icon');
	const isHidden = menu.classList.contains('hidden');

	if (isHidden) {
		menu.classList.remove('hidden');
		anime({
			targets: '#mobile-menu',
			opacity: [0, 1],
			translateY: [-20, 0],
			duration: 400,
			easing: 'easeOutCubic'
		});
		icon.className = 'bi bi-x-lg';
	} else {
		anime({
			targets: '#mobile-menu',
			opacity: 0,
			translateY: -20,
			duration: 300,
			easing: 'easeInCubic',
			complete: () => menu.classList.add('hidden')
		});
		icon.className = 'bi bi-grid-3x3-gap-fill';
	}
};

// Panggil fungsi inisialisasi
document.addEventListener('DOMContentLoaded', initSmartNavbar);

// ==========================================
// ANIMASI LOADER MINIMALIS (ANIME.JS)
// ==========================================

// 1. Kubus Mutar Santai
anime({
	targets: '#global-loader .cube-wrapper',
	rotateX: [0, 360],
	rotateY: [0, 360],
	duration: 3000,
	loop: true,
	easing: 'linear' // Putaran stabil gak pakai rem
});

// 2. Efek Wave (Gelombang) pada Teks Loading
anime({
	targets: '#loading-text span',
	translateY: [-10, 0], // Hurufnya ditarik naik 10px lalu kembali
	duration: 500,
	delay: anime.stagger(100), // INI KUNCINYA: Huruf selanjutnya nunggu 100ms
	direction: 'alternate', // Bolak-balik (naik, lalu turun)
	loop: true,
	easing: 'easeInOutSine'
});

// Detektor Arah Scroll
let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
let isScrollingDown = true;

window.addEventListener('scroll', () => {
	let currentScroll = window.scrollY || document.documentElement.scrollTop;
	isScrollingDown = currentScroll > lastScrollTop;
	lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);

// Detect if device is likely to struggle with animations
const isLowEndMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// ==========================================
// MESIN ANIMASI SCROLL ANTI-FLICKER (SIGMA VERSION)
// ==========================================

// ==========================================
// MESIN ANIMASI SCROLL ANTI-FLICKER (SIGMA VERSION - FIXED FLIP LOGIC)
// ==========================================

const scrollObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		const el = entry.target;
		const currentState = el.dataset.animState;
		const animType = el.getAttribute('data-anime');
		const delay = el.getAttribute('data-anime-delay') || 0;
		const noFlip = el.hasAttribute('data-anime-no-flip'); // Deteksi kalau elemen dikunci arahnya

		// 1. Tentukan Nilai Awal Default (Berdasarkan Atribut)
		let startY = 0, startX = 0, startScale = 1;
		if (animType === 'fade-up') startY = 50;
		if (animType === 'fade-down') startY = -50;
		if (animType === 'fade-right') startX = -50;
		if (animType === 'fade-left') startX = 50;
		if (animType === 'zoom-in') startScale = 0.8;

		// 2. Siapkan Variabel Dinamis untuk Masuk (Enter) dan Keluar (Exit)
		let enterY = startY, enterX = startX;
		let exitY = startY, exitX = startX;

		// 3. LOGIKA FLIP (Hanya jalan kalau noFlip FALSE dan bukan HP kentang)
		if (!noFlip && !isLowEndMobile) {
			// Jika Scroll Bawah: Masuk dari Posisi Awal, Keluar ke Arah Sebaliknya (Minus)
			// Jika Scroll Atas: Masuk dari Arah Sebaliknya (Minus), Keluar ke Posisi Awal
			enterY = isScrollingDown ? startY : -startY;
			enterX = isScrollingDown ? startX : -startX;

			exitY = isScrollingDown ? -startY : startY;
			exitX = isScrollingDown ? -startX : startX;
		}

		// 4. Eksekusi Animasi Masuk Layar (Show)
		if (entry.isIntersecting) {
			if (currentState === 'entering') return;
			el.dataset.animState = 'entering';
			anime.remove(el);

			anime({
				targets: el,
				opacity: [0, 1],
				translateY: [enterY, 0], // Gunakan dinamis masuk
				translateX: [enterX, 0], // Gunakan dinamis masuk
				scale: [startScale, 1],
				duration: isLowEndMobile ? 400 : 1000,
				delay: isLowEndMobile ? 0 : parseInt(delay),
				easing: 'easeOutCubic'
			});

			// 5. Eksekusi Animasi Keluar Layar (Hide)
		} else {
			if (currentState === 'leaving' || !currentState) return;
			el.dataset.animState = 'leaving';
			anime.remove(el);

			anime({
				targets: el,
				opacity: 0,
				translateY: exitY, // Gunakan dinamis keluar
				translateX: exitX, // Gunakan dinamis keluar
				scale: startScale,
				duration: 500,
				easing: 'easeInCubic'
			});
		}
	});
}, {
	root: null,
	rootMargin: '0px', // <-- Area tetep digedein biar di laptop mulus
	threshold: 0.15
});

// Fungsi inisialisasi (Panggil ini di tiap render data dinamis!)
function initAnimeScroll() {
	document.querySelectorAll('[data-anime]').forEach(el => {
		if (!el.classList.contains('is-observed')) {
			scrollObserver.observe(el);
			el.classList.add('is-observed');
		}
	});
}

// Fungsi Fallback: Jika dalam 3 detik loading selesai tapi animasi gak jalan, paksa muncul semua
function safetyNet() {
	setTimeout(() => {
		const firstElement = document.querySelector('[data-anime]');
		if (firstElement && window.getComputedStyle(firstElement).opacity === "0") {
			console.warn("Animation system failed or too slow. Activating fallback...");
			document.body.classList.add('no-anime');
		}
	}, 3000);
}

// Fungsi untuk memasang sensor (observer) ke semua elemen yang punya data-anime
function initAnimeScroll() {
	document.querySelectorAll('[data-anime]').forEach(el => {
		// Cek apakah elemen sudah di-observe supaya tidak double
		if (!el.classList.contains('is-observed')) {
			scrollObserver.observe(el);
			el.classList.add('is-observed');
		}
	});
}

// Fungsi Pembunuh Loading Screen
function hideLoaderAndStartAnimation() {
	const globalLoader = document.getElementById('global-loader');
	if (!globalLoader.classList.contains('hidden')) {
		globalLoader.style.opacity = '0';
		setTimeout(() => {
			globalLoader.classList.add('hidden');
			initAnimeScroll();
			safetyNet(); // Jalankan jaring pengaman
		}, 700);
	}

	// Start Efek Senter
	initProfileFlashlight();

	// Start Hint Animation (Interval 12 detik)
	playProfileHint(); // Mainkan sekali di awal
	setInterval(playProfileHint, 12000); // Mainkan terus setiap 12 detik
}

// INISIALISASI SUPABASE (GANTI DENGAN URL & KEY MILIKMU!)
const SUPABASE_URL = 'https://cequvuujxqkzguvxbpzg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_TbMXWbW5nhIyUU7QlIayIg_quPVpE3g';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Fungsi untuk menarik data Profile
// Fungsi untuk menarik data Profile & Mengontrol Full-Screen Loader
async function fetchProfileData() {
	const { data, error } = await supabaseClient
		.from('me')
		.select('*')
		.limit(1)
		.single(); // Mengambil 1 baris data saja

	const globalLoader = document.getElementById('global-loader');

	if (error) {
		console.error("Gagal mengambil data profil:", error);
		// Tetap hilangkan loader jika error agar web tidak freeze selamanya
		globalLoader.style.opacity = '0';
		setTimeout(() => globalLoader.classList.add('hidden'), 700);
		return;
	}

	if (data) {
		// Suntikkan data dari database ke HTML
		typeWriter('profile-name', data.name, 50);
		document.getElementById('profile-alias').innerText = data.alias;
		document.getElementById('profile-alias').title = data.alias;
		typeWriter('profile-role', data.role, 25);
		document.getElementById('profile-org').innerText = data.organization;
		document.getElementById('profile-org').title = data.organization;
		typeWriter('profile-desc', data.description, 5);

		// Suntikkan Data Footer Links
		renderFooterLinks(data.footer_tech_1, 'tech-col-1');
		renderFooterLinks(data.footer_tech_2, 'tech-col-2');
		renderFooterLinks(data.footer_thanks, 'thanks-col');
		renderFooterLinks(data.footer_social, 'social-col');

		// Suntikkan Copyright Otomatis (Mengambil Nama & Alias dari DB)
		const nameLink = document.getElementById('footer-name-link');
		const aliasLink = document.getElementById('footer-alias-link');
		const currentYear = new Date().getFullYear();

		nameLink.innerText = `By ${data.name.replace(/<br>/g, '')}`;
		nameLink.href = `https://www.google.com/search?q=${encodeURIComponent(data.name)}`;

		aliasLink.innerText = `©${currentYear} ${data.alias}`;
		aliasLink.href = `https://www.google.com/search?q=${encodeURIComponent(data.alias)}`;

		// Logika gambar profil 3 layer: robot (kiri), artist (kanan), normal (overlay senter)
		const normalHighResUrl = data.normal_image_url || data.normal_image_url;
		const robotHighResUrl = data.robot_image_url || normalHighResUrl;
		const artistHighResUrl = data.artist_image_url || normalHighResUrl;

		if (normalHighResUrl && normalHighResUrl.includes('supabase.co')) {
			const lastDotIndex = normalHighResUrl.lastIndexOf('.');
			const normalLowResUrl = normalHighResUrl.substring(0, lastDotIndex) + '-low.webp';

			const normalLow = document.getElementById('profile-normal-low');
			const normalHigh = document.getElementById('profile-normal');
			const robotImg = document.getElementById('profile-robot');
			const artistImg = document.getElementById('profile-artist');
			const favicon = document.getElementById('web-favicon');

			if (robotImg && robotHighResUrl) robotImg.src = robotHighResUrl;
			if (artistImg && artistHighResUrl) artistImg.src = artistHighResUrl;

			if (normalLow) {
				normalLow.onload = () => {
					hideLoaderAndStartAnimation();
				};
				normalLow.src = normalLowResUrl;
			}

			if (normalHigh) {
				normalHigh.onload = () => {
					normalHigh.classList.remove('opacity-0');
					if (normalLow) normalLow.classList.add('opacity-0');
				};
				normalHigh.src = normalHighResUrl;
			}

			favicon.href = normalHighResUrl;
		} else {
			// Jika belum ada foto profile normal, langsung buka loading screen agar web tidak freeze
			hideLoaderAndStartAnimation();
		}
	}
}

// 2. SETELAH gambar masuk, baru inisialisasi Swiper
// Ini yang membuat autoplay bisa membaca jumlah gambar dengan benar
const swiper = new Swiper(".mySwiper", {
	spaceBetween: 30,
	effect: "slide",
	loop: true, // Looping tanpa ujung

	// Konfigurasi Autoplay (Bisa diatur waktunya)
	autoplay: {
		delay: 3000, // 3000ms = auto scroll setiap 3 detik
		disableOnInteraction: false, // Autoplay TIDAK akan mati meskipun user habis memencet/geser manual
	},

	// Konfigurasi Indikator Kotak
	pagination: {
		el: ".swiper-pagination",
		clickable: true, // MEMBUAT INDIKATOR BISA DIKLIK MENUJU INDEX TERSEBUT
	},

	// Konfigurasi Panah
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
});

// 3. Terakhir inisialisasi fitur Zoom (GLightbox)
const lightbox = GLightbox({
	selector: '.glightbox',
	touchNavigation: true,
	loop: true,
	zoomable: true
});

// Variable global untuk GLightbox agar bisa di-reload
let customLightbox;

// Fungsi Mengambil Data Achievement
async function fetchAchievements() {
	const { data, error } = await supabaseClient
		.from('posts')
		.select('*')
		.eq('type', 'achievement')
		// Sortir: order_num kecil dulu (0=pinned), lalu created_at terbaru
		.order('order_num', { ascending: true })
		.order('created_at', { ascending: false });

	if (error) {
		console.error("Gagal mengambil data achievement:", error);
		return;
	}

	renderAchievements(data);
}

// Fungsi Render HTML
function renderAchievements(posts) {
	const highlightContainer = document.getElementById('achievement-highlight');
	const drawerContainer = document.getElementById('achievement-grid-all');
	const btnShowMore = document.getElementById('btn-show-more-achievements');

	highlightContainer.innerHTML = '';
	drawerContainer.innerHTML = '';

	if (!posts || posts.length === 0) {
		highlightContainer.innerHTML = '<p class="text-neutral-500 col-span-full text-center">Belum ada achievement.</p>';
		return;
	}

	// FIX: Deteksi layar tablet (768px - 1024px) untuk nampilin 4 item
	const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
	const highlightCount = isTablet ? 4 : 3;

	posts.forEach((post, index) => {
		const isHighlight = index < highlightCount;
		const images = post.images || [];
		if (images.length === 0) return;

		const highResUrl = images[0];
		const lastDotIndex = highResUrl.lastIndexOf('.');
		const lowResUrl = highResUrl.substring(0, lastDotIndex) + '-low.webp';

		const hasMultiple = images.length > 1;
		const galleryId = `achieve-${post.id}`;
		const isVideoUrl = highResUrl.match(/\.(mp4|webm|ogg)$/i);

		let cardHTML = `
            <div data-aos="${isHighlight ? 'fade-up' : ''}" class="bg-[#11121a] rounded-lg relative overflow-hidden group aspect-[4/3] w-full flex items-center justify-center border border-transparent hover:border-neutral-500 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-zoom-in">
                
                <img src="${lowResUrl}" class="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 z-0 transition-transform duration-500 group-hover:scale-125" alt="bg">
                <div class="absolute inset-0 bg-black/50 z-0"></div>

                <div class="absolute top-3 left-3 z-40 flex gap-2">
                    ${post.year ? `
                    <div class="bg-blue-600/80 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow-lg flex items-center gap-1 font-mono border border-blue-400/30">
                        <i class="bi bi-calendar-event"></i> ${post.year}
                    </div>
                    ` : ''}
                    
                    ${post.link ? `
                    <a href="${post.link}" target="_blank" class="bg-neutral-800/80 hover:bg-neutral-600 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow-lg flex items-center justify-center font-mono border border-neutral-500/50 transition-colors pointer-events-auto">
                        <i class="bi bi-link-45deg text-sm"></i>
                    </a>
                    ` : ''}
                </div>

                ${hasMultiple ? `
                <div class="absolute top-3 right-3 z-30 bg-black/80 text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow-lg flex items-center gap-1 font-mono border border-neutral-600">
                    <i class="bi bi-images"></i> ${images.length}
                </div>
                ` : ''}

                <a href="${highResUrl}" class="glightbox relative z-20 h-[calc(100%-10px)] my-[5px] aspect-[5/3] group-hover:scale-105 transition-transform duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.9)] rounded-md overflow-hidden bg-neutral-800 animate-pulse flex justify-center items-center" data-gallery="${galleryId}" data-title="${post.title} - ${post.year || ''}">
                    ${isVideoUrl ? `<i class="bi bi-play-circle text-4xl text-white/80 absolute z-30 drop-shadow-lg group-hover:scale-110 transition-transform"></i>` : ''}
                    <img src="${lowResUrl}" class="absolute inset-0 w-full h-full object-cover blur-sm z-10" onload="this.parentElement.classList.remove('animate-pulse')">
                    <img src="${highResUrl}" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 z-20" onload="this.classList.remove('opacity-0'); this.previousElementSibling.classList.add('opacity-0');">
                </a>

                <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-16 z-30 flex flex-col items-center text-center pointer-events-none">
                    <p class="text-[12px] sm:text-[14px] lg:text-base text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">${post.title}</p>
                </div>
        `;

		if (hasMultiple) {
			for (let i = 1; i < images.length; i++) {
				cardHTML += `<a href="${images[i]}" class="glightbox hidden" data-gallery="${galleryId}" data-title="${post.title} - ${post.year || ''} (${i + 1}/${images.length})"></a>`;
			}
		}
		cardHTML += `</div>`;

		if (isHighlight) highlightContainer.innerHTML += cardHTML;
		else drawerContainer.innerHTML += cardHTML;
	});

	if (posts.length > highlightCount) {
		btnShowMore.classList.remove('hidden');
	}

	refreshLightbox();
	initAnimeScroll();
}

// ==========================================
// FUNGSI LACI ANTI-TABRAKAN AOS
// ==========================================
function toggleAchievementDrawer() {
	const drawer = document.getElementById('achievement-drawer');
	const btn = document.getElementById('btn-show-more-achievements');

	// STOP SEMUA ANIMASI YANG SEDANG BERJALAN PADA DRAWER
	anime.remove(drawer);

	const isClosed = drawer.classList.contains('hidden') || drawer.offsetHeight === 0;

	if (isClosed) {
		// --- ACTION: BUKA ---
		drawer.classList.remove('hidden');
		const fullHeight = drawer.scrollHeight;

		anime({
			targets: drawer,
			height: [0, fullHeight],
			opacity: [0, 1],
			duration: 800,
			easing: 'easeOutQuart',
			begin: () => {
				// Pastikan sensor AOS tidak mengganggu saat proses buka
				drawer.style.pointerEvents = 'none';
			},
			complete: () => {
				drawer.style.height = 'auto';
				drawer.style.pointerEvents = 'auto';
				// Trigger ulang AOS buat konten di dalam yang baru muncul
				initAnimeScroll();
			}
		});

		btn.innerHTML = 'Show Less <i class="bi bi-chevron-up ml-1"></i>';

	} else {
		// --- ACTION: TUTUP ---
		anime({
			targets: drawer,
			height: 0,
			opacity: 0,
			duration: 600,
			easing: 'easeInQuart',
			complete: () => {
				drawer.classList.add('hidden');
			}
		});

		btn.innerHTML = 'Show More <i class="bi bi-chevron-down ml-1"></i>';

		// Scroll balik dengan delay agar tidak kaget
		setTimeout(() => {
			const section = document.getElementById('Achievement');
			if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 200);
	}
}
// Variable global untuk Swiper Certificate agar tidak bentrok
let certSwiper;

// Fungsi Mengambil Data Sertifikat
async function fetchCertificates() {
	const { data, error } = await supabaseClient
		.from('posts')
		.select('*')
		.eq('type', 'certificate')
		.order('order_num', { ascending: true })
		.order('created_at', { ascending: false });

	if (error) {
		console.error("Gagal mengambil data sertifikat:", error);
		return;
	}

	renderCertificates(data);
}

// Fungsi Render HTML Sertifikat ke Carousel Swiper
function renderCertificates(posts) {
	const carouselWrapper = document.getElementById('carouselItems');
	carouselWrapper.innerHTML = '';

	if (!posts || posts.length === 0) {
		carouselWrapper.innerHTML = '<div class="w-full flex justify-center mt-10 text-neutral-500">Belum ada sertifikat.</div>';
		return;
	}

	posts.forEach((cert) => {
		const images = cert.images || [];
		if (images.length === 0) return;

		const highResUrl = images[0];
		const lastDotIndex = highResUrl.lastIndexOf('.');
		const lowResUrl = highResUrl.substring(0, lastDotIndex) + '-low.webp';

		const hasMultiple = images.length > 1;
		const galleryId = `cert-${cert.id}`;

		// Cek apakah file adalah video (jarang di sertifikat, tapi buat jaga-jaga)
		const isVideoUrl = highResUrl.match(/\.(mp4|webm|ogg)$/i);

		let slideHTML = `
            <div class="swiper-slide w-full h-full flex justify-center items-center relative overflow-hidden bg-[#1f202b] rounded-lg group cursor-zoom-in">
                
                <img src="${lowResUrl}" class="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 z-0 transition-transform duration-500 group-hover:scale-125" alt="bg">
                <div class="absolute inset-0 bg-black/50 z-0"></div>

                ${cert.year ? `
                <div class="absolute top-3 left-3 z-50 bg-blue-600/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded shadow-lg flex items-center gap-1 font-mono border border-blue-400/30">
                    <i class="bi bi-calendar-event"></i> ${cert.year}
                </div>
                ` : ''}

                <a href="${highResUrl}" class="glightbox absolute inset-0 z-10 flex justify-center items-center group-hover:scale-105 transition-transform duration-300" data-gallery="${galleryId}" data-title="${cert.title} - ${cert.year || ''} ${hasMultiple ? '(1/' + images.length + ')' : ''}">
                    
                    ${isVideoUrl ? `<i class="bi bi-play-circle text-5xl text-white/80 absolute z-30 drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]"></i>` : ''}
                    
                    <img src="${lowResUrl}" class="absolute w-full h-full object-contain blur-md z-10 p-6 sm:p-10 drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
                    <img src="${highResUrl}" class="absolute w-full h-full object-contain opacity-0 transition-opacity duration-700 z-20 p-6 sm:p-10 drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]" onload="this.classList.remove('opacity-0'); this.previousElementSibling.classList.add('opacity-0');">
                </a>

                ${hasMultiple ? `
                <div class="absolute top-3 right-3 z-50 bg-black/80 text-white text-[10px] px-2 py-1 rounded shadow-lg flex items-center gap-1 font-mono border border-neutral-600">
                    <i class="bi bi-images"></i> ${images.length}
                </div>
                ` : ''}

                <div class="absolute top-0 left-0 w-full bg-gradient-to-b from-black/90 via-black/60 to-transparent p-4 pb-12 z-40 -translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center text-center pointer-events-none">
                    <h3 class="text-white font-semibold text-[10px] sm:text-sm lg:text-base drop-shadow-md">${cert.title}</h3>
                </div>
        `;

		if (hasMultiple) {
			for (let i = 1; i < images.length; i++) {
				slideHTML += `<a href="${images[i]}" class="glightbox hidden" data-gallery="${galleryId}" data-title="${cert.title} - ${cert.year || ''} (${i + 1}/${images.length})"></a>`;
			}
		}

		slideHTML += `</div>`;
		carouselWrapper.innerHTML += slideHTML;
	});

	// Inisialisasi Ulang Swiper (Gak ada ubahan di sini)
	if (certSwiper) certSwiper.destroy();

	// Inisialisasi Swiper Sertifikat (Versi Mobile Friendly)
	certSwiper = new Swiper(".mySwiper", {
		// FIX MOBILE <= 430px: Dibuat 1.15 biar slide sebelahnya 'ngintip' sedikit
		// Ini ngasih sinyal ke user kalau "Ini bisa digeser horizontal loh!"
		slidesPerView: 1.15,
		spaceBetween: 15,
		centeredSlides: true,
		loop: posts.length > 1,
		grabCursor: true,
		allowTouchMove: true,

		breakpoints: {
			// >= 431px (Phablet / HP agak lebar)
			431: {
				slidesPerView: 1,
				spaceBetween: 20,
			},
			// >= 768px (Tablet/Laptop)
			768: {
				slidesPerView: 1,
				spaceBetween: 20,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
				pagination: {
					el: ".swiper-pagination",
					clickable: true,
				},
			}
		},
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
	});

	refreshLightbox();
	initAnimeScroll();
}

// Variable Global untuk Swiper Marquee
let softwareSwiper, creativeSwiper;

// Fungsi Menarik Data Works (Software & Creative)
async function fetchWorks() {
	const { data, error } = await supabaseClient
		.from('posts')
		.select('*')
		.in('type', ['software', 'creative'])
		.order('order_num', { ascending: true })
		.order('created_at', { ascending: false });

	if (error) {
		console.error("Gagal mengambil data works:", error);
		return;
	}

	const softwareData = data.filter(item => item.type === 'software');
	const creativeData = data.filter(item => item.type === 'creative');

	renderWorks(softwareData, 'software-items', 'softwareSwiper', '.swiper-software');
	renderWorks(creativeData, 'creative-items', 'creativeSwiper', '.swiper-creative');
}

// Fungsi Dinamis Render Works (Software & Creative)
function renderWorks(posts, containerId, swiperVarName, swiperSelector) {
	const wrapper = document.getElementById(containerId);
	wrapper.innerHTML = '';

	if (!posts || posts.length === 0) {
		wrapper.innerHTML = '<div class="w-full flex justify-center text-neutral-500">Belum ada karya.</div>';
		return;
	}

	// ==========================================
	// SMART FIX: Gandakan secukupnya saja untuk memicu sistem "Recycle" Swiper
	// ==========================================
	let extendedPosts = [...posts];

	// Kalau karya aslimu kurang dari 6, kita copy secukupnya biar layar laptop penuh di detik pertama.
	// Setelah itu, Swiper bakal ngurus sisanya (mindahin yang di kiri ke kanan) secara otomatis.
	if (extendedPosts.length < 6) {
		extendedPosts = [...posts, ...posts, ...posts];
	}

	extendedPosts.forEach((post) => {
		const images = post.images || [];
		if (images.length === 0) return;

		const highResUrl = images[0];
		const lastDotIndex = highResUrl.lastIndexOf('.');
		const lowResUrl = highResUrl.substring(0, lastDotIndex) + '-low.webp';

		const hasMultiple = images.length > 1;
		const galleryId = `work-${post.id}`;
		const isVideoUrl = highResUrl.match(/\.(mp4|webm|ogg)$/i);

		let slideHTML = `
            <div class="swiper-slide w-[280px] sm:w-[360px] lg:w-[400px] aspect-[4/3] flex justify-center items-center relative overflow-hidden bg-[#11121a] shadow-[0_0_20px_black] rounded-lg group mx-2 cursor-zoom-in">
                
                <img src="${lowResUrl}" class="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 z-0 transition-transform duration-500 group-hover:scale-125" alt="bg">
                <div class="absolute inset-0 bg-black/50 z-0"></div>
                
                <div class="absolute bottom-3 left-3 z-40 flex gap-2">
                    ${post.year ? `
                    <div class="bg-blue-600/80 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow-lg flex items-center gap-1 font-mono border border-blue-400/30">
                        <i class="bi bi-calendar-event"></i> ${post.year}
                    </div>
                    ` : ''}

                    ${post.link ? `
                    <a href="${post.link}" target="_blank" class="bg-neutral-800/80 hover:bg-neutral-600 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow-lg flex items-center justify-center font-mono border border-neutral-500/50 transition-colors pointer-events-auto">
                        <i class="bi bi-link-45deg text-sm"></i>
                    </a>
                    ` : ''}
                </div>

                <a href="${highResUrl}" class="glightbox absolute inset-0 z-10 flex justify-center items-center group-hover:scale-105 transition-transform duration-300" data-gallery="${galleryId}" data-title="${post.title} - ${post.year || ''}">
                    ${isVideoUrl ? `<i class="bi bi-play-circle text-4xl text-white/80 absolute z-30 drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]"></i>` : ''}
                    <img src="${lowResUrl}" class="absolute w-full h-full object-contain blur-md z-10 p-5 sm:p-8 drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
                    <img src="${highResUrl}" class="absolute w-full h-full object-contain opacity-0 transition-opacity duration-700 z-20 p-2 sm:p-5 drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]" onload="this.classList.remove('opacity-0'); this.previousElementSibling.classList.add('opacity-0');">
                </a>

                ${hasMultiple ? `
                <div class="absolute top-3 right-3 z-30 bg-black/80 text-white text-[10px] px-2 py-1 rounded shadow-lg flex items-center gap-1 font-mono border border-neutral-600">
                    <i class="bi bi-images"></i> ${images.length}
                </div>
                ` : ''}

                <div class="absolute top-0 left-0 w-full bg-gradient-to-b from-black/90 via-black/60 to-transparent p-4 pb-12 z-40 -translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center pointer-events-none text-center">
                    <p class="text-white text-sm lg:text-base font-semibold drop-shadow-md">${post.title}</p>
                </div>
        `;

		if (hasMultiple) {
			for (let i = 1; i < images.length; i++) {
				slideHTML += `<a href="${images[i]}" class="glightbox hidden" data-gallery="${galleryId}" data-title="${post.title} (${i + 1}/${images.length})"></a>`;
			}
		}

		slideHTML += `</div>`;
		wrapper.innerHTML += slideHTML;
	});

	// Inisialisasi Ulang Marquee
	if (window[swiperVarName]) window[swiperVarName].destroy();
	window[swiperVarName] = new Swiper(swiperSelector, {
		slidesPerView: "auto",
		spaceBetween: 20,
		loop: true, // Swiper akan pakai logika bongkar-kiri pasang-kanan di sini
		speed: 4000,
		autoplay: { delay: 0, disableOnInteraction: false },
		allowTouchMove: true,
	});

	// Panggil fungsi Smart Lightbox (yang bikin auto-pause & indikator)
	if (typeof refreshLightbox === "function") {
		refreshLightbox();
	}
}

// Helper: Ubah teks "Nama | URL" menjadi tag <a> HTML
function renderFooterLinks(textData, containerId) {
	const container = document.getElementById(containerId);
	if (!container || !textData) return;

	container.innerHTML = '';
	const lines = textData.split('\n'); // Pisahkan per baris (Enter)

	lines.forEach(line => {
		const parts = line.split('|'); // Pisahkan nama dan link dengan pemisah "|"
		if (parts.length >= 2) {
			const name = parts[0].trim();
			const url = parts.slice(1).join('|').trim(); // Antisipasi kalau URL-nya mengandung karakter |
			container.innerHTML += `<a class="text-[10px] sm:text-[12px] lg:text-base text-white/50 hover:text-white transition-colors" href="${url}" target="_blank">${name}</a>`;
		}
	});
}

// ANIMASI 2: Ikon Sosmed Mumbul Sedikit Pas Di-load
anime({
	targets: '.bi-youtube, .bi-instagram, .bi-github, .bi-twitter, .bi-linkedin',
	translateY: [-20, 0],
	opacity: [0, 1],
	delay: anime.stagger(150, { start: 1000 }), // Munculnya bergiliran!
	duration: 1000,
	easing: 'easeOutElastic(1, .5)'
});

// Fungsi Efek Mengetik Ala Terminal (Support HTML Tags seperti <br>)
function typeWriter(elementId, text, speed) {
	let i = 0;
	const element = document.getElementById(elementId);
	element.innerHTML = ""; // Kosongkan dulu

	function type() {
		if (i < text.length) {
			// Cek apakah karakter saat ini adalah awal dari tag HTML
			if (text.charAt(i) === '<') {
				// Cari posisi penutup tag '>'
				let tagCloseIndex = text.indexOf('>', i);
				if (tagCloseIndex !== -1) {
					// Masukkan SELURUH tag sekaligus (misal: <br>)
					element.innerHTML += text.substring(i, tagCloseIndex + 1);
					i = tagCloseIndex + 1; // Lompat ke karakter setelah '>'
				} else {
					element.innerHTML += text.charAt(i);
					i++;
				}
			} else {
				// Jika bukan tag HTML, ketik huruf per huruf seperti biasa
				element.innerHTML += text.charAt(i);
				i++;
			}
			setTimeout(type, speed);
		}
	}
	type(); // Jalankan
}

// ==========================================
// PURE SIGMA FLASHLIGHT REVEAL EFFECT
// ==========================================

function initProfileFlashlight() {
	const container = document.querySelector('#profile-reveal-container div');
	const revealWrapper = document.getElementById('reveal-wrapper');

	if (!container || !revealWrapper) return;

	// Jari-jari lubang senter (makin besar angkanya, makin luas sorotannya)
	const flashlightRadius = isLowEndMobile ? 25 : 20;

	// 1. Logika Pergerakan Senter
	const moveFlashlight = (e) => {
		const rect = container.getBoundingClientRect();

		let x, y;
		if (e.type === 'touchmove') {
			x = e.touches[0].clientX - rect.left;
			y = e.touches[0].clientY - rect.top;
		} else {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		}

		const xPercent = (x / rect.width) * 100;
		const yPercent = (y / rect.height) * 100;

		anime.remove(revealWrapper);
		anime({
			targets: revealWrapper,
			easing: 'easeOutCubic',
			duration: 100,
			// Perhatikan warnanya: Black dulu, baru Transparent
			'-webkit-mask-image': `radial-gradient(circle at ${xPercent}% ${yPercent}%, black ${flashlightRadius}%, transparent ${flashlightRadius + 8}%)`,
			'mask-image': `radial-gradient(circle at ${xPercent}% ${yPercent}%, black ${flashlightRadius}%, transparent ${flashlightRadius + 8}%)`
		});
	};

	// 2. Logika Senter Hilang
	const hideFlashlight = () => {
		// Ambil posisi terakhir biar nutupnya dari titik tersebut (bukan balik ke tengah)
		const currentMask = revealWrapper.style.maskImage || revealWrapper.style.webkitMaskImage;
		const match = currentMask.match(/at (\d+\.?\d*)% (\d+\.?\d*)%/);
		const lastX = match ? match[1] : 50;
		const lastY = match ? match[2] : 50;

		anime({
			targets: revealWrapper,
			easing: 'easeInQuad',
			duration: 400,
			'-webkit-mask-image': `radial-gradient(circle at ${lastX}% ${lastY}%, black 0%, transparent 0%)`,
			'mask-image': `radial-gradient(circle at ${lastX}% ${lastY}%, black 0%, transparent 0%)`
		});
	};

	container.addEventListener('mousemove', moveFlashlight);
	container.addEventListener('touchmove', moveFlashlight, { passive: true });
	container.addEventListener('mouseleave', hideFlashlight);
	container.addEventListener('touchend', hideFlashlight);
}

// ==========================================
// HINT ANIMATION (KELAP-KELIP SIGMA)
// ==========================================
// Kita panggil fungsi ini setiap 10-15 detik
function playProfileHint() {
	const container = document.querySelector('#profile-reveal-container div');
	if (!container) return;

	// Tambah class buat trigger CSS Animation
	container.classList.add('flash-hint');

	// Hapus class setelah animasi beres biar bisa dipanggil lagi
	setTimeout(() => {
		container.classList.remove('flash-hint');
	}, 1600); // Sedikit lebih lama dari durasi animasi CSS (1.5s)
}

// ==========================================
// RENDER TECH RIBBON (TITLES ONLY)
// ==========================================

async function renderTechMarquee() {
	const marqueeContent = document.getElementById('tech-marquee-content');
	if (!marqueeContent) return;

	// 1. Tarik data dari tabel 'me'
	const { data, error } = await supabaseClient
		.from('me')
		.select('footer_tech_1, footer_tech_2')
		.single(); // Ambil satu baris profil kamu

	if (error) {
		console.error('Gagal narik data tech marquee:', error);
		return;
	}

	// 2. Fungsi Helper buat bersihin data "Judul | Link" -> "Judul"
	const parseTechData = (columnData) => {
		if (!columnData) return [];
		// Pecah berdasarkan baris baru atau koma (tergantung cara kamu input di DB)
		return columnData.split(/[\n,]+/).map(item => {
			// Ambil bagian sebelum tanda '|' dan bersihkan spasi
			return item.split('|')[0].trim();
		}).filter(Boolean); // Hapus data kosong
	};

	// 3. Proses kedua kolom dan gabungkan
	const list1 = parseTechData(data.footer_tech_1);
	const list2 = parseTechData(data.footer_tech_2);
	const allTech = [...list1, ...list2];

	// 4. Render ke HTML dengan separator titik biru
	const techString = allTech.map(tech => `
        <span class="flex items-center gap-8">
            ${tech} <span class="text-blue-500/40">•</span>
        </span>
    `).join('');

	// 5. Inject & Duplicate 3x biar gak putus (Seamless)
	marqueeContent.innerHTML = `
        <div class="animate-tech">
            ${techString} ${techString} ${techString}
        </div>
    `;
}
// Panggil fungsinya
// ==========================================
// FETCH & APPLY SOCIAL LINKS FROM SUPABASE
// ==========================================

async function initSocialLinks() {
	// 1. Ambil data dari tabel (Ganti 'settings' dengan nama tabelmu)
	const { data, error } = await supabaseClient
		.from('me')
		.select('footer_social')
		.single();

	if (error) {
		console.error('Gagal mengambil link sosial:', error);
		return;
	}

	// 2. Parsing Data (String -> Object)
	// Format asal: Instagram | https://...
	const socialLinks = {};
	const lines = data.footer_social.split('\n'); // Pecah per baris

	lines.forEach(line => {
		if (line.includes('|')) {
			const [label, url] = line.split('|').map(item => item.trim());
			socialLinks[label] = url;
		}
	});

	// 3. Suntikkan ke elemen berdasarkan [data-social]
	document.querySelectorAll('[data-social]').forEach(el => {
		const label = el.getAttribute('data-social');
		if (socialLinks[label]) {
			el.href = socialLinks[label];
			// Tambahkan target blank kecuali email
			if (label !== 'Email') el.target = "_blank";
		}
	});

	// 4. Khusus untuk CV (Biasanya ada ID khusus)
	const cvLink = document.getElementById('link-cv');
	if (cvLink && socialLinks['CV']) {
		cvLink.href = socialLinks['CV'];
		cvLink.target = "_blank";
	}
}

// Panggil di awal atau setelah loader hilang
fetchWorks();
initSocialLinks();
renderTechMarquee();
fetchAchievements();
fetchCertificates();
fetchProfileData();