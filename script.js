/**
 * Bando Competenze PMI SUD - Configurator & UI Logic
 * Optimized for performance and maintainability.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION & STATE ---
    const STATE = {
        lastGrantValue: 22515,
        calcPending: false,
        mobileMenuOpen: false
    };

    // --- 1.5. COUNTDOWN LOGIC ---
    const initCountdown = () => {
        const targetDate = new Date('June 23, 2026 00:00:00').getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                const container = document.getElementById('hero-countdown');
                if (container) {
                    container.innerHTML = "<span class='text-accent font-black tracking-widest px-6 py-3 border border-accent/20 rounded-2xl bg-accent/5'>BANDO CHIUSO</span>";
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');

            if (daysEl) daysEl.innerText = days;
            if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 60000); // Aggiorna ogni minuto
    };

    initCountdown();

    const ELEMENTS = {
        // Form Inputs
        form: document.getElementById('calculator-form'),
        sliderDipendenti: document.getElementById('dipendenti'),
        sliderFatturato: document.getElementById('fatturato'),
        sliderPartecipanti: document.getElementById('partecipanti'),
        sliderOre: document.getElementById('ore'),
        inputCostoDipendente: document.getElementById('costo_dipendente'),
        selectRegione: document.getElementById('regione'),
        courseCheckboxes: document.querySelectorAll('input[name="selected_courses"]'),

        // Display Labels
        display: {
            dipendenti: document.getElementById('display-dipendenti'),
            fatturato: document.getElementById('display-fatturato'),
            partecipanti: document.getElementById('display-partecipanti'),
            ore: document.getElementById('display-ore'),
            costoDipendente: document.getElementById('display-costo-dipendente'),
            percentage: document.getElementById('percentage-result'),
            grant: document.getElementById('grant-result'),
            realCost: document.getElementById('real-cost-summary'),
            projectCost: document.getElementById('project-cost-summary'),
            trainingCost: document.getElementById('training-cost-summary'),
            netCost: document.getElementById('net-cost-summary')
        },

        // Dropdown & Pills
        dropdownBtn: document.getElementById('course-dropdown-btn'),
        dropdownMenu: document.getElementById('course-menu'),
        selectionText: document.getElementById('dropdown-selection-text'),
        pillsContainer: document.getElementById('selected-courses-pills'),

        // Warnings
        warnings: {
            capIcon: document.getElementById('cap-warning-icon'),
            capText: document.getElementById('cap-warning-text'),
            minIcon: document.getElementById('min-warning-icon'),
            minText: document.getElementById('min-warning-text')
        },

        // UI Components
        navbar: document.getElementById('navbar'),
        mobileMenu: document.getElementById('mobile-menu'),
        mobileMenuBtn: document.getElementById('mobile-menu-btn'),
        mobileMenuIcon: document.getElementById('mobile-menu-icon'),
        stickyCta: document.getElementById('sticky-cta'),
        leadForm: document.getElementById('lead-form'),
        roadmapProgressBar: document.getElementById('roadmap-progress-bar'),
        roadmapProgressBarMobile: document.getElementById('roadmap-progress-bar-mobile'),
        roadmapSteps: document.querySelectorAll('.roadmap-step'),
        roadmapDetails: {
            title: document.getElementById('detail-title'),
            description: document.getElementById('detail-description'),
            timing: document.getElementById('detail-timing'),
            priority: document.getElementById('detail-priority'),
            docs: document.getElementById('detail-docs'),
            support: document.getElementById('detail-support'),
            container: document.getElementById('step-detail-container')
        },
        score: {
            circle: document.getElementById('score-circle'),
            text: document.getElementById('score-text'),
            label: document.getElementById('score-label')
        }
    };

    // --- 2. UTILITIES ---
    const currencyFormatter = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    });

    const formatCurrency = (val) => currencyFormatter.format(val);

    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = progress * (2 - progress);
            const currentVal = Math.floor(easeOut * (end - start) + start);
            obj.textContent = formatCurrency(currentVal);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    // --- 3. CORE LOGIC ---

    /**
     * Identifies SME size based on EU criteria (simplified)
     */
    const getSmeSize = (employees, turnover) => {
        const calcEmployees = Math.min(employees, 250);
        const calcTurnover = Math.min(turnover, 50);

        if ((calcEmployees < 10 && calcTurnover <= 2) || (calcEmployees < 50 && calcTurnover <= 10)) {
            return 'micro_small';
        }
        return 'medium';
    };

    /**
     * Updates the UI based on calculation results
     */
    const updateUI = (results) => {
        const { display, warnings } = ELEMENTS;

        // Labels
        display.dipendenti.innerText = results.dipendenti;
        display.fatturato.innerText = results.fatturato + " Mln €";
        display.partecipanti.innerText = results.partecipanti;
        display.ore.innerText = results.oreCorsi + " h";
        display.costoDipendente.innerText = formatCurrency(results.costoOrarioDipendente);

        // Summaries
        display.percentage.innerText = (results.percentage * 100) + '%';
        display.realCost.innerText = formatCurrency(results.costoAziendale);
        display.trainingCost.innerText = formatCurrency(results.costoCorsiFoodHub);
        display.projectCost.innerText = formatCurrency(results.costoProgetto);
        display.netCost.innerText = formatCurrency(results.costoNetto);

        // Styling for Net Cost
        display.netCost.classList.remove('text-accent', 'text-white');
        display.netCost.classList.add(results.costoNetto <= 0 ? 'text-accent' : 'text-white');

        // Warnings
        Object.values(warnings).forEach(el => el?.classList.add('hidden'));
        if (results.isCapped) {
            warnings.capIcon?.classList.remove('hidden');
            warnings.capText?.classList.remove('hidden');
        } else if (results.isBelowMin) {
            warnings.minIcon?.classList.remove('hidden');
            warnings.minText?.classList.remove('hidden');
        }

        // Animated Grant
        if (results.grant !== STATE.lastGrantValue) {
            animateValue(display.grant, STATE.lastGrantValue, results.grant, 500);
            STATE.lastGrantValue = results.grant;

            // Visual feedback on result box (Pop effect)
            const grantContainer = display.grant.parentElement;
            grantContainer.style.transform = "scale(1.05)";
            grantContainer.style.borderColor = "rgba(92, 180, 123, 0.4)";

            setTimeout(() => {
                grantContainer.style.transform = "scale(1)";
                grantContainer.style.borderColor = "rgba(255, 255, 255, 0.05)";
                grantContainer.style.transition = "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
            }, 100);
        }
    };

    /**
     * Updates the Suitability Score Gauge
     */
    const updateSuitabilityScore = (params) => {
        const { dipendenti, fatturato, oreCorsi } = params;
        let score = 45; // Base score

        // Heuristics
        if (dipendenti >= 10 && dipendenti <= 150) score += 25;
        else if (dipendenti > 150) score += 15;
        else score += 5;

        if (fatturato >= 5) score += 15;
        else if (fatturato >= 1) score += 10;
        else score += 5;

        if (oreCorsi >= 40) score += 15;
        else if (oreCorsi >= 16) score += 8;

        score = Math.min(score, 100);

        // UI Update
        const { circle, text, label } = ELEMENTS.score;
        if (!circle || !text || !label) return;

        // Animate Circle (Dash Array is 131.9)
        const offset = 131.9 - (131.9 * score / 100);
        circle.style.strokeDashoffset = offset;

        // Update Text
        text.innerText = score;

        // Update Label
        let status = 'Bassa';
        let colorClass = 'text-gray-400';

        if (score >= 90) { status = 'Eccellente'; colorClass = 'text-accent'; }
        else if (score >= 75) { status = 'Ottima'; colorClass = 'text-accent/80'; }
        else if (score >= 60) { status = 'Buona'; colorClass = 'text-brand-orange'; }
        else if (score >= 40) { status = 'Media'; colorClass = 'text-gray-400'; }

        label.innerText = status;
        label.className = `text-[10px] font-bold uppercase tracking-wide transition-colors ${colorClass}`;
    };

    const calculate = () => {
        const dipendenti = parseInt(ELEMENTS.sliderDipendenti.value) || 1;
        const fatturato = parseFloat(ELEMENTS.sliderFatturato.value) || 0;
        let partecipanti = parseInt(ELEMENTS.sliderPartecipanti.value) || 0;

        // Sync participants with total employees
        if (partecipanti > dipendenti) {
            partecipanti = dipendenti;
            ELEMENTS.sliderPartecipanti.value = partecipanti;
        }
        ELEMENTS.sliderPartecipanti.max = dipendenti;

        const size = getSmeSize(dipendenti, fatturato);

        // Auto-select size radio in UI
        const sizeRadio = document.querySelector(`input[name="size"][value="${size}"]`);
        if (sizeRadio) sizeRadio.checked = true;

        const projectType = document.querySelector('input[name="project_type"]:checked').value;
        const region = ELEMENTS.selectRegione.value;
        const costoOrarioDipendente = parseFloat(ELEMENTS.inputCostoDipendente.value) || 0;

        // Regional Mapping
        const regionalRates = { 'calabria': 41.19, 'isole_sud': 49.33, 'default': 45.03 };
        const mappingCostoRegionale = regionalRates[region] || regionalRates.default;

        // Courses Calculation
        let oreCorsi = 0;
        let costoCorsiFoodHub = 0;
        const fascePartecipanti = Math.ceil(partecipanti / 10) || 1;

        ELEMENTS.courseCheckboxes.forEach(cb => {
            if (cb.checked) {
                oreCorsi += parseInt(cb.dataset.hours) || 0;
                if (window.coursesData && window.coursesData[cb.value]) {
                    costoCorsiFoodHub += (window.coursesData[cb.value].price * fascePartecipanti);
                }
            }
        });

        // Main Formulas
        let percentage = 0.50;
        if (projectType === 'integrated') {
            percentage = (size === 'micro_small') ? 0.70 : 0.60;
        }

        const rawProjectCost = oreCorsi * partecipanti * mappingCostoRegionale;
        const costoAziendale = oreCorsi * partecipanti * costoOrarioDipendente;

        let costoProgetto = rawProjectCost;
        let isCapped = false;
        let isBelowMin = false;

        if (costoProgetto > 60000) {
            costoProgetto = 60000;
            isCapped = true;
        } else if (costoProgetto < 10000 && costoProgetto > 0) {
            costoProgetto = 10000;
            isBelowMin = true;
        }

        const grant = costoProgetto * percentage;
        const costoNetto = (costoAziendale + costoCorsiFoodHub) - grant;

        // UI Sync
        ELEMENTS.sliderOre.value = oreCorsi;
        updatePills();
        updateUI({
            dipendenti, fatturato, partecipanti, oreCorsi, costoOrarioDipendente,
            percentage, grant, costoAziendale, costoCorsiFoodHub, costoProgetto, costoNetto,
            isCapped, isBelowMin
        });

        // Update Suitability
        updateSuitabilityScore({ dipendenti, fatturato, oreCorsi });
    };

    const scheduleCalculate = () => {
        if (!STATE.calcPending) {
            STATE.calcPending = true;
            requestAnimationFrame(() => {
                STATE.calcPending = false;
                calculate();
            });
        }
    };

    function updatePills() {
        if (!ELEMENTS.pillsContainer) return;

        const fragment = document.createDocumentFragment();
        let selectedCount = 0;

        ELEMENTS.courseCheckboxes.forEach(cb => {
            if (cb.checked) {
                selectedCount++;
                const pill = document.createElement('div');
                pill.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold animate-fade-in";
                pill.innerHTML = `<span>${cb.dataset.name}</span> <i data-lucide="x" class="w-3 h-3 cursor-pointer hover:text-white" data-cb-value="${cb.value}"></i>`;
                fragment.appendChild(pill);
            }
        });

        ELEMENTS.pillsContainer.innerHTML = '';
        ELEMENTS.pillsContainer.appendChild(fragment);

        if (ELEMENTS.selectionText) {
            ELEMENTS.selectionText.innerText = selectedCount > 0 ? `${selectedCount} Corsi Selezionati` : "Nessun corso selezionato";
            ELEMENTS.selectionText.className = selectedCount > 0 ? 'text-white' : 'text-gray-400';
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- 4. EVENT LISTENERS ---

    // Configurator inputs
    [ELEMENTS.sliderDipendenti, ELEMENTS.sliderFatturato, ELEMENTS.sliderPartecipanti, ELEMENTS.inputCostoDipendente].forEach(el => {
        el?.addEventListener('input', scheduleCalculate);
    });
    ELEMENTS.selectRegione?.addEventListener('change', scheduleCalculate);

    document.querySelectorAll('input[name="project_type"]').forEach(el => el.addEventListener('change', scheduleCalculate));
    ELEMENTS.courseCheckboxes.forEach(el => el.addEventListener('change', scheduleCalculate));

    // Pill delegation
    ELEMENTS.pillsContainer?.addEventListener('click', (e) => {
        const xIcon = e.target.closest('i[data-cb-value]');
        if (xIcon) {
            const val = xIcon.getAttribute('data-cb-value');
            const cb = document.querySelector(`input[name="selected_courses"][value="${val}"]`);
            if (cb) cb.click();
        }
    });

    // Roadmap interaction
    ELEMENTS.roadmapSteps.forEach(step => {
        step.addEventListener('click', () => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            updateRoadmap(stepNum);
        });
    });

    function updateRoadmap(stepNum) {
        if (!ELEMENTS.roadmapProgressBar) return;

        // 1. Update Progress Bars
        const width = (stepNum * 25) - 12.5;
        ELEMENTS.roadmapProgressBar.style.width = width + '%';
        if (ELEMENTS.roadmapProgressBarMobile) {
            ELEMENTS.roadmapProgressBarMobile.style.height = (stepNum * 25) + '%';
        }

        // 2. Data for Steps
        const stepData = {
            1: {
                title: "Invio Domanda",
                description: "Fase critica di caricamento. La domanda viene inviata tramite lo sportello telematico del MIMIT. Trattandosi di un bando a sportello, la tempestività è fondamentale per assicurarsi i fondi.",
                timing: "21 Aprile - 23 Giugno",
                priority: "Massima (Click Day)",
                docs: ["Visura Camerale aggiornata", "DURC regolare", "Firma Digitale del legale rappresentante", "Copia documento d'identità"],
                support: "Predisposizione della modulistica tecnica, validazione dei requisiti DNSH e gestione della coda di invio per garantire la priorità cronologica."
            },
            2: {
                title: "Istruttoria",
                description: "Il Ministero verifica la regolarità formale e sostanziale della domanda. In questa fase possono essere richieste integrazioni documentali a cui bisogna rispondere entro termini stretti.",
                timing: "Estate 2026",
                priority: "Monitoraggio",
                docs: ["Eventuali integrazioni richieste", "Conferma coordinate bancarie (IBAN)", "Dichiarazione De Minimis aggiornata"],
                support: "Presidio costante del portale MIMIT e della PEC aziendale. Gestione professionale di eventuali 'soccorsi istruttori' per evitare il rigetto della domanda."
            },
            3: {
                title: "Esecuzione",
                description: "Una volta ottenuta l'approvazione, si avviano i percorsi formativi selezionati. La formazione deve essere tracciata correttamente tramite registri certificati.",
                timing: "Fine 2026 - 2027",
                priority: "Operativa",
                docs: ["Registri presenze formativi", "Contratti con i fornitori", "Fatture elettroniche di spesa", "Quietante di pagamento"],
                support: "Erogazione dei corsi con docenti certificati Academy. Monitoraggio delle ore di formazione e tutoraggio dei dipendenti per la corretta gestione dei registri."
            },
            4: {
                title: "Erogazione",
                description: "Fase finale di rendicontazione. Dopo la verifica delle spese sostenute e della formazione effettivamente svolta, il Ministero procede al bonifico del contributo sul conto aziendale.",
                timing: "Circa 60gg da fine attività",
                priority: "Rendicontazione",
                docs: ["Relazione tecnica finale", "Certificazione delle spese", "Estratti conto bancari", "Attestati di partecipazione"],
                support: "Redazione della relazione finale sui risultati ottenuti, certificazione del costo del personale e invio del pacchetto di rendicontazione completo via portale."
            }
        };

        const data = stepData[stepNum];

        // 3. Update Visual Steps indicators
        ELEMENTS.roadmapSteps.forEach(step => {
            const nr = parseInt(step.getAttribute('data-step'));
            const box = step.querySelector('.step-box');
            const icon = step.querySelector('i');
            const numberBadge = step.querySelector('span.absolute');
            const title = step.querySelector('h4');
            const desc = step.querySelector('p');

            if (nr <= stepNum) {
                step.classList.add('active');
                box.classList.add('border-accent/40', 'shadow-[0_0_30px_rgba(92,180,123,0.2)]');
                box.classList.remove('border-white/10');

                if (nr === 1) {
                    icon.className = 'w-10 h-10 text-accent transition-transform';
                    numberBadge.className = 'absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent text-dark-bg flex items-center justify-center font-black text-sm';
                    title.className = 'text-xl font-bold text-accent mb-3 transition-colors';
                } else if (nr === 2) {
                    icon.className = 'w-10 h-10 text-brand-orange transition-transform';
                    numberBadge.className = 'absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-orange text-dark-bg flex items-center justify-center font-black text-sm';
                    title.className = 'text-xl font-bold text-brand-orange mb-3 transition-colors';
                } else if (nr === 3) {
                    icon.className = 'w-10 h-10 text-brand-green transition-transform';
                    numberBadge.className = 'absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-green text-dark-bg flex items-center justify-center font-black text-sm';
                    title.className = 'text-xl font-bold text-brand-green mb-3 transition-colors';
                } else {
                    icon.className = 'w-10 h-10 text-accent transition-transform';
                    numberBadge.className = 'absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent text-dark-bg flex items-center justify-center font-black text-sm';
                    title.className = 'text-xl font-bold text-accent mb-3 transition-colors';
                }
                desc.className = 'text-sm text-gray-300 leading-relaxed';
            } else {
                step.classList.remove('active');
                box.classList.remove('border-accent/40', 'border-brand-orange/40', 'border-brand-green/40', 'active');
                box.classList.add('border-white/10');
                icon.className = 'w-10 h-10 text-gray-400 transition-all';
                numberBadge.className = 'absolute -top-3 -right-3 w-8 h-8 rounded-full bg-dark-border text-white flex items-center justify-center font-black text-sm transition-colors';
                title.className = 'text-xl font-bold text-white mb-3 transition-colors';
                desc.className = 'text-sm text-gray-500 leading-relaxed';
            }
        });

        // 4. Update Detail Panel
        if (ELEMENTS.roadmapDetails.container && data) {
            // Animation trigger
            ELEMENTS.roadmapDetails.container.style.opacity = '0';
            ELEMENTS.roadmapDetails.container.style.transform = 'translateY(10px)';

            setTimeout(() => {
                ELEMENTS.roadmapDetails.title.innerText = data.title;
                ELEMENTS.roadmapDetails.description.innerText = data.description;
                ELEMENTS.roadmapDetails.timing.innerText = data.timing;
                ELEMENTS.roadmapDetails.priority.innerText = data.priority;
                ELEMENTS.roadmapDetails.support.innerText = data.support;

                ELEMENTS.roadmapDetails.docs.innerHTML = data.docs.map(doc => `
                    <li class="flex items-center gap-3 text-sm text-gray-300">
                        <i data-lucide="check" class="w-4 h-4 text-accent"></i> ${doc}
                    </li>
                `).join('');

                if (typeof lucide !== 'undefined') lucide.createIcons();

                ELEMENTS.roadmapDetails.container.style.opacity = '1';
                ELEMENTS.roadmapDetails.container.style.transform = 'translateY(0)';
                ELEMENTS.roadmapDetails.container.style.transition = 'all 0.5s ease-out';
            }, 300);
        }
    }
    ELEMENTS.dropdownBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        ELEMENTS.dropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (ELEMENTS.dropdownMenu && !ELEMENTS.dropdownBtn.contains(e.target) && !ELEMENTS.dropdownMenu.contains(e.target)) {
            ELEMENTS.dropdownMenu.classList.add('hidden');
        }
    });

    // Navbar & Sticky CTA Scroll (Throttled)
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY > 50;
                const beyondHero = window.scrollY > 400;

                // Navbar
                ELEMENTS.navbar.classList.toggle('shadow-lg', scrolled);
                ELEMENTS.navbar.classList.toggle('bg-dark-bg/95', scrolled);
                ELEMENTS.navbar.classList.toggle('py-3', scrolled);
                ELEMENTS.navbar.classList.toggle('bg-dark-bg/80', !scrolled);
                ELEMENTS.navbar.classList.toggle('py-4', !scrolled);

                // Sticky CTA (Mobile)
                if (ELEMENTS.stickyCta) {
                    const isVisible = beyondHero && !STATE.mobileMenuOpen;
                    ELEMENTS.stickyCta.classList.toggle('opacity-100', isVisible);
                    ELEMENTS.stickyCta.classList.toggle('translate-y-0', isVisible);
                    ELEMENTS.stickyCta.classList.toggle('pointer-events-auto', isVisible);
                    ELEMENTS.stickyCta.classList.toggle('opacity-0', !isVisible);
                    ELEMENTS.stickyCta.classList.toggle('translate-y-10', !isVisible);
                    ELEMENTS.stickyCta.classList.toggle('pointer-events-none', !isVisible);
                }

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // --- Webhook n8n: Configura l'URL del tuo webhook qui ---
    const N8N_WEBHOOK_URL = 'https://n8n.srv1036443.hstgr.cloud/webhook/bando-competenze-lead';

    const buildWebhookPayload = (form) => {
        const inputs = form.querySelectorAll('input');
        const corsiSelezionati = Array.from(ELEMENTS.courseCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => ({ id: cb.value, titolo: (window.coursesData?.[cb.value]?.title) || cb.value, ore: cb.dataset.hours }));

        return {
            // Lead data
            lead: {
                nome:     inputs[0]?.value || '',
                ruolo:    inputs[1]?.value || '',
                azienda:  inputs[2]?.value || '',
                email:    inputs[3]?.value || '',
                telefono: inputs[4]?.value || ''
            },
            // Configuratore
            configuratore: {
                regione:           ELEMENTS.selectRegione?.value || '',
                dipendenti:        parseInt(ELEMENTS.sliderDipendenti?.value) || 0,
                fatturato_mln:     parseFloat(ELEMENTS.sliderFatturato?.value) || 0,
                partecipanti:      parseInt(ELEMENTS.sliderPartecipanti?.value) || 0,
                costo_orario_eur:  parseFloat(ELEMENTS.inputCostoDipendente?.value) || 0,
                tipo_progetto:     document.querySelector('input[name="project_type"]:checked')?.value || 'standard',
                corsi:             corsiSelezionati,
                ore_totali:        parseInt(ELEMENTS.sliderOre?.value) || 0
            },
            // Risultati calcolati (dal DOM display)
            risultati: {
                percentuale_contributo: ELEMENTS.display.percentage?.textContent?.replace('%','').trim() || '',
                contributo_fondo_perduto: ELEMENTS.display.grant?.textContent?.replace(/[€.\s]/g,'').replace(',','.').trim() || '',
                costo_rendicontabile:   ELEMENTS.display.projectCost?.textContent?.replace(/[€.\s]/g,'').replace(',','.').trim() || '',
                costo_personale:        ELEMENTS.display.realCost?.textContent?.replace(/[€.\s]/g,'').replace(',','.').trim() || '',
                servizi_food_hub:       ELEMENTS.display.trainingCost?.textContent?.replace(/[€.\s]/g,'').replace(',','.').trim() || '',
                costo_netto:            ELEMENTS.display.netCost?.textContent?.replace(/[€.\s]/g,'').replace(',','.').trim() || ''
            },
            // Metadati
            meta: {
                timestamp:  new Date().toISOString(),
                pagina_url: window.location.href
            }
        };
    };

    // Lead Form — invia dati a n8n e mostra feedback UX
    ELEMENTS.leadForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const reportCard = document.querySelector('#configuratore .glass-card.p-10');

        // 1. Loading State
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Invio in corso...</span>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // 2. Invia al webhook n8n
        try {
            await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildWebhookPayload(form))
            });
        } catch (_) {
            // Fail silently: l'UX non si interrompe in caso di errore rete
        }

        // 2. Visual Feedback on the Report Card
        if (reportCard) {
            reportCard.classList.add('animate-pulse');
            reportCard.style.boxShadow = "0 0 50px rgba(92,180,123,0.3)";
        }

        // Simulate Lead Processing & PDF Generation
        setTimeout(() => {
            // 3. Success State - Button
            btn.classList.replace('bg-accent', 'bg-brand-green');
            btn.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> <span>Richiesta Inviata!</span>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // 4. Transform Form Area into Success Message
            const formContainer = form.parentElement;

            form.style.opacity = '0';
            form.style.transition = 'opacity 0.5s ease-out';

            setTimeout(() => {
                form.classList.add('hidden');

                const successMsg = document.createElement('div');
                successMsg.className = "text-center py-6 animate-fade-in";
                successMsg.innerHTML = `
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 border border-accent/40 mb-4">
                        <i data-lucide="sparkles" class="w-8 h-8 text-accent"></i>
                    </div>
                    <h5 class="text-xl font-bold text-white mb-2">Grazie per l'interesse!</h5>
                    <p class="text-gray-400 text-sm max-w-sm mx-auto">
                        La tua richiesta è stata ricevuta con successo.
                        <strong>Franco Biolatto</strong> ti contatterà presto per un'analisi gratuita.
                    </p>
                    <button onclick="location.reload()" class="mt-6 text-xs text-gray-500 hover:text-white underline">Invia un'altra richiesta</button>
                `;
                formContainer.appendChild(successMsg);
                if (typeof lucide !== 'undefined') lucide.createIcons();

                // Stop pulses
                if (reportCard) {
                    reportCard.classList.remove('animate-pulse');
                    reportCard.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5)";
                    reportCard.classList.add('border-accent');
                }
            }, 500);

        }, 2200); // 2.2s delay for "realism"
    });

    // --- 5. EXPORTED GLOBALS (For onclick handlers) ---

    window.toggleMobileMenu = () => {
        STATE.mobileMenuOpen = !STATE.mobileMenuOpen;
        ELEMENTS.mobileMenu.classList.toggle('-translate-y-full', !STATE.mobileMenuOpen);
        ELEMENTS.mobileMenuIcon.setAttribute('data-lucide', STATE.mobileMenuOpen ? 'x' : 'menu');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    window.closeMobileMenu = () => {
        STATE.mobileMenuOpen = false;
        ELEMENTS.mobileMenu.classList.add('-translate-y-full');
        ELEMENTS.mobileMenuIcon.setAttribute('data-lucide', 'menu');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    window.filterFaqs = (category, btn) => {
        const items = document.querySelectorAll('.faq-item');
        const buttons = document.querySelectorAll('.faq-filter-btn');

        buttons.forEach(b => {
            b.classList.remove('bg-accent/20', 'border-accent/30', 'text-accent');
            b.classList.add('bg-white/5', 'border-white/10', 'text-gray-400');
        });
        btn.classList.add('bg-accent/20', 'border-accent/30', 'text-accent');
        btn.classList.remove('bg-white/5', 'border-white/10', 'text-gray-400');

        items.forEach(item => {
            const isMatch = category === 'all' || item.dataset.category.includes(category);
            item.style.display = isMatch ? 'block' : 'none';
        });
    };

    window.filterCourses = (category, btn) => {
        const items = document.querySelectorAll('.course-card');
        const buttons = document.querySelectorAll('.course-filter-btn');

        // Update buttons state
        buttons.forEach(b => {
            b.classList.remove('bg-accent/20', 'border-accent/30', 'text-accent', 'shadow-[0_0_15px_rgba(92,180,123,0.1)]');
            b.classList.add('bg-white/5', 'border-white/10', 'text-gray-400');
        });

        if (btn) {
            btn.classList.add('bg-accent/20', 'border-accent/30', 'text-accent', 'shadow-[0_0_15px_rgba(92,180,123,0.1)]');
            btn.classList.remove('bg-white/5', 'border-white/10', 'text-gray-400');
        }

        // Filter items with a small animation trigger
        items.forEach(item => {
            const categories = item.dataset.category || '';
            const isMatch = category === 'all' || categories.split(' ').includes(category);

            if (isMatch) {
                item.style.display = 'flex';
                setTimeout(() => item.style.opacity = '1', 10);
            } else {
                item.style.opacity = '0';
                item.style.display = 'none';
            }
        });
    };

    window.scrollToFilter = (category) => {
        const target = document.getElementById('catalogo-corsi');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Trova il pulsante corrispondente nel filtro per attivarlo visivamente
            const filterBtns = document.querySelectorAll('.course-filter-btn');
            let targetBtn = null;

            filterBtns.forEach(btn => {
                if (btn.getAttribute('onclick').includes(`'${category}'`)) {
                    targetBtn = btn;
                }
            });

            setTimeout(() => {
                window.filterCourses(category, targetBtn);
            }, 400);
        }
    };

    // --- 6. INITIALIZATION ---
    calculate();
    updateRoadmap(1);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 7. LIVE SOCIAL PROOF LOGIC ---
    const today = new Date();
    const dateSeed = today.getDate() + (today.getMonth() * 31);
    const dailyBaseSims = 12 + (dateSeed % 14);
    const dailyBaseFunds = 380000 + ((dateSeed * 13750) % 220000);

    let liveSims = dailyBaseSims;
    let liveFunds = dailyBaseFunds;

    const simEl = document.getElementById('live-simulations-count');
    const fundEl = document.getElementById('live-total-grant');

    if (simEl && fundEl) {
        simEl.textContent = liveSims;
        fundEl.textContent = formatCurrency(liveFunds);

        setInterval(() => {
            if (Math.random() > 0.85) {
                liveSims += 1;
                liveFunds += Math.floor(Math.random() * 12000) + 8000;
                simEl.textContent = liveSims;
                fundEl.textContent = formatCurrency(liveFunds);
                [simEl, fundEl].forEach(el => {
                    el.classList.add('text-accent', 'scale-110');
                    setTimeout(() => el.classList.remove('text-accent', 'scale-110'), 1500);
                });
            }
        }, 12000);
    }

    // --- 8. CASES SLIDER LOGIC ---
    const initCasesSlider = () => {
        const slider = document.getElementById('cases-slider');
        const dotsContainer = document.getElementById('cases-dots');
        if (!slider || !dotsContainer) return;

        const cards = Array.from(slider.children);
        if (cards.length === 0) return;

        // Create dots
        dotsContainer.innerHTML = ''; 
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-accent w-6' : 'bg-white/20 hover:bg-white/40'}`;
            dot.onclick = () => {
                cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            };
            dotsContainer.appendChild(dot);
        });

        // Update dots on scroll
        slider.addEventListener('scroll', () => {
            const scrollLeft = slider.scrollLeft;
            const cardWidth = cards[0].offsetWidth + 24; // Including gap
            const activeIndex = Math.round(scrollLeft / cardWidth);

            Array.from(dotsContainer.children).forEach((dot, i) => {
                if (i === activeIndex) {
                    dot.className = 'w-6 h-2 rounded-full transition-all duration-300 bg-accent';
                } else {
                    dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-white/20 hover:bg-white/40';
                }
            });
        }, { passive: true });
    };

    initCasesSlider();
});

