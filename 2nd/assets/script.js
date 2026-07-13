// region: app
document.addEventListener('DOMContentLoaded', () => {
      // 1. ANIME/GSAP ENTRANCE ANIMATIONS
      try {
        gsap.from('.hero-content > *', {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power3.out'
        });

        gsap.from('.hero-graphic', {
          opacity: 0,
          x: 50,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.3
        });
      } catch (e) {
        console.error('GSAP animation error:', e);
      }

      // 2. COUNTER ANIMATION FOR METRICS
      const animateCounter = (id, target) => {
        let current = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / target));
        const obj = document.getElementById(id);
        if (!obj) return;
        
        const timer = setInterval(() => {
          current += Math.ceil(target / 100);
          if (current >= target) {
            obj.innerText = target + (id === 'count-members' ? '+' : 'k+');
            clearInterval(timer);
          } else {
            obj.innerText = current + (id === 'count-members' ? '+' : 'k+');
          }
        }, stepTime);
      };

      animateCounter('count-members', 240);
      animateCounter('count-consultations', 15);

      // 3. INTERACTIVE REGIONAL MAP & SEARCH FILTER
      const mapRegions = document.querySelectorAll('.map-region');
      const regionBtns = document.querySelectorAll('.region-btn');
      const currentRegionText = document.getElementById('current-region-text');
      const resultsCountBadge = document.getElementById('results-count-badge');
      const dietitianCards = document.querySelectorAll('.dietitian-card');
      const specialtySelector = document.getElementById('hero-specialty');
      const regionSelector = document.getElementById('hero-region');
      const searchBtn = document.getElementById('hero-search-btn');

      let activeRegion = 'alle';
      let activeSpecialty = 'alle';

      const updateFilters = () => {
        let count = 0;
        dietitianCards.forEach(card => {
          const cardRegions = card.getAttribute('data-regions').split(' ');
          const cardSpecs = card.getAttribute('data-specs') ? card.getAttribute('data-specs').split(' ') : [];
          
          const regionMatch = (activeRegion === 'alle' || cardRegions.includes(activeRegion));
          const specialtyMatch = (activeSpecialty === 'alle' || cardSpecs.includes(activeSpecialty));

          if (regionMatch && specialtyMatch) {
            card.style.display = 'grid';
            count++;
          } else {
            card.style.display = 'none';
          }
        });

        // Update badge and text
        const regionNameMap = {
          'alle': 'Hele landet',
          'hovedstaden': 'Hovedstaden',
          'sjaelland': 'Sjælland',
          'syddanmark': 'Syddanmark',
          'midtjylland': 'Midtjylland',
          'nordjylland': 'Nordjylland'
        };
        if (currentRegionText) {
          currentRegionText.innerText = regionNameMap[activeRegion] || activeRegion;
        }
        if (resultsCountBadge) {
          resultsCountBadge.innerText = `${count} fundet`;
        }
      };

      // Map Paths Click Event
      mapRegions.forEach(region => {
        region.addEventListener('click', () => {
          mapRegions.forEach(r => r.classList.remove('active'));
          region.classList.add('active');
          activeRegion = region.getAttribute('data-region');
          
          // Sync region buttons
          regionBtns.forEach(btn => {
            if(btn.getAttribute('data-region') === activeRegion) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });

          updateFilters();
        });
      });

      // Region Legend Buttons Click Event
      regionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          regionBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeRegion = btn.getAttribute('data-region');

          // Sync SVG Map
          mapRegions.forEach(r => {
            if(r.getAttribute('data-region') === activeRegion) {
              r.classList.add('active');
            } else {
              r.classList.remove('active');
            }
          });

          updateFilters();
        });
      });

      // Modular Specialties quick-click filtering
      const specialtyCards = document.querySelectorAll('.specialty-card');
      specialtyCards.forEach(card => {
        card.addEventListener('click', () => {
          const spec = card.getAttribute('data-specialty');
          if (spec) {
            activeSpecialty = spec;
            specialtySelector.value = spec;
            updateFilters();
            // Scroll to finder section
            document.getElementById('find-diaetist').scrollIntoView({ behavior: 'smooth' });
          }
        });
      });

      // Hero Widget Search
      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          activeRegion = regionSelector.value;
          activeSpecialty = specialtySelector.value;

          // Sync Region Buttons & Map
          regionBtns.forEach(b => {
            if(b.getAttribute('data-region') === activeRegion) b.classList.add('active');
            else b.classList.remove('active');
          });
          mapRegions.forEach(r => {
            if(r.getAttribute('data-region') === activeRegion) r.classList.add('active');
            else r.classList.remove('active');
          });

          updateFilters();
          document.getElementById('find-diaetist').scrollIntoView({ behavior: 'smooth' });
        });
      }

      // 4. ACCORDION (FAQ) FUNCTIONALITY
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          
          // Close all FAQ items
          faqItems.forEach(i => {
            i.classList.remove('active');
            i.querySelector('.faq-content').style.maxHeight = '0';
          });

          if (!isOpen) {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      });

      // Mobile navigation handled by shared/picker.js initThemeNavigation()

    });
// endregion: app