// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const adminStatus = document.getElementById('adminStatus');
const searchInput = document.getElementById('searchInput');
const subjectFilter = document.getElementById('subjectFilter');
const semesterFilter = document.getElementById('semesterFilter');
const yearFilter = document.getElementById('yearFilter');
const resetFilters = document.getElementById('resetFilters');
const papersContainer = document.getElementById('papers-container');
const paperCount = document.getElementById('paperCount');
const totalDownloads = document.getElementById('totalDownloads');

// Global variables
let allPapers = [];
let totalDownloadCount = 0;

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    await loadPapers();
    setupEventListeners();
});

// Load papers from GitHub
async function loadPapers() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/shuklaanand95/cutm-question-papers/main/data/papers.json');
        const data = await response.json();
        allPapers = data.papers;
        
        // Calculate total downloads
        totalDownloadCount = allPapers.reduce((sum, paper) => sum + paper.downloads, 0);
        
        displayPapers(allPapers);
        updateStats();
    } catch (error) {
        console.error('Error loading papers:', error);
        papersContainer.innerHTML = '<p class="error">Failed to load papers. Please try again later.</p>';
    }
}

// Display papers in the grid
function displayPapers(papers) {
    papersContainer.innerHTML = '';
    
    if (papers.length === 0) {
        papersContainer.innerHTML = '<p class="no-results">No papers found matching your criteria.</p>';
        return;
    }
    
    papers.forEach(paper => {
        const paperCard = document.createElement('div');
        paperCard.className = 'paper-card';
        
        paperCard.innerHTML = `
            <div class="paper-img">
                <i class="fas fa-file-pdf"></i>
            </div>
            <div class="paper-content">
                <h3>${paper.title}</h3>
                <div class="paper-meta">
                    <span>${paper.subject}</span>
                    <span>Sem ${paper.semester}</span>
                </div>
                <div class="paper-meta">
                    <span>${paper.year}</span>
                    <span class="download-count">${paper.downloads} downloads</span>
                </div>
                <a href="${paper.file}" class="download-btn" data-id="${paper.id}" download>
                    <i class="fas fa-download"></i> Download
                </a>
            </div>
        `;
        
        papersContainer.appendChild(paperCard);
    });
    
    // Add download event listeners
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const paperId = parseInt(btn.getAttribute('data-id'));
            recordDownload(paperId);
        });
    });
}

// Record download (simulated - would need backend in real app)
function recordDownload(paperId) {
    const paper = allPapers.find(p => p.id === paperId);
    if (paper) {
        paper.downloads++;
        totalDownloadCount++;
        updateStats();
        
        // Find and update the download count display
        const downloadElements = document.querySelectorAll(`.download-btn[data-id="${paperId}"]`);
        downloadElements.forEach(el => {
            const countElement = el.closest('.paper-content').querySelector('.download-count');
            if (countElement) {
                countElement.textContent = `${paper.downloads} downloads`;
            }
        });
    }
}

// Update statistics display
function updateStats() {
    paperCount.textContent = `${allPapers.length} papers`;
    totalDownloads.textContent = `${totalDownloadCount} total downloads`;
}

// Filter papers based on search and filters
function filterPapers() {
    const searchTerm = searchInput.value.toLowerCase();
    const subject = subjectFilter.value;
    const semester = semesterFilter.value;
    const year = yearFilter.value;
    
    const filteredPapers = allPapers.filter(paper => {
        const matchesSearch = paper.title.toLowerCase().includes(searchTerm) || 
                             paper.subject.toLowerCase().includes(searchTerm);
        const matchesSubject = !subject || paper.subject === subject;
        const matchesSemester = !semester || paper.semester === semester;
        const matchesYear = !year || paper.year === year;
        
        return matchesSearch && matchesSubject && matchesSemester && matchesYear;
    });
    
    displayPapers(filteredPapers);
    paperCount.textContent = `${filteredPapers.length} papers`;
}

// Setup event listeners
function setupEventListeners() {
    // Admin login
    loginBtn.addEventListener('click', () => {
        const userId = prompt('Enter Admin ID:');
        const password = prompt('Enter Password:');
        
        if (userId === 'ANANDKR' && password === '12345@') {
            adminStatus.textContent = 'Admin mode';
            setTimeout(() => {
                window.location.href = 'admin/upload.html';
            }, 1000);
        } else {
            alert('Invalid credentials!');
        }
    });
    
    // Search and filter events
    searchInput.addEventListener('input', filterPapers);
    subjectFilter.addEventListener('change', filterPapers);
    semesterFilter.addEventListener('change', filterPapers);
    yearFilter.addEventListener('change', filterPapers);
    
    // Reset filters
    resetFilters.addEventListener('click', () => {
        searchInput.value = '';
        subjectFilter.value = '';
        semesterFilter.value = '';
        yearFilter.value = '';
        filterPapers();
    });
}
