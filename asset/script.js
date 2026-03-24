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

// ==========================================
// MESIN ANIMASI SCROLL CUSTOM (ANIME.JS) - FLIP DENGAN PENGECUALIAN
// ==========================================

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

const scrollObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		const el = entry.target;
		const animType = el.getAttribute('data-anime');
		const delay = el.getAttribute('data-anime-delay') || 0;

		// CEK PENGECUALIAN: Apakah elemen ini punya atribut anti-flip?
		const noFlip = el.hasAttribute('data-anime-no-flip');

		// KUNCI: Kalau noFlip ada, multiplier SELALU 1 (normal). Kalau gak ada, ikuti arah scroll.
		const dirMultiplier = (isScrollingDown || noFlip) ? 1 : -1;

		let startY = 0;
		let startX = 0;
		let startScale = 1;

		if (animType === 'fade-up') startY = 50 * dirMultiplier;
		if (animType === 'fade-right') startX = -50 * dirMultiplier;
		if (animType === 'fade-left') startX = 50 * dirMultiplier;
		if (animType === 'zoom-in') startScale = 0.8;

		if (entry.isIntersecting) {
			anime.remove(el);

			// GUNANYA DI SINI:
			// Jika HP, durasi dicepetin jadi 200ms & startY jadi 0 biar gak berat ngerender gerak
			const finalDuration = isLowEndMobile ? 200 : 1000;
			const mobileY = isLowEndMobile ? 0 : startY;
			const mobileX = isLowEndMobile ? 0 : startX;

			// ANIMASI MUNCUL
			anime({
				targets: el,
				opacity: [0, 1],
				translateY: [mobileY, 0], // Jadi 0 kalau di HP
				translateX: [mobileX, 0], // Jadi 0 kalau di HP
				scale: [startScale, 1],
				duration: finalDuration, // Jadi instan/cepet kalau di HP
				delay: parseInt(delay),
				easing: 'easeOutCubic'
			});
		}
	});
}, {
	root: null,
	rootMargin: '0px',
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

		// Logika Progressive Image untuk Profil
		const highResUrl = data.image_url;

		// Cek apakah data gambar profil valid dari Supabase Storage
		if (highResUrl && highResUrl.includes('supabase.co')) {
			const lastDotIndex = highResUrl.lastIndexOf('.');
			const lowResUrl = highResUrl.substring(0, lastDotIndex) + '-low.webp';

			const imgLow = document.getElementById('profile-img-low');
			const imgHigh = document.getElementById('profile-img-high');
			const favicon = document.getElementById('web-favicon');

			// --- BAGIAN PENTING: KONTROL FULL-SCREEN LOADER ---
			// Ketika gambar profil versi LOW-RES (yg ukurannya kecil banget) sudah dimuat,
			// barulah kita menghilangkan layar loading hitam. Web siap dilihat.
			imgLow.onload = () => {
				globalLoader.style.opacity = '0'; // Buat layar jadi transparan halus
				setTimeout(() => globalLoader.classList.add('hidden'), 700); // Setelah 0.7s, hapus elemennya total
			};

			// Beri perintah untuk memuat gambar
			imgLow.src = lowResUrl;
			imgHigh.src = highResUrl;
			favicon.href = highResUrl; // Gunakan foto profil juga sebagai ikon web (favicon)

		} else {
			// Jika belum ada foto di database/upload gagal, langsung buka loading screen agar web tidak freeze
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

	posts.forEach((post, index) => {
		const isHighlight = index < 3;
		const images = post.images || [];
		if (images.length === 0) return;

		const highResUrl = images[0];
		const lastDotIndex = highResUrl.lastIndexOf('.');
		const lowResUrl = highResUrl.substring(0, lastDotIndex) + '-low.webp';

		const hasMultiple = images.length > 1;
		const galleryId = `achieve-${post.id}`;

		// Cek apakah file adalah video
		const isVideoUrl = highResUrl.match(/\.(mp4|webm|ogg)$/i);

		let cardHTML = `
            <div data-aos="${isHighlight ? 'fade-up' : ''}" class="bg-[#11121a] rounded-lg relative overflow-hidden group aspect-[4/3] w-full flex items-center justify-center border border-transparent hover:border-neutral-500 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-zoom-in">
                
                <img src="${lowResUrl}" class="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 z-0 transition-transform duration-500 group-hover:scale-125" alt="bg">
                <div class="absolute inset-0 bg-black/50 z-0"></div>

                ${post.year ? `
                <div class="absolute top-3 left-3 z-30 bg-blue-600/80 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-1 rounded shadow-lg flex items-center gap-1 font-mono border border-blue-400/30">
                    <i class="bi bi-calendar-event"></i> ${post.year}
                </div>
                ` : ''}

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

		// Trik GLightbox untuk gambar ke-2 dan seterusnya
		if (hasMultiple) {
			for (let i = 1; i < images.length; i++) {
				cardHTML += `<a href="${images[i]}" class="glightbox hidden" data-gallery="${galleryId}" data-title="${post.title} - ${post.year || ''} (${i + 1}/${images.length})"></a>`;
			}
		}

		cardHTML += `</div>`;

		// Masukkan ke container yang tepat (Highlight atau Laci)
		if (isHighlight) {
			highlightContainer.innerHTML += cardHTML;
		} else {
			drawerContainer.innerHTML += cardHTML;
		}
	});

	// Munculkan tombol Show More kalau data lebih dari 3
	if (posts.length > 3) {
		btnShowMore.classList.remove('hidden');
	}

	// Inisialisasi GLightbox baru setelah HTML selesai dirender
	if (customLightbox) customLightbox.destroy(); // Hapus yang lama kalau ada
	customLightbox = GLightbox({
		selector: '.glightbox',
		touchNavigation: true,
		loop: true,
		zoomable: true
	});

	initAnimeScroll();
}

// Fungsi Buka Tutup Laci
function toggleAchievementDrawer() {
	const drawer = document.getElementById('achievement-drawer');
	const btn = document.getElementById('btn-show-more-achievements');

	if (drawer.classList.contains('hidden')) {
		// Buka laci
		drawer.classList.remove('hidden');
		btn.innerHTML = 'Show Less <i class="bi bi-chevron-up ml-1"></i>';
	} else {
		// Tutup laci
		drawer.classList.add('hidden');
		btn.innerHTML = 'Show More <i class="bi bi-chevron-down ml-1"></i>';
		// Auto scroll layar balik ke atas Achievement biar gak tersesat
		document.getElementById('Achievement').scrollIntoView({ behavior: 'smooth' });
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
		slidesPerView: 1, // Fokus satu sertifikat per slide di HP
		spaceBetween: 20,
		centeredSlides: true,

		// BIAR BISA GESER KIRI-KANAN DENGAN LANCAR:
		loop: posts.length > 1, // Aktifkan loop HANYA jika sertifikat lebih dari 1
		grabCursor: true,
		allowTouchMove: true, // Pastikan sentuhan jari aktif

		// Hilangkan navigasi & pagination di layar kecil via Breakpoints
		breakpoints: {
			// Ketika lebar layar >= 768px (Tablet/Laptop)
			768: {
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

		// Autoplay biar makin cakep
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
	});

	if (customLightbox) customLightbox.destroy();
	customLightbox = GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true, zoomable: true });

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

// Fungsi Dinamis Render Works (Software & Creative) dengan Spotify Effect
function renderWorks(posts, containerId, swiperVarName, swiperSelector) {
	const wrapper = document.getElementById(containerId);
	wrapper.innerHTML = '';

	if (!posts || posts.length === 0) {
		wrapper.innerHTML = '<div class="w-full flex justify-center text-neutral-500">Belum ada karya.</div>';
		return;
	}

	posts.forEach((post) => {
		const images = post.images || [];
		if (images.length === 0) return;

		const highResUrl = images[0];
		const lastDotIndex = highResUrl.lastIndexOf('.');
		const lowResUrl = highResUrl.substring(0, lastDotIndex) + '-low.webp';

		const hasMultiple = images.length > 1;
		const galleryId = `work-${post.id}`;

		// Cek apakah file adalah video
		const isVideoUrl = highResUrl.match(/\.(mp4|webm|ogg)$/i);

		let slideHTML = `
            <div class="swiper-slide w-[280px] sm:w-[360px] lg:w-[400px] aspect-[4/3] flex justify-center items-center relative overflow-hidden bg-[#11121a] shadow-[0_0_20px_black] rounded-lg group mx-2 cursor-zoom-in">
                
                <img src="${lowResUrl}" class="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 z-0 transition-transform duration-500 group-hover:scale-125" alt="bg">
                <div class="absolute inset-0 bg-black/50 z-0"></div>
                
                ${post.year ? `
                <div class="absolute bottom-3 left-3 z-30 bg-blue-600/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded shadow-lg flex items-center gap-1 font-mono border border-blue-400/30">
                    <i class="bi bi-calendar-event"></i> ${post.year}
                </div>
                ` : ''}

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

	// Inisialisasi Ulang Marquee (Gak ada ubahan di sini)
	if (window[swiperVarName]) window[swiperVarName].destroy();
	window[swiperVarName] = new Swiper(swiperSelector, {
		slidesPerView: "auto",
		spaceBetween: 20,
		loop: posts.length > 3,
		speed: 4000,
		autoplay: { delay: 0, disableOnInteraction: false },
		allowTouchMove: true,
	});

	if (customLightbox) customLightbox.destroy();
	customLightbox = GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true, zoomable: true });

	initAnimeScroll();
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

fetchWorks();
fetchAchievements();
fetchCertificates();
fetchProfileData();