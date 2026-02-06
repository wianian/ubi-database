// 常量定义
const PAGE_SIZE = 20;
const API_ENDPOINT = 'http://localhost:5000/api/brain';

// 状态管理
let currentPage = 1;
let totalPages = 1;
let isBrainDataLoading = false;

// DOM元素引用
const mainContent = document.getElementById('main-content');
const organDetail = document.getElementById('organ-detail');
const backLink = document.getElementById('back-link');
const organLinks = document.querySelectorAll('.organ-link');
const searchInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-btn');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const brainDataBody = document.getElementById('brain-data-body');
const brainDataTable = document.getElementById('brain-data-table');
const paginationControls = document.getElementById('pagination-controls');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');
const organIcon = document.getElementById('organ-icon');

// 器官数据
const organData = {
    brain: {
        title: "Brain",
        subtitle: "Central Organ of the Nervous System",
        description: "The brain is the central organ of the human nervous system, responsible for processing sensory information, regulating bodily functions, and enabling cognition and consciousness. It consists of the cerebrum, brainstem, and cerebellum.",
        infoCards: [
            { title: "Primary Function", content: "Processes sensory information, controls thought, memory, emotion, touch, motor skills, vision, breathing, temperature, hunger and every process that regulates our body." },
            { title: "Anatomical Location", content: "Contained within the skull, occupying the cranial cavity. Divided into three main parts: forebrain, midbrain, and hindbrain." },
            { title: "Clinical Significance", content: "Subject to various disorders including neurodegenerative diseases (Alzheimer's, Parkinson's), stroke, tumors, infections, and trauma. Requires constant blood supply." },
            { title: "Ubi", content: "Subject to various disorders including neurodegenerative diseases (Alzheimer's, Parkinson's), stroke, tumors, infections, and trauma. Requires constant blood supply." }
        ],
        stats: [
            { name: "Average Weight", value: "1.3-1.4 kg (adult)" },
            { name: "Neurons", value: "Approximately 86 billion" },
            { name: "Oxygen Consumption", value: "20% of total body oxygen" },
            { name: "Blood Flow", value: "15-20% of cardiac output" },
            { name: "Development", value: "Reaches full size by age 25" }
        ],
        structures: [
            { name: "Cerebrum", description: "Largest part, responsible for higher brain functions" },
            { name: "Cerebellum", description: "Coordinates voluntary movements and balance" },
            { name: "Brainstem", description: "Controls automatic functions (breathing, heart rate)" },
            { name: "Diencephalon", description: "Contains thalamus and hypothalamus" },
            { name: "Cerebral Cortex", description: "Outer layer of neural tissue, enables cognition" }
        ],
        icon: "fa-brain"
    },
    heart: {
        title: "Heart",
        subtitle: "Central Pump of the Circulatory System",
        description: "The heart is a muscular organ that pumps blood through the blood vessels of the circulatory system. It provides the body with oxygen and nutrients while removing carbon dioxide and other wastes.",
        infoCards: [
            { title: "Primary Function", content: "Pumps blood throughout the body via the circulatory system, supplying oxygen and nutrients to tissues and removing carbon dioxide and other wastes." },
            { title: "Anatomical Location", content: "Located in the mediastinum of the thoracic cavity, between the lungs and slightly left of center." },
            { title: "Clinical Significance", content: "Subject to conditions such as coronary artery disease, heart failure, arrhythmias, and valvular heart disease. Cardiovascular disease is the leading cause of death globally." },
            { title: "Ubi", content: "Subject to various disorders including neurodegenerative diseases (Alzheimer's, Parkinson's), stroke, tumors, infections, and trauma. Requires constant blood supply." }
        ],
        stats: [
            { name: "Average Weight", value: "250-350 grams (adult)" },
            { name: "Beats", value: "60-100 beats per minute (resting)" },
            { name: "Output", value: "5-6 liters per minute (resting)" },
            { name: "Chambers", value: "4 (two atria and two ventricles)" },
            { name: "Development", value: "Begins beating at 3 weeks gestation" }
        ],
        structures: [
            { name: "Atria", description: "Upper chambers that receive blood" },
            { name: "Ventricles", description: "Lower chambers that pump blood out" },
            { name: "Valves", description: "Control blood flow direction" },
            { name: "Septum", description: "Divides left and right sides" },
            { name: "Myocardium", description: "Muscular tissue responsible for contractions" }
        ],
        icon: "fa-heart"
    },
    liver: {
        title: "Liver",
        subtitle: "Primary Metabolic Organ",
        description: "The liver is the largest internal organ and gland in the human body. It performs over 500 vital functions including detoxification, protein synthesis, and production of biochemicals necessary for digestion.",
        infoCards: [
            { title: "Primary Function", content: "Processes nutrients from food, produces bile to help digest fats, filters toxins from the blood, regulates blood clotting, and stores vitamins and minerals." },
            { title: "Anatomical Location", content: "Located in the upper right quadrant of the abdomen, below the diaphragm." },
            { title: "Clinical Significance", content: "Subject to diseases such as hepatitis, cirrhosis, fatty liver disease, and cancer. Liver failure can be life-threatening." },
            { title: "Ubi", content: "Subject to various disorders including neurodegenerative diseases (Alzheimer's, Parkinson's), stroke, tumors, infections, and trauma. Requires constant blood supply." }
        ],
        stats: [
            { name: "Average Weight", value: "1.4-1.6 kg (adult)" },
            { name: "Lobes", value: "4 (right, left, caudate, and quadrate)" },
            { name: "Regeneration", value: "Can regenerate from as little as 25% of original mass" },
            { name: "Blood Supply", value: "Dual blood supply from hepatic artery and portal vein" },
            { name: "Functions", value: "Over 500 known functions" }
        ],
        structures: [
            { name: "Lobules", description: "Functional units of the liver" },
            { name: "Hepatocytes", description: "Main functional cells" },
            { name: "Bile Ducts", description: "Transport bile to gallbladder" },
            { name: "Hepatic Portal Vein", description: "Brings nutrient-rich blood from digestive organs" },
            { name: "Hepatic Artery", description: "Supplies oxygen-rich blood" }
        ],
        icon: "fa-leaf"
    }
};

