// =============================================================================
// Constants
// =============================================================================
const PAGE_SIZE = 20;
const API_ENDPOINT = 'http://localhost:5000/api/brain';

// =============================================================================
// State
// =============================================================================
let currentPage = 1;
let totalPages = 1;
let isBrainDataLoading = false;

// =============================================================================
// DOM References
// =============================================================================
const mainContent       = document.getElementById('main-content');
const organDetail       = document.getElementById('organ-detail');
const backLink          = document.getElementById('back-link');
const organLinks        = document.querySelectorAll('.organ-link');
const searchInput       = document.getElementById('search-input');
const searchBtn         = document.querySelector('.search-btn');
const prevPageBtn       = document.getElementById('prev-page');
const nextPageBtn       = document.getElementById('next-page');
const pageInfo          = document.getElementById('page-info');
const brainDataBody     = document.getElementById('brain-data-body');
const brainDataTable    = document.getElementById('brain-data-table');
const paginationControls = document.getElementById('pagination-controls');
const loadingIndicator  = document.getElementById('loading-indicator');
const errorMessage      = document.getElementById('error-message');
const organIcon         = document.getElementById('organ-icon');

// =============================================================================
// Organ Data (all 10 organs)
// =============================================================================
const organData = {
    brain: {
        title: "Brain",
        subtitle: "Central Organ of the Nervous System",
        description: "The brain is the central organ of the human nervous system, responsible for processing sensory information, regulating bodily functions, and enabling cognition and consciousness. It consists of the cerebrum, brainstem, and cerebellum.",
        icon: "fa-brain",
        infoCards: [
            { title: "Primary Function",    content: "Processes sensory information, controls thought, memory, emotion, touch, motor skills, vision, breathing, temperature, hunger and every process that regulates our body." },
            { title: "Anatomical Location", content: "Contained within the skull, occupying the cranial cavity. Divided into three main parts: forebrain, midbrain, and hindbrain." },
            { title: "Clinical Significance", content: "Subject to various disorders including neurodegenerative diseases (Alzheimer's, Parkinson's), stroke, tumors, infections, and trauma. Requires constant blood supply." },
            { title: "Ubiquitination Role",  content: "Ubiquitin-proteasome system (UPS) dysfunction is linked to Parkinson's disease, Alzheimer's disease, and other neurodegenerative conditions through aggregation of misfolded proteins." }
        ],
        stats: [
            { name: "Average Weight",       value: "1.3–1.4 kg (adult)" },
            { name: "Neurons",              value: "Approximately 86 billion" },
            { name: "Oxygen Consumption",   value: "20% of total body oxygen" },
            { name: "Blood Flow",           value: "15–20% of cardiac output" },
            { name: "Development",          value: "Reaches full size by age 25" }
        ],
        structures: [
            { name: "Cerebrum",        description: "Largest part, responsible for higher brain functions" },
            { name: "Cerebellum",      description: "Coordinates voluntary movements and balance" },
            { name: "Brainstem",       description: "Controls automatic functions (breathing, heart rate)" },
            { name: "Diencephalon",    description: "Contains thalamus and hypothalamus" },
            { name: "Cerebral Cortex", description: "Outer layer of neural tissue, enables cognition" }
        ]
    },

    heart: {
        title: "Heart",
        subtitle: "Central Pump of the Circulatory System",
        description: "The heart is a muscular organ that pumps blood through the blood vessels of the circulatory system. It provides the body with oxygen and nutrients while removing carbon dioxide and other wastes.",
        icon: "fa-heart",
        infoCards: [
            { title: "Primary Function",    content: "Pumps blood throughout the body via the circulatory system, supplying oxygen and nutrients to tissues and removing carbon dioxide and other wastes." },
            { title: "Anatomical Location", content: "Located in the mediastinum of the thoracic cavity, between the lungs and slightly left of center." },
            { title: "Clinical Significance", content: "Subject to conditions such as coronary artery disease, heart failure, arrhythmias, and valvular heart disease. Cardiovascular disease is the leading cause of death globally." },
            { title: "Ubiquitination Role",  content: "Cardiac-specific E3 ligases such as MuRF1 and Atrogin-1 regulate myofibril protein turnover. Dysregulation contributes to cardiac hypertrophy and heart failure." }
        ],
        stats: [
            { name: "Average Weight",   value: "250–350 grams (adult)" },
            { name: "Heart Rate",       value: "60–100 beats per minute (resting)" },
            { name: "Cardiac Output",   value: "5–6 liters per minute (resting)" },
            { name: "Chambers",         value: "4 (two atria and two ventricles)" },
            { name: "Development",      value: "Begins beating at 3 weeks gestation" }
        ],
        structures: [
            { name: "Atria",       description: "Upper chambers that receive blood" },
            { name: "Ventricles",  description: "Lower chambers that pump blood out" },
            { name: "Valves",      description: "Control blood flow direction" },
            { name: "Septum",      description: "Divides left and right sides" },
            { name: "Myocardium",  description: "Muscular tissue responsible for contractions" }
        ]
    },

    intestines: {
        title: "Intestines",
        subtitle: "Primary Site of Nutrient Absorption",
        description: "The intestines are the portion of the alimentary canal extending from the stomach to the anus. They consist of the small intestine (duodenum, jejunum, ileum) and the large intestine (colon, rectum), and are responsible for digestion and absorption of nutrients.",
        icon: "fa-wave-square",
        infoCards: [
            { title: "Primary Function",    content: "Absorbs nutrients and water from food, and processes waste for elimination. The small intestine is the primary site for nutrient absorption." },
            { title: "Anatomical Location", content: "Occupies most of the abdominal cavity; the small intestine is approximately 6–7 m long, and the large intestine is approximately 1.5 m long." },
            { title: "Clinical Significance", content: "Affected by inflammatory bowel disease (Crohn's, ulcerative colitis), colorectal cancer, irritable bowel syndrome, and infectious enteritis." },
            { title: "Ubiquitination Role",  content: "The UPS governs intestinal epithelial renewal and NF-κB inflammatory signaling. Dysregulation of E3 ligases like FBXW7 is linked to colorectal cancer." }
        ],
        stats: [
            { name: "Small Intestine Length", value: "6–7 meters" },
            { name: "Large Intestine Length", value: "~1.5 meters" },
            { name: "Surface Area",           value: "~250 m² (with villi)" },
            { name: "Transit Time",           value: "3–5 hours (small intestine)" },
            { name: "Microbiome",             value: "~38 trillion bacteria (colon)" }
        ],
        structures: [
            { name: "Duodenum",  description: "First section of small intestine; receives digestive enzymes" },
            { name: "Jejunum",   description: "Middle section; primary site of nutrient absorption" },
            { name: "Ileum",     description: "Final section; absorbs vitamin B12 and bile acids" },
            { name: "Colon",     description: "Large intestine; absorbs water and forms feces" },
            { name: "Villi",     description: "Finger-like projections increasing absorptive surface area" }
        ]
    },

    kidney: {
        title: "Kidney",
        subtitle: "Primary Organ of Blood Filtration",
        description: "The kidneys are a pair of bean-shaped organs located below the rib cage on each side of the spine. They filter blood, produce urine, regulate blood pressure, and maintain electrolyte balance.",
        icon: "fa-filter",
        infoCards: [
            { title: "Primary Function",    content: "Filters approximately 200 liters of blood per day, removes waste products and excess fluid via urine, and regulates electrolytes, acid-base balance, and blood pressure." },
            { title: "Anatomical Location", content: "Located retroperitoneally in the posterior abdominal wall, at the level of the T12–L3 vertebrae. The right kidney sits slightly lower due to the liver." },
            { title: "Clinical Significance", content: "Affected by chronic kidney disease, acute kidney injury, kidney stones (nephrolithiasis), glomerulonephritis, and polycystic kidney disease." },
            { title: "Ubiquitination Role",  content: "The UPS regulates renal tubular sodium transport and podocyte function. CRL E3 ligase complexes control hypoxia responses via HIF-1α degradation (VHL pathway)." }
        ],
        stats: [
            { name: "Average Weight",       value: "120–170 grams each" },
            { name: "Blood Filtered/Day",   value: "~200 liters" },
            { name: "Urine Produced/Day",   value: "1–2 liters" },
            { name: "Nephrons",             value: "~1 million per kidney" },
            { name: "GFR (normal)",         value: "90–120 mL/min/1.73m²" }
        ],
        structures: [
            { name: "Glomerulus",       description: "Capillary network for blood filtration" },
            { name: "Proximal Tubule",  description: "Reabsorbs glucose, amino acids, and electrolytes" },
            { name: "Loop of Henle",    description: "Concentrates urine via countercurrent mechanism" },
            { name: "Distal Tubule",    description: "Fine-tunes ion and water reabsorption" },
            { name: "Collecting Duct",  description: "Final concentration of urine under ADH regulation" }
        ]
    },

    liver: {
        title: "Liver",
        subtitle: "Primary Metabolic Organ",
        description: "The liver is the largest internal organ and gland in the human body. It performs over 500 vital functions including detoxification, protein synthesis, and production of biochemicals necessary for digestion.",
        icon: "fa-leaf",
        infoCards: [
            { title: "Primary Function",    content: "Processes nutrients from food, produces bile to help digest fats, filters toxins from the blood, regulates blood clotting, and stores vitamins and minerals." },
            { title: "Anatomical Location", content: "Located in the upper right quadrant of the abdomen, below the diaphragm." },
            { title: "Clinical Significance", content: "Subject to diseases such as hepatitis, cirrhosis, fatty liver disease (NAFLD/NASH), and hepatocellular carcinoma. Liver failure can be life-threatening." },
            { title: "Ubiquitination Role",  content: "Hepatic UPS controls lipid metabolism, gluconeogenesis, and iron homeostasis. E3 ligases like MARCH6 regulate lipid droplet biogenesis and PCSK9-mediated LDL receptor degradation." }
        ],
        stats: [
            { name: "Average Weight",  value: "1.4–1.6 kg (adult)" },
            { name: "Lobes",           value: "4 (right, left, caudate, quadrate)" },
            { name: "Regeneration",    value: "Can regenerate from 25% of original mass" },
            { name: "Blood Supply",    value: "Dual: hepatic artery + portal vein" },
            { name: "Functions",       value: "Over 500 known metabolic functions" }
        ],
        structures: [
            { name: "Lobules",               description: "Functional units of the liver" },
            { name: "Hepatocytes",           description: "Main metabolic cells (~80% of liver mass)" },
            { name: "Bile Ducts",            description: "Transport bile to the gallbladder and duodenum" },
            { name: "Hepatic Portal Vein",   description: "Brings nutrient-rich blood from digestive organs" },
            { name: "Kupffer Cells",         description: "Resident macrophages; immune surveillance" }
        ]
    },

    lung: {
        title: "Lung",
        subtitle: "Primary Organ of Gas Exchange",
        description: "The lungs are the primary organs of the respiratory system. They facilitate the exchange of oxygen from inhaled air into the bloodstream and the release of carbon dioxide from the blood into the exhaled air.",
        icon: "fa-lungs",
        infoCards: [
            { title: "Primary Function",    content: "Exchange of oxygen and carbon dioxide between the atmosphere and the bloodstream via millions of alveoli, maintaining blood oxygen and CO₂ levels." },
            { title: "Anatomical Location", content: "Located within the thoracic cavity on either side of the heart. The right lung has three lobes; the left has two lobes to accommodate the heart." },
            { title: "Clinical Significance", content: "Affected by pneumonia, chronic obstructive pulmonary disease (COPD), asthma, lung cancer, pulmonary fibrosis, and COVID-19-related acute respiratory distress." },
            { title: "Ubiquitination Role",  content: "UPS regulates surfactant protein quality control in alveolar type II cells. E3 ligase RNF5 targets misfolded CFTR for proteasomal degradation in cystic fibrosis." }
        ],
        stats: [
            { name: "Combined Weight",  value: "~1 kg (both lungs)" },
            { name: "Alveoli Count",    value: "~300–500 million" },
            { name: "Surface Area",     value: "~70 m² (gas exchange surface)" },
            { name: "Tidal Volume",     value: "~500 mL (at rest)" },
            { name: "Respiratory Rate", value: "12–20 breaths/min (adult)" }
        ],
        structures: [
            { name: "Trachea",    description: "Main airway leading to the bronchi" },
            { name: "Bronchi",    description: "Branch into progressively smaller bronchioles" },
            { name: "Alveoli",    description: "Tiny air sacs where gas exchange occurs" },
            { name: "Pleura",     description: "Double-layered membrane encasing each lung" },
            { name: "Diaphragm",  description: "Primary muscle driving breathing mechanics" }
        ]
    },

    lymph: {
        title: "Lymph Node",
        subtitle: "Central Hub of the Immune System",
        description: "Lymph nodes are small, bean-shaped glands distributed throughout the body as part of the lymphatic system. They filter lymph fluid and house immune cells that help fight infection and disease.",
        icon: "fa-shield-alt",
        infoCards: [
            { title: "Primary Function",    content: "Filter lymph fluid to remove pathogens, dead cells, and foreign particles; activate B and T lymphocytes to mount adaptive immune responses." },
            { title: "Anatomical Location", content: "Clustered in the neck, armpits, groin, chest, and abdomen. Connected by lymphatic vessels that drain lymph fluid from tissues." },
            { title: "Clinical Significance", content: "Enlarged lymph nodes (lymphadenopathy) indicate infection, autoimmune disease, or lymphoma. Important staging sites for cancer metastasis." },
            { title: "Ubiquitination Role",  content: "UPS governs lymphocyte activation, antigen presentation, and NF-κB signaling. A20 (TNFAIP3) is a key DUB that terminates inflammatory NF-κB responses in lymphoid tissue." }
        ],
        stats: [
            { name: "Count in Body",    value: "500–700 lymph nodes total" },
            { name: "Size (normal)",    value: "0.1–2.5 cm diameter" },
            { name: "Lymph Flow",       value: "~2–4 L/day recirculated" },
            { name: "Key Cell Types",   value: "B cells, T cells, macrophages, DCs" },
            { name: "Response Time",    value: "Primary response: 4–7 days" }
        ],
        structures: [
            { name: "Cortex",         description: "Outer zone containing B cell follicles" },
            { name: "Paracortex",     description: "T cell zone; site of antigen presentation" },
            { name: "Medulla",        description: "Contains macrophages and plasma cells" },
            { name: "Germinal Center", description: "Site of B cell maturation and antibody affinity" },
            { name: "Sinuses",        description: "Channels through which lymph percolates" }
        ]
    },

    skin: {
        title: "Skin",
        subtitle: "Largest Organ of the Integumentary System",
        description: "The skin is the largest organ of the human body, forming a protective barrier between the internal organs and the external environment. It regulates temperature, prevents water loss, and provides sensory input.",
        icon: "fa-hand-paper",
        infoCards: [
            { title: "Primary Function",    content: "Acts as a physical barrier against pathogens, UV radiation, and mechanical injury; regulates body temperature through sweating and vasodilation; provides tactile sensation." },
            { title: "Anatomical Location", content: "Covers the entire external surface of the body. Total surface area is approximately 1.5–2 m² in adults." },
            { title: "Clinical Significance", content: "Affected by psoriasis, eczema (atopic dermatitis), melanoma, basal cell carcinoma, squamous cell carcinoma, and wound healing disorders." },
            { title: "Ubiquitination Role",  content: "UPS controls keratinocyte differentiation and epidermal barrier formation. ITCH (WWPP2) E3 ligase regulates Notch and Wnt signaling in skin homeostasis." }
        ],
        stats: [
            { name: "Total Area",     value: "~1.5–2 m² (adult)" },
            { name: "Weight",         value: "~4–5 kg (with subcutis)" },
            { name: "Thickness",      value: "0.5 mm (eyelid) to 4 mm (back)" },
            { name: "Renewal Rate",   value: "~30 days for full epidermal turnover" },
            { name: "Layers",         value: "3 main: epidermis, dermis, hypodermis" }
        ],
        structures: [
            { name: "Epidermis",       description: "Outermost layer; composed mainly of keratinocytes" },
            { name: "Dermis",          description: "Middle layer; contains collagen, hair follicles, glands" },
            { name: "Hypodermis",      description: "Deepest layer; adipose tissue for insulation" },
            { name: "Melanocytes",     description: "Produce melanin pigment for UV protection" },
            { name: "Langerhans Cells", description: "Dendritic cells serving as skin immune sentinels" }
        ]
    },

    spleen: {
        title: "Spleen",
        subtitle: "Largest Lymphatic Organ",
        description: "The spleen is the largest organ of the lymphatic system, located in the upper left abdomen. It filters blood, recycles iron from aged red blood cells, and serves as a reservoir for immune cells.",
        icon: "fa-tint",
        infoCards: [
            { title: "Primary Function",    content: "Filters blood to remove old or damaged red blood cells; stores monocytes and platelets; mounts immune responses to blood-borne pathogens." },
            { title: "Anatomical Location", content: "Located in the upper left quadrant of the abdomen, posterior to the stomach and protected by the 9th–11th ribs." },
            { title: "Clinical Significance", content: "Enlarged spleen (splenomegaly) occurs in infections, hemolytic anemia, and lymphoma. Spleen rupture is a surgical emergency." },
            { title: "Ubiquitination Role",  content: "Splenic UPS coordinates macrophage-mediated clearance of senescent erythrocytes. TRIM21 (Ro52) is an intracellular antibody receptor E3 ligase active in splenic immune responses." }
        ],
        stats: [
            { name: "Average Weight",   value: "150–200 grams (adult)" },
            { name: "Dimensions",       value: "~12 × 7 × 4 cm" },
            { name: "Blood Storage",    value: "~200–300 mL blood reservoir" },
            { name: "RBC Removal",      value: "~120-day lifespan of red blood cells" },
            { name: "Platelet Reserve", value: "~30% of platelet pool stored" }
        ],
        structures: [
            { name: "Red Pulp",      description: "Filters blood; removes old erythrocytes" },
            { name: "White Pulp",    description: "Lymphoid tissue; immune cell activation" },
            { name: "Marginal Zone", description: "Interface between red and white pulp" },
            { name: "Sinusoids",     description: "Specialized blood vessels for cell filtration" },
            { name: "Trabeculae",    description: "Connective tissue partitions structuring the spleen" }
        ]
    },

    testicle: {
        title: "Testis",
        subtitle: "Primary Male Reproductive Organ",
        description: "The testes are the male reproductive glands that produce sperm (spermatogenesis) and synthesize male sex hormones, primarily testosterone. They are located within the scrotum, external to the body.",
        icon: "fa-circle",
        infoCards: [
            { title: "Primary Function",    content: "Produce sperm cells through spermatogenesis and secrete testosterone to drive male secondary sex characteristics and maintain reproductive function." },
            { title: "Anatomical Location", content: "Located within the scrotum, suspended by the spermatic cord. The external position maintains temperature ~2°C below core body temperature, optimal for spermatogenesis." },
            { title: "Clinical Significance", content: "Affected by testicular cancer (most common cancer in males aged 15–35), cryptorchidism, orchitis, varicocele, and male infertility." },
            { title: "Ubiquitination Role",  content: "UPS is essential for meiotic progression and spermatid differentiation. The testis expresses a unique set of E2 enzymes (e.g., UBE2B/Rad6B) critical for chromatin remodeling during spermatogenesis." }
        ],
        stats: [
            { name: "Average Size",           value: "~4.5 × 3 × 2.5 cm each" },
            { name: "Average Weight",         value: "~20–25 grams each" },
            { name: "Sperm Production",       value: "~100–200 million sperm/day" },
            { name: "Spermatogenesis Cycle",  value: "~64–74 days" },
            { name: "Testosterone Output",    value: "~3–10 mg/day" }
        ],
        structures: [
            { name: "Seminiferous Tubules", description: "Site of sperm production via spermatogenesis" },
            { name: "Sertoli Cells",        description: "Nurse cells supporting developing spermatids" },
            { name: "Leydig Cells",         description: "Produce testosterone in the interstitial space" },
            { name: "Epididymis",           description: "Stores and matures sperm after production" },
            { name: "Rete Testis",          description: "Network of tubules draining into the epididymis" }
        ]
    }
};