// --- GLOBAL MODAL FUNCTIONS ---

window.openCourseModal = (courseId) => {
    console.log("Opening Course Modal for ID:", courseId);
    const course = window.coursesData[courseId];
    if (!course) return;

    const mTitle = document.getElementById('modal-title');
    const mCat = document.getElementById('modal-category');
    const mDesc = document.getElementById('modal-description');
    const mDur = document.getElementById('modal-duration');
    const mLvl = document.getElementById('modal-level');
    const mTarget = document.getElementById('modal-target');
    const mList = document.getElementById('modal-modules-list');
    const mBar = document.getElementById('modal-color-bar');

    if (!mTitle || !mCat || !mDesc || !mDur || !mLvl || !mTarget || !mList || !mBar) {
        console.error("Course Modal elements not found!");
        return;
    }

    mTitle.innerText = course.title;
    mCat.innerText = course.category;
    mDesc.innerText = course.description;

    const spanDur = mDur.querySelector('span');
    if (spanDur) spanDur.innerText = course.duration;

    const spanLvl = mLvl.querySelector('span');
    if (spanLvl) spanLvl.innerText = course.level;

    mTarget.innerText = course.target;

    mList.innerHTML = course.modules.map(mod => `
        <li class="flex items-start gap-3 mt-3 text-sm text-gray-300">
            <i data-lucide="check-circle-2" class="w-5 h-5 flex-shrink-0 mt-0.5 ${course.textColorClass}"></i> 
            <span>${mod}</span>
        </li>
    `).join('');

    mBar.className = `h-2 w-full ${course.colorClass}`;
    mCat.className = `px-3 py-1 rounded bg-dark-card border border-white/10 text-xs font-bold uppercase tracking-wider mb-3 inline-block ${course.textColorClass}`;

    const modal = document.getElementById('course-modal');
    const content = document.getElementById('course-modal-content');

    if (modal && content) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';

        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 10);
    }
};

