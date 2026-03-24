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
		document.getElementById('profile-name').innerHTML = data.name;
		document.getElementById('profile-alias').innerText = data.alias;
		document.getElementById('profile-alias').title = data.alias;
		document.getElementById('profile-role').innerHTML = data.role;
		document.getElementById('profile-org').innerText = data.organization;
		document.getElementById('profile-org').title = data.organization;
		document.getElementById('profile-desc').innerHTML = data.description;

		// Suntikkan Data Footer Links
		renderFooterLinks(data.footer_tech_1, 'tech-col-1');
		renderFooterLinks(data.footer_tech_2, 'tech-col-2');
		renderFooterLinks(data.footer_thanks, 'thanks-col');
		renderFooterLinks(data.footer_social, 'social-col');

		// Suntikkan Copyright Otomatis (Mengambil Nama & Alias dari DB)
		const nameLink = document.getElementById('footer-name-link');
		const aliasLink = document.getElementById('footer-alias-link');
		const currentYear = new Date().getFullYear();

		nameLink.innerText = `By ${data.name}`;
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
			globalLoader.style.opacity = '0';
			setTimeout(() => globalLoader.classList.add('hidden'), 700);
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
	certSwiper = new Swiper(".mySwiper", {
		spaceBetween: 30,
		effect: "slide",
		loop: true,
		autoplay: { delay: 10000, disableOnInteraction: false },
		pagination: { el: ".swiper-pagination", clickable: true },
		navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
	});

	if (customLightbox) customLightbox.destroy();
	customLightbox = GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true, zoomable: true });
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
		loop: true,
		speed: 4000,
		autoplay: { delay: 0, disableOnInteraction: false },
		allowTouchMove: true,
	});

	if (customLightbox) customLightbox.destroy();
	customLightbox = GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true, zoomable: true });
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

fetchWorks();
fetchAchievements();
fetchCertificates();
fetchProfileData();