// =============================================================================
// Event Listeners
// =============================================================================
function initEventListeners() {
    // Organ link clicks
    organLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const organ = this.getAttribute('data-organ');
            showOrganDetail(organ);
        });
    });

    // Back button
    backLink.addEventListener('click', function(e) {
        e.preventDefault();
        organDetail.style.display = 'none';
        mainContent.style.display = 'block';
    });

    // Search button
    searchBtn.addEventListener('click', function() {
        const term = searchInput.value.toLowerCase().trim();
        if (!term) return;

        const organs = Object.keys(organData);
        // Also support "testis" -> testicle
        const alias = { testis: 'testicle', lymphnode: 'lymph', 'lymph node': 'lymph' };
        const normalised = alias[term] || term;
        const matched = organs.find(o => o.includes(normalised));

        if (matched) {
            showOrganDetail(matched);
        } else {
            alert(`No organ found matching "${term}". Try: brain, heart, liver, kidney, lung, skin, spleen, intestines, lymph, testicle.`);
        }
    });

    // Search on Enter key
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchBtn.click();
    });

    // Pagination
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadBrainData(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            loadBrainData(currentPage);
        }
    });
}

// =============================================================================
// Show Organ Detail
// =============================================================================
function showOrganDetail(organ) {
    const data = organData[organ] || organData.brain;

    // Update header
    document.getElementById('detail-title').textContent    = data.title;
    document.getElementById('detail-subtitle').textContent = data.subtitle;
    document.getElementById('detail-description').textContent = data.description;

    // Update icon
    organIcon.className = `fas ${data.icon}`;

    // Render dynamic sections
    renderInfoCards(data.infoCards);
    renderOrganStats(data.stats);
    renderKeyStructures(data.structures);

    // Brain data table: only show for brain organ
    const brainContainer = document.getElementById('brain-data-container');
    if (organ === 'brain') {
        brainContainer.style.display = 'block';
        currentPage = 1;
        totalPages  = 1;
        loadingIndicator.style.display    = 'block';
        brainDataTable.style.display      = 'none';
        paginationControls.style.display  = 'none';
        errorMessage.style.display        = 'none';
        loadBrainData(currentPage);
    } else {
        brainContainer.style.display = 'none';
    }

    // Switch view
    mainContent.style.display  = 'none';
    organDetail.style.display  = 'block';
    window.scrollTo(0, 0);
}