window.closeCourseModal = () => {
    console.log("Closing Course Modal...");
    const modal = document.getElementById('course-modal');
    const content = document.getElementById('course-modal-content');

    if (modal && content) {
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 300);
    }
};

window.coursesData = {
    1: { price: 2400, title: "Agricoltura di Precisione", category: "Agrifood & Life Science", colorClass: "bg-accent", textColorClass: "text-accent", duration: "16 Ore", level: "S3 2.5", description: "Sviluppo dell'agricoltura di precisione e dell'agricoltura del futuro. Esplora droni, sensori e AI per l'Agritech.", target: "Agronomi, Manager dell'Innovazione", modules: ["Telerilevamento multispettrale", "Sistemi guida assistita (VRT)", "IoT per monitoraggio suolo", "Big Data Decision Support"] },
    2: { price: 1800, title: "Packaging & Tracciabilità", category: "Agrifood & Life Science", colorClass: "bg-brand-green", textColorClass: "text-brand-green", duration: "12 Ore", level: "S3 2.6", description: "Tecnologie per il packaging sostenibile e tracciabilità blockchain.", target: "Responsabili Qualità, Logistics Manager", modules: ["Materiali ecosostenibili", "Blockchain per filiera", "Smart Packaging", "Sicurezza alimentare"] },
    3: { price: 2400, title: "Nutraceutica & Alimenti", category: "Agrifood & Life Science", colorClass: "bg-brand-orange", textColorClass: "text-brand-orange", duration: "16 Ore", level: "S3 2.7", description: "Sviluppo di alimenti funzionali e nutrigenomica.", target: "Tecnologi Alimentari, Biologi", modules: ["Nutrigenomica", "Ingredienti funzionali", "Estrazione bioattiva", "Validazione claim"] },
    4: { price: 2400, title: "Processi Alta Efficienza", category: "Industria Sostenibile", colorClass: "bg-brand-orange", textColorClass: "text-brand-orange", duration: "16 Ore", level: "S3 3.1", description: "Ottimizzazione energetica e riduzione scarti industriali.", target: "Plant Manager, Energy Manager", modules: ["Audit energetici", "Lean Green", "Monitoraggio real-time", "Integrazione rinnovabili"] },
    5: { price: 2400, title: "Sistemi Evolutivi", category: "Industria Sostenibile", colorClass: "bg-accent", textColorClass: "text-accent", duration: "16 Ore", level: "S3 3.2", description: "Robotica collaborativa e Digital Twin per la produzione flessibile.", target: "Ingegneri di Processo, IT Manager", modules: ["Cobot", "Digital Twin", "Cyber-Physical Systems", "Produzione personalizzata"] },
    6: { price: 1200, title: "Materiali Ecocompatibili", category: "Industria Sostenibile", colorClass: "bg-brand-green", textColorClass: "text-brand-green", duration: "8 Ore", level: "S3 3.3", description: "Studio di materiali bio-based e polimeri biodegradabili.", target: "Progettisti, Responsabili Materiali", modules: ["Bio-polimeri", "Nanotecnologie", "LCA dei materiali", "Riciclo avanzato"] },
    7: { price: 2400, title: "Digitale Catene Valore", category: "Transizione Digitale", colorClass: "bg-brand-orange", textColorClass: "text-brand-orange", duration: "16 Ore", level: "S3 9.2", description: "Digitalizzazione filiere e integrazione ERP/MES.", target: "Supply Chain Manager, IT Director", modules: ["Piattaforme integrate", "Data sharing B2B", "E-commerce industriale", "Dashboarding KPI"] },
    8: { price: 1800, title: "Logistica Intelligente", category: "Transizione Digitale", colorClass: "bg-brand-orange", textColorClass: "text-brand-orange", duration: "12 Ore", level: "S3 9.3", description: "Mobilità sostenibile e AI per la logistica.", target: "Fleet Manager, Logistic Manager", modules: ["Ottimizzazione percorsi AI", "IoT tracking", "Green Logistics", "Last-mile 4.0"] },
    9: { price: 1800, title: "Economia Circolare & Dati", category: "Transizione Verde", colorClass: "bg-brand-green", textColorClass: "text-brand-green", duration: "12 Ore", level: "S3 9.4/9.5", description: "Modelli circolari PaaS e analisi dati per sostenibilità.", target: "Sustainability Officer, Data Scientist", modules: ["Modelli PaaS", "Data-driven sustainability", "Strategie circolari", "Reporting ESG"] }
};
