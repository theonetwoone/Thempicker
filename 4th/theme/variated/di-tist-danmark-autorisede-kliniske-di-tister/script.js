// region: app
// Treatment Information Database (10 items)
        const treatmentsData = {
            weight: {
                title: "Overvægt & Vægttab",
                icon: "trending-down",
                html: `
                    <p>Et varigt vægttab opnås ikke gennem strikse forbud eller ekstreme kure, som sjældent holder i længden. Vi arbejder i stedet med vaner, mønstre og intuitive kostændringer, der passer naturligt ind i din hverdag.</p>
                    <h4>Vores tilgang:</h4>
                    <ul>
                        <li>Fokus på mæthed og stabilt blodsukker.</li>
                        <li>Afmontering af madstress og dårlig samvittighed.</li>
                        <li>Praktiske værktøjer til indkøb og madlavning.</li>
                        <li>Fokus på vaneændring, der sikrer resultater, der holder.</li>
                    </ul>
                    <p>Du får en individuel kostplan, der tager hensyn til dine præferencer, så du stadig kan nyde sociale arrangementer og familiemåltider.</p>
                `
            },
            ibs: {
                title: "Irriteret tyktarm (IBS)",
                icon: "activity",
                html: `
                    <p>Mave-tarmproblemer kan hæmme livskvaliteten markant. Som autoriserede kliniske diætister er vi uddannede i at vejlede i Low FODMAP diæten samt andre mavevenlige strategier.</p>
                    <h4>Vores ekspertise dækker:</h4>
                    <ul>
                        <li>Systematisk udelukkelse og genintroduktion (Low FODMAP).</li>
                        <li>Optimering af fiberindtag og væskebalance.</li>
                        <li>Identifikation af personlige triggere.</li>
                        <li>Rådgivning om tarmflora og præbiotika.</li>
                    </ul>
                    <p>Vi guider dig sikkert igennem processen, så du ikke begrænser din kost mere end højst nødvendigt.</p>
                `
            },
            diabetes: {
                title: "Type 2 Diabetes",
                icon: "heart-pulse",
                html: `
                    <p>Maden er en af de mest kraftfulde faktorer, når det gælder forebyggelse og regulering af Type 2 Diabetes og prædiabetes. Med den rette kostsammensætning kan du opnå et stabilt blodsukker og mindske behovet for medicin.</p>
                    <h4>Fokusområder:</h4>
                    <ul>
                        <li>Forståelse af kulhydratkvalitet og mængde.</li>
                        <li>Stabilisering af insulinfølsomhed.</li>
                        <li>Vægttab, hvis det er et mål eller en nødvendighed.</li>
                        <li>Lækre alternativer til dine hverdagsfavoritter.</li>
                    </ul>
                `
            },
            cardio: {
                title: "Hjerte-kar-sygdomme",
                icon: "heart",
                html: `
                    <p>Ernæringsterapi spiller en afgørende rolle i at sænke kolesteroltallet og regulere blodtrykket. Vi sammensætter en hjertevenlig kost, der beskytter dine blodkar.</p>
                    <h4>Hvad vi arbejder med:</h4>
                    <ul>
                        <li>Reduktion af det mættede fedt til fordel for umættet fedt.</li>
                        <li>Øget indtag af kostfibre, grøntsager og fuldkorn.</li>
                        <li>Saltreduktion, der smager af noget.</li>
                        <li>Brug af funktionelle fødevarer som nødder, frø og fed fisk.</li>
                    </ul>
                `
            },
            ed: {
                title: "Spiseforstyrrelser",
                icon: "smile",
                html: `
                    <p>Vi tilbyder professionel, nænsom og tværfaglig ernæringsterapi til personer med overspisning (BED), ortorexi eller et generelt anstrengt forhold til mad, krop og vægt.</p>
                    <h4>Målet med samtalerne:</h4>
                    <ul>
                        <li>Genetablering af naturlige mætheds- og sultsignaler.</li>
                        <li>Frigørelse fra rigtigt/forkert tænkning omkring mad.</li>
                        <li>Reduktion af overspisningsepisoder.</li>
                        <li>Følelsesmæssig bevidsthed i relation til mad.</li>
                    </ul>
                `
            },
            sports: {
                title: "Sportsernæring",
                icon: "zap",
                html: `
                    <p>Uanset om du er elitedanser, maratonløber eller styrkeløfter, kan den rette ernæring løfte dine præstationer og optimere din restitution.</p>
                    <h4>Vi tilbyder:</h4>
                    <ul>
                        <li>Præcise energi- og proteinberegninger.</li>
                        <li>Timing af måltider før, under og efter træning.</li>
                        <li>Hydreringsstrategier til konkurrencedage.</li>
                        <li>Vurdering og rådgivning om kosttilskud.</li>
                    </ul>
                `
            },
            kids: {
                title: "Børn & Unge",
                icon: "baby",
                html: `
                    <p>Kost til børn kræver en særlig pædagogisk og nænsom tilgang. Vi hjælper forældre med at skabe madglæde i familien uden konflikter.</p>
                    <h4>Typiske emner:</h4>
                    <ul>
                        <li>Ekstrem kræsenhed eller selektiv spisning.</li>
                        <li>Udfordringer med væksten (over- eller undervægt).</li>
                        <li>Allergier og intolerancer hos de mindste.</li>
                        <li>Sunde madpakker, som rent faktisk bliver spist.</li>
                    </ul>
                `
            },
            pcos: {
                title: "PCOS & Hormoner",
                icon: "sparkles",
                html: `
                    <p>Polycystisk ovariesyndrom (PCOS) hænger ofte sammen med insulinresistens. Med de rette kostjusteringer kan du mindske symptomer som uønsket hårvækst, træthed og fertilitetsproblemer.</p>
                    <h4>Vores strategier:</h4>
                    <ul>
                        <li>Blodsukkerstabiliserende kost (lave glykæmiske indeks).</li>
                        <li>Antiinflammatoriske fødevarer.</li>
                        <li>Vægtstyring og forbedring af ægløsning.</li>
                        <li>Naturlige kosttilskud, der støtter hormonbalancen.</li>
                    </ul>
                `
            },
            allergy: {
                title: "Fødevareallergi",
                icon: "shield-alert",
                html: `
                    <p>Cøliaki, laktoseintolerance eller svær fødevareallergi kan gøre indkøb og madlavning uoverskuelig. Vi guider dig til en varieret og sikker kost.</p>
                    <h4>Hvad du får hjælp til:</h4>
                    <ul>
                        <li>Identifikation af skjulte kilder til allergener.</li>
                        <li>Sikring af tilstrækkeligt indtag af calcium, jern og B-vitaminer.</li>
                        <li>Opskrifter og erstatningsprodukter af høj kvalitet.</li>
                        <li>Allergi-venlig madlavning for hele husstanden.</li>
                    </ul>
                `
            },
            underweight: {
                title: "Undervægt & Småtspisende",
                icon: "scale",
                html: `
                    <p>Ufrivilligt vægttab og nedsat appetit kan have alvorlige konsekvenser for muskelmasse, immunforsvar og energiniveau – især hos ældre eller efter sygdom.</p>
                    <h4>Ernæringsindsatsen:</h4>
                    <ul>
                        <li>Energitætning af den almindelige mad med gode fedtstoffer.</li>
                        <li>Små, hyppige måltider tilpasset appetitten.</li>
                        <li>Brug af medicinske ernæringsdrikke, hvor det er nødvendigt.</li>
                        <li>Støtte til genvinding af muskelstyrke og livsmod.</li>
                    </ul>
                `
            }
        };

        // Dietitian Directory Mock Database
        const dietitiansData = [
            { name: "Signe Hansen", region: "Sjælland", city: "København K", specs: ["IBS", "Vægttab", "Spiseforstyrrelser"], img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" },
            { name: "Morten Krogh", region: "Jylland", city: "Aarhus C", specs: ["Diabetes", "Sport", "Vægttab"], img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" },
            { name: "Camilla Vestergaard", region: "Fyn", city: "Odense C", specs: ["Børn", "PCOS", "IBS"], img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150" },
            { name: "Andreas Nielsen", region: "Jylland", city: "Aalborg", specs: ["Sport", "Diabetes", "Cardio"], img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150" },
            { name: "Hanne Lind", region: "Sjælland", city: "Roskilde", specs: ["Vægttab", "Børn", "Allergi"], img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
            { name: "Kristine Bech", region: "Bornholm", city: "Rønne", specs: ["IBS", "Vægttab", "PCOS"], img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=150" }
        ];

        let selectedRegionFilter = 'alle';
        let selectedSpecialtyFilter = 'alle';

        // Initialize Icons and Directory
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            renderDietitians();
            updateCalculations();
            // Mobile nav handled by shared/picker.js initThemeNavigation()
        });

        // Toggle FAQ Accordion
        function toggleFaq(element) {
            const isActive = element.classList.contains('active');
            
            // Close all first
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-content').style.maxHeight = '0';
            });

            if (!isActive) {
                element.classList.add('active');
                const content = element.querySelector('.faq-content');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }

        // Treatment Drawer Operations
        function openDrawer(key) {
            const data = treatmentsData[key];
            if (!data) return;

            const contentHtml = `
                <div class="drawer-header-icon"><i data-lucide="${data.icon}" size="36"></i></div>
                <h3 class="drawer-title">${data.title}</h3>
                <div class="drawer-body">
                    ${data.html}
                </div>
                <a href="#find-diaetist" class="btn-primary" onclick="closeDrawer()" style="width: 100%; justify-content: center;">
                    Find diætist til denne behandling <i data-lucide="arrow-right" size="18"></i>
                </a>
            `;

            document.getElementById('drawer-content').innerHTML = contentHtml;
            document.getElementById('drawer-overlay').classList.add('active');
            document.getElementById('treatment-drawer').classList.add('active');
            lucide.createIcons();
        }

        function closeDrawer() {
            document.getElementById('drawer-overlay').classList.remove('active');
            document.getElementById('treatment-drawer').classList.remove('active');
        }

        // Subsidy Calculator Operations
        let currentDanmarkValue = 'ja';
        let currentHenvisningValue = 'ja';

        function selectOption(category, value, element) {
            // Unselect sibling options
            const parent = element.parentElement;
            parent.querySelectorAll('.calc-option').forEach(opt => {
                opt.classList.remove('selected');
                opt.querySelector('input').checked = false;
            });

            // Select this option
            element.classList.add('selected');
            element.querySelector('input').checked = true;

            if (category === 'danmark') {
                currentDanmarkValue = value;
            } else if (category === 'henvisning') {
                currentHenvisningValue = value;
            }

            updateCalculations();
        }

        function updateCalculations() {
            const resultElement = document.getElementById('calc-result');
            
            if (currentDanmarkValue === 'ja' && currentHenvisningValue === 'ja') {
                resultElement.textContent = "Op til 85% dækket";
            } else if (currentDanmarkValue === 'ja' && currentHenvisningValue === 'nej') {
                resultElement.textContent = "Ca. 40% - 50% dækket";
            } else if (currentDanmarkValue === 'nej' && currentHenvisningValue === 'ja') {
                resultElement.textContent = "Ca. 40% dækket via Regionen";
            } else {
                resultElement.textContent = "Egenbetaling (Tjek din sundhedssikring)";
            }
        }

        // Region selection via map
        function selectRegion(regionName) {
            // Toggle highlight on map
            document.querySelectorAll('.region-path').forEach(path => {
                if (path.getAttribute('data-region') === regionName) {
                    path.classList.toggle('active');
                    if (path.classList.contains('active')) {
                        selectedRegionFilter = regionName;
                    } else {
                        selectedRegionFilter = 'alle';
                    }
                } else {
                    path.classList.remove('active');
                }
            });

            renderDietitians();
        }

        // Specialty filter pills
        function filterBySpecialty(spec, element) {
            document.querySelectorAll('.specialty-pill').forEach(pill => pill.classList.remove('active'));
            element.classList.add('active');
            selectedSpecialtyFilter = spec;
            renderDietitians();
        }

        // Dynamic searching in inputs
        function filterDietitians() {
            renderDietitians();
        }

        // Render matching dietitians
        function renderDietitians() {
            const container = document.getElementById('dietitians-container');
            const searchValue = document.getElementById('dir-search').value.toLowerCase();

            const filtered = dietitiansData.filter(d => {
                const matchesRegion = selectedRegionFilter === 'alle' || d.region === selectedRegionFilter;
                const matchesSpecialty = selectedSpecialtyFilter === 'alle' || d.specs.includes(selectedSpecialtyFilter);
                const matchesSearch = d.name.toLowerCase().includes(searchValue) || 
                                      d.city.toLowerCase().includes(searchValue) || 
                                      d.specs.some(s => s.toLowerCase().includes(searchValue));
                
                return matchesRegion && matchesSpecialty && matchesSearch;
            });

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                        <i data-lucide="info" size="32" style="margin-bottom: 1rem; color: var(--accent-warm);"></i>
                        <p>Ingen diætister fundet med disse kriterier. Prøv at vælge en anden region eller nulstil søgningen.</p>
                    </div>
                `;
                lucide.createIcons();
                return;
            }

            container.innerHTML = filtered.map(d => `
                <div class="dietitian-card">
                    <img src="${d.img}" class="dietitian-avatar" alt="${d.name}">
                    <div class="dietitian-info">
                        <div class="dietitian-name">${d.name}</div>
                        <div class="dietitian-location">
                            <i data-lucide="map-pin" size="14"></i> ${d.city} (${d.region})
                        </div>
                        <div class="dietitian-specs">
                            ${d.specs.map(s => `<span class="dietitian-spec">${s}</span>`).join('')}
                        </div>
                    </div>
                    <div class="dietitian-contact" onclick="triggerBooking('${d.name}')">
                        <i data-lucide="phone" size="16"></i>
                    </div>
                </div>
            `).join('');

            lucide.createIcons();
        }

        // Toast notifications
        function showToast(message) {
            const toast = document.getElementById('toast');
            document.getElementById('toast-message').textContent = message;
            toast.classList.add('active');
            setTimeout(() => {
                toast.classList.remove('active');
            }, 4000);
        }

        // Handle Consultant Form Submit
        function handleFormSubmit(event) {
            event.preventDefault();
            const name = document.getElementById('book-name').value;
            showToast(`Mange tak, ${name}! Din anmodning om konsulentopgave/foredrag er modtaget.`);
            document.getElementById('consultant-form').reset();
        }

        // Contact Trigger for specific dietitian
        function triggerBooking(name) {
            showToast(`Opretter sikker forbindelse til ${name}...`);
        }
// endregion: app