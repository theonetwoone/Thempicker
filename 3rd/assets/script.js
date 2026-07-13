// region: app
// Initialize Animations & Interactions
    document.addEventListener("DOMContentLoaded", function() {
      
      // Initialize AOS (Animate on Scroll)
      try {
        AOS.init({
          duration: 800,
          once: true,
          easing: 'ease-out-quad'
        });
      } catch(e) { console.error("AOS failed to load", e); }

      // Initialize Smooth Scroll (Lenis)
      try {
        const lenis = new Lenis();
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch(e) { console.error("Lenis smooth scroll failed", e); }

      // Mobile menu handled by shared/picker.js initThemeNavigation()

      // FAQ Accordion functionality
      const faqHeaders = document.querySelectorAll('.faq-header');
      faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
          const item = header.parentElement;
          item.classList.toggle('active');
        });
      });

      // Interactive simulated map details
      const pins = document.querySelectorAll('.map-pin');
      const tooltip = document.getElementById('mapTooltip');
      const tooltipTitle = document.getElementById('tooltipTitle');
      const tooltipDesc = document.getElementById('tooltipDesc');

      const clinicData = {
        "Aalborg": { title: "Diætist Danmark — Aalborg", desc: "Specialister i vægttab og hjerte-kar-sygdomme. Ringvejen 4, Aalborg." },
        "Aarhus": { title: "Diætist Danmark — Aarhus", desc: "Eksperter i irritabel tarm (IBS) og FODMAP. Vestergade 12, Aarhus C." },
        "Odense": { title: "Diætist Danmark — Odense", desc: "Sportsernæring og diabetesregulering. Kongensgade 44, Odense." },
        "København": { title: "Diætist Danmark — København", desc: "Hovedafdeling. Alle kliniske specialer og spiseforstyrrelser. Nørrebrogade 82, Kbh N." }
      };

      pins.forEach(pin => {
        pin.addEventListener('click', () => {
          pins.forEach(p => p.classList.remove('active'));
          pin.classList.add('active');
          const city = pin.getAttribute('data-city');
          if(clinicData[city]) {
            tooltipTitle.textContent = clinicData[city].title;
            tooltipDesc.textContent = clinicData[city].desc;
            tooltip.classList.add('visible');
          }
        });
      });

      // Search Action Simulation
      const searchBtn = document.getElementById('searchBtn');
      const resultsList = document.getElementById('resultsList');
      if(searchBtn && resultsList) {
        searchBtn.addEventListener('click', () => {
          const postnr = document.getElementById('postnr').value || "Dit område";
          const speciale = document.getElementById('specialeSelect').value || "Generel Rådgivning";
          
          resultsList.innerHTML = `
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">
              <h5 style="color: var(--primary); font-family: var(--font-sans); font-size: 1rem; margin-bottom: 4px;">Nærmeste match i nærheden af: ${postnr}</h5>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Klinik med speciale i ${speciale}</p>
              <a href="#konsulent" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem; min-height: auto;">Book tid online</a>
            </div>
          `;
        });
      }

    });
// endregion: app