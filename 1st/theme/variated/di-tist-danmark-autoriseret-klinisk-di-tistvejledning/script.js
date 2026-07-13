// region: app
document.addEventListener("DOMContentLoaded", function() {
      // 1. SMOOTH SCROLL (Lenis)
      try {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Bind Lenis scroll to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time)=>{
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } catch (error) {
        console.error("Lenis smooth scroll failed to initialize", error);
      }

      // 2. HEADER SCROLL EFFECT
      const header = document.getElementById('header');
      if (header) {
        window.addEventListener('scroll', () => {
          if (window.scrollY > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        });
      }

      // Mobile menu handled by shared/picker.js initThemeNavigation()

      // 4. GSAP ENTER REVEAL ANIMATIONS
      gsap.registerPlugin(ScrollTrigger);

      // Hero Elements Staggered entrance
      gsap.from('.hero-content > *', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      });

      gsap.from('.hero-image-wrapper', {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });

      // Simple Reveal animation for sections
      const animatedSections = document.querySelectorAll('.treatments, .subsidy, .locator, .consulting, .articles, .faq');
      animatedSections.forEach(section => {
        gsap.from(section, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
          }
        });
      });

      // 5. TILT INTIATION (Vanilla-Tilt)
      try {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
          max: 15,
          speed: 400,
          glare: true,
          "max-glare": 0.2
        });
      } catch (error) {
        console.error("Tilt script missing or broken", error);
      }

      // 6. BEHANDLINGSOMRÅDER - ACTIVE FILTERS
      const filterBtns = document.querySelectorAll('.filter-btn');
      const treatmentCards = document.querySelectorAll('.treatment-card');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Remove active from all btns
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const category = btn.getAttribute('data-filter');

          treatmentCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
              card.style.display = 'flex';
              // Quick pop anim
              gsap.fromTo(card, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
            } else {
              card.style.display = 'none';
            }
          });
        });
      });

      // 7. SUBSIDY CHART (Chart.js)
      try {
        const ctx = document.getElementById('subsidyChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['"danmark"', 'Sundhedsforsikring', 'Kommune/Læge', 'Egenbetaling'],
            datasets: [{
              label: 'Dækningsprocent (%)',
              data: [50, 100, 100, 0],
              backgroundColor: [
                '#3393C0', // Primary Blue
                '#7A9E7E', // Dusty Green
                '#D4B896', // Light Brown/Sand
                '#64412F'  // Warm Brown
              ],
              borderRadius: 8,
              borderWidth: 0,
              barThickness: 32
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Op til ${context.raw}% dækket`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + "%";
                  },
                  font: {
                    family: 'Plus Jakarta Sans'
                  }
                },
                grid: {
                  color: 'rgba(100, 65, 47, 0.05)'
                }
              },
              x: {
                ticks: {
                  font: {
                    family: 'Plus Jakarta Sans',
                    weight: 600
                  }
                },
                grid: {
                  display: false
                }
              }
            }
          }
        });
      } catch (err) {
        console.error("Chart.js failed to initialize", err);
      }

      // 8. CLINICS DATA, SEARCH & LEAFLET MAP
      const clinics = [
        { name: "Klinik København K", city: "København", lat: 55.6761, lng: 12.5683, specialty: "ibs weight", address: "Strøget 4, 1100 Kbh K", tel: "+45 70 20 30 41" },
        { name: "Klinik Aarhus C", city: "Aarhus", lat: 56.1567, lng: 10.2108, specialty: "weight sport", address: "Vestergade 12, 8000 Aarhus C", tel: "+45 70 20 30 42" },
        { name: "Klinik Odense C", city: "Odense", lat: 55.3959, lng: 10.3883, specialty: "ibs children", address: "Kongensgade 44, 5000 Odense C", tel: "+45 70 20 30 43" },
        { name: "Klinik Aalborg", city: "Aalborg", lat: 57.0488, lng: 9.9217, specialty: "weight", address: "Nytorv 8, 9000 Aalborg", tel: "+45 70 20 30 44" },
        { name: "Klinik Esbjerg", city: "Esbjerg", lat: 55.4703, lng: 8.4519, specialty: "sport ibs", address: "Kongensgade 102, 6700 Esbjerg", tel: "+45 70 20 30 45" },
        { name: "Klinik Roskilde", city: "Roskilde", lat: 55.6415, lng: 12.0878, specialty: "children weight", address: "Algade 34, 4000 Roskilde", tel: "+45 70 20 30 46" }
      ];

      // Initialize Map
      let map;
      let markers = [];
      try {
        // Centered around Denmark
        map = L.map('map', {
          scrollWheelZoom: false
        }).setView([55.9, 11.0], 6);

        // Warm, light map tiles appropriate for the health theme
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add markers
        clinics.forEach(clinic => {
          const marker = L.marker([clinic.lat, clinic.lng]).addTo(map);
          marker.bindPopup(`<b>${clinic.name}</b><br>${clinic.address}<br>Tel: ${clinic.tel}`);
          markers.push({ id: clinic.name, markerObj: marker });
        });
      } catch (err) {
        console.error("Leaflet map initialization failed", err);
      }

      // Render clinic list in sidebar
      const resultsContainer = document.getElementById('results-list');
      const searchInput = document.getElementById('clinic-search');
      const specialtyPills = document.querySelectorAll('.pill');

      let activeSpecialty = 'all';
      let searchQuery = '';

      function renderClinics() {
        resultsContainer.innerHTML = '';
        
        const filtered = clinics.filter(clinic => {
          const matchesSearch = clinic.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                clinic.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesSpecialty = activeSpecialty === 'all' || clinic.specialty.includes(activeSpecialty);
          return matchesSearch && matchesSpecialty;
        });

        if (filtered.length === 0) {
          resultsContainer.innerHTML = '<p style="padding: 16px; font-size: 0.9rem; color: #777;">Ingen klinikker fundet...</p>';
          return;
        }

        filtered.forEach(clinic => {
          const card = document.createElement('div');
          card.className = 'clinic-result-card';
          card.innerHTML = `
            <h5>${clinic.name}</h5>
            <p><i class="fa-solid fa-location-dot" style="margin-right: 6px; color: var(--primary-blue);"></i>${clinic.address}</p>
            <p><i class="fa-solid fa-phone" style="margin-right: 6px; color: var(--dusty-green);"></i>${clinic.tel}</p>
          `;

          card.addEventListener('click', () => {
            // Remove active style from other cards
            document.querySelectorAll('.clinic-result-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Pan to map marker
            if (map) {
              map.setView([clinic.lat, clinic.lng], 13);
              const matchingMarkerObj = markers.find(m => m.id === clinic.name);
              if (matchingMarkerObj) {
                matchingMarkerObj.markerObj.openPopup();
              }
            }
          });

          resultsContainer.appendChild(card);
        });
      }

      // Input events
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderClinics();
      });

      specialtyPills.forEach(pill => {
        pill.addEventListener('click', () => {
          specialtyPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeSpecialty = pill.getAttribute('data-specialty');
          renderClinics();
        });
      });

      // Initial run
      renderClinics();

      // 9. FAQ ACCORDION INTERACTIVITY
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(f => f.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      });

    });
// endregion: app