// 初始化事件监听器
function initEventListeners() {
    // 器官链接点击事件
    organLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const organ = this.getAttribute('data-organ');
            showOrganDetail(organ);
        });
    });

    // 返回链接点击事件
    backLink.addEventListener('click', function(e) {
        e.preventDefault();
        organDetail.style.display = 'none';
        mainContent.style.display = 'block';
    });

    // 搜索按钮点击事件
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            const organs = ['brain', 'heart', 'intestines', 'kidney', 'liver', 'lung', 'lymph', 'skin', 'spleen', 'testicle'];
            const matchedOrgan = organs.find(organ => organ.includes(searchTerm));
            
            if (matchedOrgan) {
                showOrganDetail(matchedOrgan);
            } else {
                alert(`No organ found matching "${searchTerm}". Try "brain", "heart", or "liver".`);
            }
        }
    });

    // 搜索框回车事件
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // 分页按钮事件
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

// 显示器官详情
function showOrganDetail(organ) {
    const data = organData[organ] || organData.brain;
    
    // 更新详情页内容
    document.getElementById('detail-title').textContent = data.title;
    document.getElementById('detail-subtitle').textContent = data.subtitle;
    document.getElementById('detail-description').textContent = data.description;
    
    // 更新图标
    organIcon.className = `fas ${data.icon}`;
    
    // 更新信息卡片
    renderInfoCards(data.infoCards);
    
    // 更新统计数据
    renderOrganStats(data.stats);
    
    // 更新结构信息
    renderKeyStructures(data.structures);
    
    // 如果是brain器官，加载数据表格
    if (organ === 'brain') {
        // 重置分页状态
        currentPage = 1;
        totalPages = 1;
        
        // 显示加载指示器
        loadingIndicator.style.display = 'block';
        brainDataTable.style.display = 'none';
        paginationControls.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // 加载数据
        loadBrainData(currentPage);
    }
    
    // 显示详情页，隐藏主内容
    mainContent.style.display = 'none';
    organDetail.style.display = 'block';
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

// 渲染信息卡片
function renderInfoCards(cards) {
    const container = document.getElementById('organ-info-grid');
    container.innerHTML = '';
    
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'info-card';
        cardElement.innerHTML = `
            <h3>${card.title}</h3>
            <p>${card.content}</p>
        `;
        container.appendChild(cardElement);
    });
}