// =============================================================================
// Render Helpers
// =============================================================================
function renderInfoCards(cards) {
    const container = document.getElementById('organ-info-grid');
    container.innerHTML = '';
    cards.forEach(card => {
        const el = document.createElement('div');
        el.className = 'info-card';
        el.innerHTML = `<h3>${card.title}</h3><p>${card.content}</p>`;
        container.appendChild(el);
    });
}

function renderOrganStats(stats) {
    const tbody = document.getElementById('organ-stats-body');
    tbody.innerHTML = '';
    stats.forEach(stat => {
        const row = document.createElement('tr');
        row.innerHTML = `<th>${stat.name}</th><td>${stat.value}</td>`;
        tbody.appendChild(row);
    });
}

function renderKeyStructures(structures) {
    const tbody = document.getElementById('key-structures-body');
    tbody.innerHTML = '';
    structures.forEach(s => {
        const row = document.createElement('tr');
        row.innerHTML = `<th>${s.name}</th><td>${s.description}</td>`;
        tbody.appendChild(row);
    });
}

// =============================================================================
// Brain Data API
// =============================================================================
function loadBrainData(page) {
    if (isBrainDataLoading) return;

    isBrainDataLoading = true;
    loadingIndicator.style.display    = 'block';
    brainDataTable.style.display      = 'none';
    paginationControls.style.display  = 'none';
    errorMessage.style.display        = 'none';
    brainDataBody.innerHTML           = '';

    fetch(`${API_ENDPOINT}?page=${page}&per_page=${PAGE_SIZE}`)
        .then(response => {
            if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.data && data.data.length > 0) {
                renderBrainData(data.data);
                totalPages = Math.ceil(data.total / PAGE_SIZE);
                updatePaginationControls(page, totalPages);
                brainDataTable.style.display     = 'table';
                paginationControls.style.display = 'flex';
            } else {
                brainDataBody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:20px;">No brain data available</td></tr>';
                brainDataTable.style.display     = 'table';
                paginationControls.style.display = 'flex';
            }
        })
        .catch(error => {
            console.error('Error fetching brain data:', error);
            errorMessage.textContent = 'Database connection failed. Please ensure the backend service is running on port 5000 and the ubi_database exists.';
            errorMessage.style.display = 'block';
        })
        .finally(() => {
            isBrainDataLoading = false;
            loadingIndicator.style.display = 'none';
        });
}

function renderBrainData(data) {
    brainDataBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item['EG.PrecursorId'] || 'N/A'}</td>
            <td>${item.Brain_NC1  || 'N/A'}</td>
            <td>${item.Brain_NC2  || 'N/A'}</td>
            <td>${item.Brain_NC3  || 'N/A'}</td>
            <td>${item.Brain_9d1  || 'N/A'}</td>
            <td>${item.Brain_9d2  || 'N/A'}</td>
            <td>${item.Brain_9d3  || 'N/A'}</td>
            <td>${item.Brain_28d1 || 'N/A'}</td>
            <td>${item.Brain_28d2 || 'N/A'}</td>
            <td>${item.Brain_28d3 || 'N/A'}</td>
        `;
        brainDataBody.appendChild(row);
    });
}

function updatePaginationControls(page, total) {
    pageInfo.textContent    = `Page ${page} of ${total}`;
    prevPageBtn.disabled    = page <= 1;
    nextPageBtn.disabled    = page >= total;
}

// =============================================================================
// Init
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
});