// 渲染器官统计数据
function renderOrganStats(stats) {
    const container = document.getElementById('organ-stats-body');
    container.innerHTML = '';
    
    stats.forEach(stat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th>${stat.name}</th>
            <td>${stat.value}</td>
        `;
        container.appendChild(row);
    });
}

// 渲染关键结构
function renderKeyStructures(structures) {
    const container = document.getElementById('key-structures-body');
    container.innerHTML = '';
    
    structures.forEach(structure => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th>${structure.name}</th>
            <td>${structure.description}</td>
        `;
        container.appendChild(row);
    });
}

// 加载brain数据
function loadBrainData(page) {
    // 防止重复请求
    if (isBrainDataLoading) return;
    
    // 设置加载状态
    isBrainDataLoading = true;
    loadingIndicator.style.display = 'block';
    brainDataTable.style.display = 'none';
    paginationControls.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // 清空现有数据
    brainDataBody.innerHTML = '';
    
    // 发起API请求
    fetch(`${API_ENDPOINT}?page=${page}&per_page=${PAGE_SIZE}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 处理数据
            if (data.data && data.data.length > 0) {
                // 渲染表格数据
                renderBrainData(data.data);
                
                // 更新分页信息
                totalPages = Math.ceil(data.total / PAGE_SIZE);
                updatePaginationControls(page, totalPages);
                
                // 显示表格和分页控件
                brainDataTable.style.display = 'table';
                paginationControls.style.display = 'flex';
            } else {
                // 没有数据的情况
                brainDataBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No brain data available</td></tr>';
                brainDataTable.style.display = 'table';
                paginationControls.style.display = 'flex';
            }
        })
        .catch(error => {
            console.error('Error fetching brain data:', error);
            // 显示更具体的错误信息
            errorMessage.textContent = `Database connection failed. Please check: 
                - Database service is running
                - Correct port (715) is used
                - Database 'ubi_database' exists`;
            errorMessage.style.display = 'block';
        })
        .finally(() => {
            // 重置加载状态
            isBrainDataLoading = false;
            loadingIndicator.style.display = 'none';
        });
}

// 渲染brain数据到表格
function renderBrainData(data) {
    brainDataBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        // 使用实际的字段名
        row.innerHTML = `
            <td>${item['EG.PrecursorId'] || 'N/A'}</td>
            <td>${item.Brain_NC1 || 'N/A'}</td>
            <td>${item.Brain_NC2 || 'N/A'}</td>
            <td>${item.Brain_NC3 || 'N/A'}</td>
            <td>${item.Brain_9d1 || 'N/A'}</td>
            <td>${item.Brain_9d2 || 'N/A'}</td>
            <td>${item.Brain_9d3 || 'N/A'}</td>
            <td>${item.Brain_28d1 || 'N/A'}</td>
            <td>${item.Brain_28d2 || 'N/A'}</td>
            <td>${item.Brain_28d3 || 'N/A'}</td>
        `;
        
        brainDataBody.appendChild(row);
    });
}

// 更新分页控件
function updatePaginationControls(currentPage, totalPages) {
    // 更新页面信息
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    // 更新按钮状态
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
}

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
});