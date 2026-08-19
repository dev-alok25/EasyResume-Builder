/**
 * EasyResume - Simple, Fast, Real-Time Resume Builder Engine
 */


document.addEventListener('DOMContentLoaded', () => {
    // --- Initial State Definition ---
    const defaultData = {
        template: 'layout-modern',
        themeColor: '#10b981',
        font: 'font-inter',
        personal: {
            fullName: 'abcd',
            jobTitle: 'Senior Full Stack Engineer',
            email: 'abcd@example.com',
            phone: '+91 1234567890',
            location: 'Lucknow',
            website: 'xyz.dev',
            linkedin: 'linkedin.com/in/abcd',
            github: 'github.com/dev-abcd',
            photo: ''
        },
        summary: 'Passionate and results-driven Senior Full Stack Engineer with 6+ years of experience crafting high-performance web applications, scalable backend APIs, and intuitive user experiences. Proven track record in leading engineering teams, optimizing site speed, and driving cloud architecture modernization.',
        experience: [
            {
                id: 'exp-1',
                title: 'Senior Software Engineer',
                company: 'Apex Cloud Technologies',
                location: 'delhi',
                dates: '2022 - Present',
                description: '• Architected and deployed microservices using Node.js, React, and GraphQL handling 5M+ daily requests.\n• Reduced page load times by 42% across core application dashboards through dynamic code-splitting and asset optimization.\n• Mentored a team of 5 junior engineers and established automated CI/CD deployment pipelines.'
            },
            {
                id: 'exp-2',
                title: 'Software Engineer',
                company: 'Vanguard Digital Solutions',
                location: 'Austin, mumbai',
                dates: '2019 - 2022',
                description: '• Developed responsive client web apps using React, TypeScript, and Tailwind CSS.\n• Integrated Stripe payment solutions, increasing checkout conversion by 15%.\n• Designed and maintained relational Postgres database schemas with zero-downtime migrations.'
            }
        ],
        education: [
            {
                id: 'edu-1',
                degree: 'B.Tech. in Computer Science engineering',
                school: 'IIT Dholakpur',
                location: 'Dholakpur India',
                dates: '2015 - 2019',
                description: 'President of Computer Science Student Association'
            }
        ],
        skills: 'JavaScript, TypeScript, React, Next.js, Node.js, Python, PostgreSQL, MongoDB, Docker, AWS, GraphQL, REST APIs, Git, UI/UX Design',
        projects: [
            {
                id: 'proj-1',
                title: 'DevPulse - Developer Productivity Suite',
                subtitle: 'Open Source Tool (1.2k Stars)',
                dates: '2023',
                description: 'Built a lightweight developer analytics desktop dashboard utilizing Electron and React. Features real-time system metrics and automated workflow tracking.'
            }
        ]
    };

    let resumeState = loadFromStorage() || JSON.parse(JSON.stringify(defaultData));

    // --- DOM Elements ---
    const inputFullName = document.getElementById('input-fullName');
    const inputJobTitle = document.getElementById('input-jobTitle');
    const inputEmail = document.getElementById('input-email');
    const inputPhone = document.getElementById('input-phone');
    const inputLocation = document.getElementById('input-location');
    const inputWebsite = document.getElementById('input-website');
    const inputLinkedin = document.getElementById('input-linkedin');
    const inputGithub = document.getElementById('input-github');
    const inputSummary = document.getElementById('input-summary');
    const inputSkills = document.getElementById('input-skills');
    const fontSelect = document.getElementById('fontSelect');
    const templateSelect = document.getElementById('templateSelect');
    const densitySelect = document.getElementById('densitySelect');

    const expListContainer = document.getElementById('experience-list');
    const eduListContainer = document.getElementById('education-list');
    const projListContainer = document.getElementById('projects-list');

    const addExpBtn = document.getElementById('addExperienceBtn');
    const addEduBtn = document.getElementById('addEducationBtn');
    const addProjBtn = document.getElementById('addProjectBtn');

    const loadSampleBtn = document.getElementById('loadSampleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const printBtn = document.getElementById('printBtn');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const importJsonInput = document.getElementById('importJsonInput');

    const inputPhoto = document.getElementById('input-photo');
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    const editorPhotoPreview = document.getElementById('editorPhotoPreview');
    const photoPlaceholderIcon = document.getElementById('photoPlaceholderIcon');
    const prevAvatarWrap = document.getElementById('prev-avatar-wrap');
    const prevAvatar = document.getElementById('prev-avatar');

    // --- Initialize UI ---
    function init() {
        bindPersonalInputs();
        bindStyleControls();
        bindHeaderActions();
        bindDynamicListButtons();
        initWordEditor();

        // Populate forms from state
        syncStateToForms();
        // Render preview
        renderPreview();
    }

    // --- State Management & Storage ---
    function saveToStorage() {
        try {
            localStorage.setItem('easyresume_data', JSON.stringify(resumeState));
        } catch (e) {
            console.error('LocalStorage write error:', e);
        }
    }

    function loadFromStorage() {
        try {
            const raw = localStorage.getItem('easyresume_data');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function updateThemeColor(colorHex) {
        resumeState.themeColor = colorHex;
        document.documentElement.style.setProperty('--accent-color', colorHex);

        // Calculate dynamic light tint for chips
        document.documentElement.style.setProperty('--accent-light', colorHex + '18');
        document.documentElement.style.setProperty('--accent-subtle', colorHex + '40');

        saveToStorage();
    }

    function updateFont(fontClass) {
        resumeState.font = fontClass;
        document.body.className = `${fontClass}`;
        saveToStorage();
    }

    // --- Sync State <-> Forms ---
    function syncStateToForms() {
        inputFullName.value = resumeState.personal.fullName || '';
        inputJobTitle.value = resumeState.personal.jobTitle || '';
        inputEmail.value = resumeState.personal.email || '';
        inputPhone.value = resumeState.personal.phone || '';
        inputLocation.value = resumeState.personal.location || '';
        inputWebsite.value = resumeState.personal.website || '';
        inputLinkedin.value = resumeState.personal.linkedin || '';
        inputGithub.value = resumeState.personal.github || '';

        inputSummary.value = resumeState.summary || '';
        inputSkills.value = resumeState.skills || '';

        fontSelect.value = resumeState.font || 'font-inter';
        templateSelect.value = resumeState.template || 'layout-modern';
        if (densitySelect) densitySelect.value = resumeState.density || 'density-normal';
        updateFont(resumeState.font || 'font-inter');
        updateThemeColor(resumeState.themeColor || '#3b82f6');

        syncPhotoPreview();

        // Color dots active class
        document.querySelectorAll('.color-dot').forEach(dot => {
            if (dot.dataset.color.toLowerCase() === (resumeState.themeColor || '').toLowerCase()) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        renderDynamicFormLists();
    }

    function syncPhotoPreview() {
        const photoUrl = resumeState.personal.photo || '';
        if (photoUrl) {
            editorPhotoPreview.src = photoUrl;
            editorPhotoPreview.style.display = 'block';
            photoPlaceholderIcon.style.display = 'none';
            removePhotoBtn.style.display = 'inline-flex';
        } else {
            editorPhotoPreview.src = '';
            editorPhotoPreview.style.display = 'none';
            photoPlaceholderIcon.style.display = 'block';
            removePhotoBtn.style.display = 'none';
        }
    }

    // --- Render Dynamic Lists in Editor ---
    function renderDynamicFormLists() {
        // Experience Form Cards
        expListContainer.innerHTML = '';
        resumeState.experience.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'dynamic-item-card';
            card.innerHTML = `
                <div class="item-card-header">
                    <span class="item-card-title">Experience #${index + 1}</span>
                    <button class="btn-remove" data-type="exp" data-id="${item.id}" title="Remove"><i data-lucide="trash-2"></i></button>
                </div>
                <div class="form-group margin-b">
                    <label>Job Title</label>
                    <input type="text" class="exp-input" data-id="${item.id}" data-field="title" value="${escapeHtml(item.title)}">
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" class="exp-input" data-id="${item.id}" data-field="company" value="${escapeHtml(item.company)}">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" class="exp-input" data-id="${item.id}" data-field="location" value="${escapeHtml(item.location)}">
                    </div>
                </div>
                <div class="form-group" style="margin-top: 8px;">
                    <label>Dates / Period</label>
                    <input type="text" class="exp-input" data-id="${item.id}" data-field="dates" value="${escapeHtml(item.dates)}">
                </div>
                <div class="form-group" style="margin-top: 8px;">
                    <label>Description / Bullet Points</label>
                    <textarea rows="3" class="exp-input" data-id="${item.id}" data-field="description">${escapeHtml(item.description)}</textarea>
                </div>
            `;
            expListContainer.appendChild(card);
        });

        // Education Form Cards
        eduListContainer.innerHTML = '';
        resumeState.education.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'dynamic-item-card';
            card.innerHTML = `
                <div class="item-card-header">
                    <span class="item-card-title">Education #${index + 1}</span>
                    <button class="btn-remove" data-type="edu" data-id="${item.id}" title="Remove"><i data-lucide="trash-2"></i></button>
                </div>
                <div class="form-group">
                    <label>Degree / Qualification</label>
                    <input type="text" class="edu-input" data-id="${item.id}" data-field="degree" value="${escapeHtml(item.degree)}">
                </div>
                <div class="grid-2" style="margin-top: 8px;">
                    <div class="form-group">
                        <label>School / University</label>
                        <input type="text" class="edu-input" data-id="${item.id}" data-field="school" value="${escapeHtml(item.school)}">
                    </div>
                    <div class="form-group">
                        <label>Dates / Year</label>
                        <input type="text" class="edu-input" data-id="${item.id}" data-field="dates" value="${escapeHtml(item.dates)}">
                    </div>
                </div>
                <div class="form-group" style="margin-top: 8px;">
                    <label>Description / Honors (Optional)</label>
                    <input type="text" class="edu-input" data-id="${item.id}" data-field="description" value="${escapeHtml(item.description)}">
                </div>
            `;
            eduListContainer.appendChild(card);
        });

        // Projects Form Cards
        projListContainer.innerHTML = '';
        resumeState.projects.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'dynamic-item-card';
            card.innerHTML = `
                <div class="item-card-header">
                    <span class="item-card-title">Project #${index + 1}</span>
                    <button class="btn-remove" data-type="proj" data-id="${item.id}" title="Remove"><i data-lucide="trash-2"></i></button>
                </div>
                <div class="form-group">
                    <label>Project Title</label>
                    <input type="text" class="proj-input" data-id="${item.id}" data-field="title" value="${escapeHtml(item.title)}">
                </div>
                <div class="grid-2" style="margin-top: 8px;">
                    <div class="form-group">
                        <label>Subtitle / Role</label>
                        <input type="text" class="proj-input" data-id="${item.id}" data-field="subtitle" value="${escapeHtml(item.subtitle)}">
                    </div>
                    <div class="form-group">
                        <label>Dates</label>
                        <input type="text" class="proj-input" data-id="${item.id}" data-field="dates" value="${escapeHtml(item.dates)}">
                    </div>
                </div>
                <div class="form-group" style="margin-top: 8px;">
                    <label>Description</label>
                    <textarea rows="2" class="proj-input" data-id="${item.id}" data-field="description">${escapeHtml(item.description)}</textarea>
                </div>
            `;
            projListContainer.appendChild(card);
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
        bindDynamicInputs();
    }

    // --- Bind Dynamic Input Event Handlers ---
    function bindDynamicInputs() {
        document.querySelectorAll('.exp-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const id = e.target.dataset.id;
                const field = e.target.dataset.field;
                const item = resumeState.experience.find(i => i.id === id);
                if (item) {
                    item[field] = e.target.value;
                    saveToStorage();
                    renderPreview();
                }
            });
        });

        document.querySelectorAll('.edu-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const id = e.target.dataset.id;
                const field = e.target.dataset.field;
                const item = resumeState.education.find(i => i.id === id);
                if (item) {
                    item[field] = e.target.value;
                    saveToStorage();
                    renderPreview();
                }
            });
        });

        document.querySelectorAll('.proj-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const id = e.target.dataset.id;
                const field = e.target.dataset.field;
                const item = resumeState.projects.find(i => i.id === id);
                if (item) {
                    item[field] = e.target.value;
                    saveToStorage();
                    renderPreview();
                }
            });
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('.btn-remove');
                const type = targetBtn.dataset.type;
                const id = targetBtn.dataset.id;

                if (type === 'exp') {
                    resumeState.experience = resumeState.experience.filter(i => i.id !== id);
                } else if (type === 'edu') {
                    resumeState.education = resumeState.education.filter(i => i.id !== id);
                } else if (type === 'proj') {
                    resumeState.projects = resumeState.projects.filter(i => i.id !== id);
                }

                saveToStorage();
                renderDynamicFormLists();
                renderPreview();
            });
        });
    }

    // --- Bind Top-Level Personal & Summary Inputs ---
    function bindPersonalInputs() {
        const fieldMap = {
            'input-fullName': ['personal', 'fullName'],
            'input-jobTitle': ['personal', 'jobTitle'],
            'input-email': ['personal', 'email'],
            'input-phone': ['personal', 'phone'],
            'input-location': ['personal', 'location'],
            'input-website': ['personal', 'website'],
            'input-linkedin': ['personal', 'linkedin'],
            'input-github': ['personal', 'github']
        };

        Object.keys(fieldMap).forEach(elemId => {
            const elem = document.getElementById(elemId);
            if (elem) {
                elem.addEventListener('input', (e) => {
                    const [cat, sub] = fieldMap[elemId];
                    resumeState[cat][sub] = e.target.value;
                    saveToStorage();
                    renderPreview();
                });
            }
        });

        inputSummary.addEventListener('input', (e) => {
            resumeState.summary = e.target.value;
            saveToStorage();
            renderPreview();
        });

        inputSkills.addEventListener('input', (e) => {
            resumeState.skills = e.target.value;
            saveToStorage();
            renderPreview();
        });

        inputPhoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    resumeState.personal.photo = event.target.result;
                    saveToStorage();
                    syncPhotoPreview();
                    renderPreview();
                    renderWordAvatar(resumeState.personal.photo);
                };
                reader.readAsDataURL(file);
            }
        });

        removePhotoBtn.addEventListener('click', () => {
            resumeState.personal.photo = '';
            inputPhoto.value = '';
            const inputPhotoWord = document.getElementById('input-photo-word');
            if (inputPhotoWord) inputPhotoWord.value = '';
            saveToStorage();
            syncPhotoPreview();
            renderPreview();
            renderWordAvatar('');
        });
    }

    // --- Bind Theme Controls ---
    function bindStyleControls() {
        document.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                updateThemeColor(dot.dataset.color);
                renderPreview();
            });
        });

        fontSelect.addEventListener('change', (e) => {
            updateFont(e.target.value);
            renderPreview();
        });

        templateSelect.addEventListener('change', (e) => {
            resumeState.template = e.target.value;
            saveToStorage();
            renderPreview();
        });

        if (densitySelect) {
            densitySelect.addEventListener('change', (e) => {
                resumeState.density = e.target.value;
                saveToStorage();
                renderPreview();
            });
        }

        // Customize Bottom Sub-Bar Toggle
        const customizeToggleBtn = document.getElementById('customizeToggleBtn');
        const customizeSubBar = document.getElementById('customizeSubBar');

        if (customizeToggleBtn && customizeSubBar) {
            customizeToggleBtn.addEventListener('click', () => {
                customizeSubBar.classList.toggle('is-open');
                customizeToggleBtn.classList.toggle('active');
            });
        }
    }

    // --- Dynamic List Add Buttons ---
    function bindDynamicListButtons() {
        addExpBtn.addEventListener('click', () => {
            resumeState.experience.push({
                id: 'exp-' + Date.now(),
                title: 'New Position',
                company: 'Company Name',
                location: 'City, State',
                dates: '2023 - Present',
                description: '• Key achievement or daily responsibility bullet point.'
            });
            saveToStorage();
            renderDynamicFormLists();
            renderPreview();
        });

        addEduBtn.addEventListener('click', () => {
            resumeState.education.push({
                id: 'edu-' + Date.now(),
                degree: 'Degree / Certificate',
                school: 'Institution Name',
                location: 'City, State',
                dates: '2020 - 2024',
                description: ''
            });
            saveToStorage();
            renderDynamicFormLists();
            renderPreview();
        });

        addProjBtn.addEventListener('click', () => {
            resumeState.projects.push({
                id: 'proj-' + Date.now(),
                title: 'New Project',
                subtitle: 'Key Technology / Role',
                dates: '2024',
                description: 'Project summary and key results.'
            });
            saveToStorage();
            renderDynamicFormLists();
            renderPreview();
        });
    }

    // --- Header Utility Actions ---
    function bindHeaderActions() {
        loadSampleBtn.addEventListener('click', () => {
            if (confirm('Load sample resume data? Current edits will be replaced.')) {
                resumeState = JSON.parse(JSON.stringify(defaultData));
                saveToStorage();
                syncStateToForms();
                renderPreview();
            }
        });

        clearBtn.addEventListener('click', () => {
            if (confirm('Clear all fields to start blank?')) {
                resumeState = {
                    themeColor: '#10b981',
                    font: 'font-inter',
                    personal: {
                        fullName: '',
                        jobTitle: '',
                        email: '',
                        phone: '',
                        location: '',
                        website: '',
                        linkedin: '',
                        github: '',
                        photo: ''
                    },
                    summary: '',
                    experience: [],
                    education: [],
                    skills: '',
                    projects: []
                };
                saveToStorage();
                syncStateToForms();
                renderPreview();
            }
        });

        // --- Download PDF Dropdown & Options Engine ---
        const downloadDropdownWrap = document.getElementById('downloadDropdownWrap');
        const btnDownloadWord = document.getElementById('btnDownloadWord');
        const btnDownloadForm = document.getElementById('btnDownloadForm');
        const btnDownloadBoth = document.getElementById('btnDownloadBoth');

        function triggerCustomPrint(targetMode) {
            document.body.classList.remove('print-target-word', 'print-target-form', 'print-target-both');

            if (targetMode === 'word') {
                document.body.classList.add('print-target-word');
                saveWordCanvasContent();
                updateWordStats();
            } else if (targetMode === 'form') {
                document.body.classList.add('print-target-form');
                renderPreview();
            } else if (targetMode === 'both') {
                document.body.classList.add('print-target-both');
                renderPreview();
                saveWordCanvasContent();
                updateWordStats();
            }

            if (downloadDropdownWrap) {
                downloadDropdownWrap.classList.remove('is-open');
                if (printBtn) printBtn.setAttribute('aria-expanded', 'false');
            }

            const cleanupPrint = () => {
                document.body.classList.remove('print-target-word', 'print-target-form', 'print-target-both');
                window.removeEventListener('afterprint', cleanupPrint);
            };
            window.addEventListener('afterprint', cleanupPrint);

            setTimeout(() => {
                window.print();
                setTimeout(cleanupPrint, 1000);
            }, 60);
        }

        if (printBtn && downloadDropdownWrap) {
            printBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = downloadDropdownWrap.classList.toggle('is-open');
                printBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            document.addEventListener('click', (e) => {
                if (!downloadDropdownWrap.contains(e.target)) {
                    downloadDropdownWrap.classList.remove('is-open');
                    printBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        if (btnDownloadWord) {
            btnDownloadWord.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerCustomPrint('word');
            });
        }

        if (btnDownloadForm) {
            btnDownloadForm.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerCustomPrint('form');
            });
        }

        if (btnDownloadBoth) {
            btnDownloadBoth.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerCustomPrint('both');
            });
        }

        exportJsonBtn.addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeState, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `resume_${(resumeState.personal.fullName || 'draft').toLowerCase().replace(/\s+/g, '_')}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });

        importJsonInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (imported && imported.personal) {
                        resumeState = imported;
                        saveToStorage();
                        syncStateToForms();
                        renderPreview();
                        alert('Resume data imported successfully!');
                    } else {
                        alert('Invalid JSON file format.');
                    }
                } catch (err) {
                    alert('Error parsing JSON file.');
                }
            };
            reader.readAsText(file);
        });
    }

    // --- Helper to get or recreate persistent header DOM nodes ---
    function getHeaderElements() {
        let avatarWrap = document.getElementById('prev-avatar-wrap');
        if (!avatarWrap) {
            avatarWrap = document.createElement('div');
            avatarWrap.className = 'preview-avatar-wrapper';
            avatarWrap.id = 'prev-avatar-wrap';
            avatarWrap.style.display = 'none';
            avatarWrap.innerHTML = `
                <img id="prev-avatar" src="" alt="Profile Photo" class="preview-avatar-img">
                <div class="default-avatar-placeholder" id="default-avatar-icon" style="display:none;">
                    <i data-lucide="user"></i>
                </div>
            `;
        }

        let textBlock = document.getElementById('headerTextBlock');
        if (!textBlock) {
            textBlock = document.createElement('div');
            textBlock.className = 'header-text-block';
            textBlock.id = 'headerTextBlock';
            textBlock.innerHTML = `
                <h1 class="preview-name" id="prev-fullName">Alex Morgan</h1>
                <div class="preview-job-title" id="prev-jobTitle">Senior Software Engineer</div>
            `;
        }

        let headerMainLayout = document.getElementById('headerMainLayout');
        if (!headerMainLayout) {
            headerMainLayout = document.createElement('div');
            headerMainLayout.className = 'header-main-layout';
            headerMainLayout.id = 'headerMainLayout';
        }

        let contactBar = document.getElementById('prev-contactBar');
        if (!contactBar) {
            contactBar = document.createElement('div');
            contactBar.className = 'preview-contact-bar';
            contactBar.id = 'prev-contactBar';
        }

        return { avatarWrap, textBlock, headerMainLayout, contactBar };
    }

    // --- Arrange Layout according to selected Template ---
    function arrangeLayout(template) {
        const paper = document.getElementById('resumePaper');
        const header = document.getElementById('resumeHeader');
        const sidebarZone = document.getElementById('resumeSidebarZone');
        const mainZone = document.getElementById('resumeMainZone');
        const footerTag = document.getElementById('resumeFooterTag');
        const divider = document.getElementById('resumeDivider');

        const { avatarWrap, textBlock, headerMainLayout, contactBar } = getHeaderElements();

        const secSummary = document.getElementById('prev-sec-summary');
        const secExp = document.getElementById('prev-sec-experience');
        const secEdu = document.getElementById('prev-sec-education');
        const secSkills = document.getElementById('prev-sec-skills');
        const secProj = document.getElementById('prev-sec-projects');

        const titleSummary = secSummary.querySelector('.sec-title-text');
        const titleExp = secExp.querySelector('.sec-title-text');
        const titleEdu = secEdu.querySelector('.sec-title-text');
        const titleSkills = secSkills.querySelector('.sec-title-text');
        const titleProj = secProj.querySelector('.sec-title-text');

        footerTag.style.display = 'none';
        divider.style.display = 'block';

        if (template === 'layout-creative-navy') {
            // TWO-COLUMN: Sidebar = Contact → Education → Skills
            titleSummary.textContent = 'PROFILE & ABOUT ME';
            titleExp.textContent = 'PROFESSIONAL CAREER & EXPERIENCE';
            titleEdu.textContent = 'EDUCATION';
            titleSkills.textContent = 'SKILLS & LANGUAGES';
            titleProj.textContent = 'PROJECTS & CERTIFICATIONS';

            header.style.display = 'block';
            header.innerHTML = '';
            header.appendChild(textBlock);

            sidebarZone.innerHTML = '';
            sidebarZone.appendChild(avatarWrap);
            sidebarZone.appendChild(contactBar);
            sidebarZone.appendChild(secEdu);
            sidebarZone.appendChild(secSkills);

            mainZone.innerHTML = '';
            mainZone.appendChild(secSummary);
            mainZone.appendChild(secExp);
            mainZone.appendChild(secProj);

        } else if (template === 'layout-timeline-yellow') {
            // TWO-COLUMN: Sidebar = Avatar → Contact → Education → Skills
            titleSummary.textContent = 'CAREER OBJECTIVE & PROFILE';
            titleSkills.textContent = 'KEY SKILLS & LANGUAGES';
            titleExp.textContent = 'PROFESSIONAL CAREER & EXPERIENCE';
            titleEdu.textContent = 'EDUCATION';
            titleProj.textContent = 'PROJECTS & INTERNSHIPS';

            footerTag.style.display = 'block';
            divider.style.display = 'none';

            header.style.display = 'block';
            header.innerHTML = '';
            header.appendChild(textBlock);

            sidebarZone.innerHTML = '';
            sidebarZone.appendChild(avatarWrap);
            sidebarZone.appendChild(contactBar);
            sidebarZone.appendChild(secEdu);
            sidebarZone.appendChild(secSkills);

            mainZone.innerHTML = '';
            mainZone.appendChild(secSummary);
            mainZone.appendChild(secExp);
            mainZone.appendChild(secProj);

        } else if (template === 'layout-twocol') {
            // TWO-COLUMN: Sidebar = Contact → Education → Skills
            titleSummary.textContent = 'Profile & About Me';
            titleExp.textContent = 'Professional Career & Experience';
            titleEdu.textContent = 'Education';
            titleSkills.textContent = 'Skills & Languages';
            titleProj.textContent = 'Key Projects & Certifications';

            header.style.display = 'block';
            header.innerHTML = '';
            headerMainLayout.innerHTML = '';
            headerMainLayout.appendChild(avatarWrap);
            headerMainLayout.appendChild(textBlock);
            header.appendChild(headerMainLayout);

            sidebarZone.innerHTML = '';
            sidebarZone.appendChild(contactBar);
            sidebarZone.appendChild(secEdu);
            sidebarZone.appendChild(secSkills);

            mainZone.innerHTML = '';
            mainZone.appendChild(secSummary);
            mainZone.appendChild(secExp);
            mainZone.appendChild(secProj);

        } else {
            // SINGLE COLUMN (Modern Clean & Executive Classic)
            // Order: Contact → Education → Experience → Skills → Projects
            titleSummary.textContent = 'Profile & About Me';
            titleExp.textContent = 'Professional Career & Experience';
            titleEdu.textContent = 'Education';
            titleSkills.textContent = 'Skills & Languages';
            titleProj.textContent = 'Key Projects & Certifications';

            header.style.display = 'block';
            header.innerHTML = '';
            headerMainLayout.innerHTML = '';
            headerMainLayout.appendChild(avatarWrap);
            headerMainLayout.appendChild(textBlock);
            header.appendChild(headerMainLayout);
            header.appendChild(contactBar);

            sidebarZone.innerHTML = '';

            mainZone.innerHTML = '';
            mainZone.appendChild(secSummary);
            mainZone.appendChild(secEdu);
            mainZone.appendChild(secExp);
            mainZone.appendChild(secSkills);
            mainZone.appendChild(secProj);
        }
    }

    // --- Render Live Preview Canvas ---
    function renderPreview() {
        const p = resumeState.personal || {};

        const resumePaper = document.getElementById('resumePaper');
        const activeTemplate = resumeState.template || 'layout-modern';
        const activeDensity = resumeState.density || 'density-normal';
        if (resumePaper) {
            resumePaper.className = `resume-paper ${activeTemplate} ${activeDensity}`;
        }

        // Arrange sections according to current template layout
        arrangeLayout(activeTemplate);

        // Personal Header
        document.getElementById('prev-fullName').innerText = p.fullName || 'Your Full Name';
        document.getElementById('prev-jobTitle').innerText = p.jobTitle || 'Your Target Job Title';

        // Avatar Photo / Icon Placeholder
        const currentAvatarWrap = document.getElementById('prev-avatar-wrap');
        const currentAvatar = document.getElementById('prev-avatar');
        const defaultAvatarIcon = document.getElementById('default-avatar-icon');
        if (p.photo && p.photo.trim()) {
            if (currentAvatar) { currentAvatar.src = p.photo; currentAvatar.style.display = 'block'; }
            if (defaultAvatarIcon) defaultAvatarIcon.style.display = 'none';
            if (currentAvatarWrap) currentAvatarWrap.style.display = 'block';
        } else {
            if (currentAvatar) { currentAvatar.src = ''; currentAvatar.style.display = 'none'; }
            if (defaultAvatarIcon) defaultAvatarIcon.style.display = 'flex';
            if (currentAvatarWrap) currentAvatarWrap.style.display = 'block';
        }

        // Contact Info Bar
        toggleContactItem('prev-email-wrap', 'prev-email', p.email);
        toggleContactItem('prev-phone-wrap', 'prev-phone', p.phone);
        toggleContactItem('prev-location-wrap', 'prev-location', p.location);
        toggleContactItem('prev-website-wrap', 'prev-website', p.website);
        toggleContactItem('prev-linkedin-wrap', 'prev-linkedin', p.linkedin);
        toggleContactItem('prev-github-wrap', 'prev-github', p.github);

        // Summary
        const secSummary = document.getElementById('prev-sec-summary');
        const prevSummary = document.getElementById('prev-summary');
        if (resumeState.summary && resumeState.summary.trim()) {
            secSummary.classList.remove('is-hidden');
            prevSummary.innerText = resumeState.summary;
        } else {
            secSummary.classList.add('is-hidden');
        }

        // Experience Section
        const secExperience = document.getElementById('prev-sec-experience');
        const prevExpList = document.getElementById('prev-experience-list');
        prevExpList.innerHTML = '';
        if (resumeState.experience && resumeState.experience.length > 0) {
            secExperience.classList.remove('is-hidden');
            resumeState.experience.forEach(item => {
                const div = document.createElement('div');
                div.className = 'preview-entry';
                div.innerHTML = `
                    <div class="entry-header-row">
                        <div>
                            <div class="entry-title">${escapeHtml(item.title)}</div>
                            <div class="entry-subtitle">${escapeHtml(item.company)}${item.location ? ` — ${escapeHtml(item.location)}` : ''}</div>
                        </div>
                        <div class="entry-date-loc">${escapeHtml(item.dates)}</div>
                    </div>
                    ${item.description ? `<div class="entry-description">${escapeHtml(item.description)}</div>` : ''}
                `;
                prevExpList.appendChild(div);
            });
        } else {
            secExperience.classList.add('is-hidden');
        }

        // Education Section
        const secEdu = document.getElementById('prev-sec-education');
        const prevEduList = document.getElementById('prev-education-list');
        prevEduList.innerHTML = '';
        if (resumeState.education && resumeState.education.length > 0) {
            secEdu.classList.remove('is-hidden');
            resumeState.education.forEach(item => {
                const div = document.createElement('div');
                div.className = 'preview-entry';
                div.innerHTML = `
                    <div class="entry-header-row">
                        <div>
                            <div class="entry-title">${escapeHtml(item.degree)}</div>
                            <div class="entry-subtitle">${escapeHtml(item.school)}${item.location ? ` — ${escapeHtml(item.location)}` : ''}</div>
                        </div>
                        <div class="entry-date-loc">${escapeHtml(item.dates)}</div>
                    </div>
                    ${item.description ? `<div class="entry-description">${escapeHtml(item.description)}</div>` : ''}
                `;
                prevEduList.appendChild(div);
            });
        } else {
            secEdu.classList.add('is-hidden');
        }

        // Skills & Languages Section (Bullet Points Format)
        const secSkills = document.getElementById('prev-sec-skills');
        const prevSkillsContainer = document.getElementById('prev-skills-container');
        prevSkillsContainer.innerHTML = '';
        if (resumeState.skills && resumeState.skills.trim()) {
            secSkills.classList.remove('is-hidden');
            const tags = resumeState.skills.split(',').map(s => s.trim()).filter(Boolean);
            prevSkillsContainer.className = 'skills-bullet-list';

            tags.forEach(tag => {
                // Strip out percentage notation if present for clean bullet point display
                const cleanTag = tag.replace(/\s*\(?\d{1,3}%\)?/g, '').trim();
                if (cleanTag) {
                    const div = document.createElement('div');
                    div.className = 'skill-bullet-item';
                    div.innerHTML = `<span class="bullet-dot">•</span> <span>${escapeHtml(cleanTag)}</span>`;
                    prevSkillsContainer.appendChild(div);
                }
            });
        } else {
            secSkills.classList.add('is-hidden');
        }

        // Projects Section
        const secProj = document.getElementById('prev-sec-projects');
        const prevProjList = document.getElementById('prev-projects-list');
        prevProjList.innerHTML = '';
        if (resumeState.projects && resumeState.projects.length > 0) {
            secProj.classList.remove('is-hidden');
            resumeState.projects.forEach(item => {
                const div = document.createElement('div');
                div.className = 'preview-entry';
                div.innerHTML = `
                    <div class="entry-header-row">
                        <div>
                            <div class="entry-title">${escapeHtml(item.title)}</div>
                            ${item.subtitle ? `<div class="entry-subtitle">${escapeHtml(item.subtitle)}</div>` : ''}
                        </div>
                        ${item.dates ? `<div class="entry-date-loc">${escapeHtml(item.dates)}</div>` : ''}
                    </div>
                    ${item.description ? `<div class="entry-description">${escapeHtml(item.description)}</div>` : ''}
                `;
                prevProjList.appendChild(div);
            });
        } else {
            secProj.classList.add('is-hidden');
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function toggleContactItem(wrapId, textId, value) {
        const wrap = document.getElementById(wrapId);
        const text = document.getElementById(textId);
        if (!wrap || !text) return;

        const val = (value || '').trim();

        if (val) {
            wrap.style.display = 'inline-flex';
            text.style.display = 'inline';

            let displayVal = val;
            if (wrapId === 'prev-website-wrap' || wrapId === 'prev-linkedin-wrap' || wrapId === 'prev-github-wrap') {
                displayVal = val.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
            }
            text.innerText = displayVal;

            let href = '';
            if (wrapId === 'prev-email-wrap') {
                href = `mailto:${val}`;
            } else if (wrapId === 'prev-phone-wrap') {
                href = `tel:${val.replace(/\s+/g, '')}`;
            } else {
                // Website, LinkedIn, GitHub
                href = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`;
            }

            wrap.setAttribute('href', href);
            if (wrapId !== 'prev-email-wrap' && wrapId !== 'prev-phone-wrap') {
                wrap.setAttribute('target', '_blank');
                wrap.setAttribute('rel', 'noopener noreferrer');
            } else {
                wrap.removeAttribute('target');
                wrap.removeAttribute('rel');
            }
        } else {
            wrap.style.display = 'none';
            wrap.removeAttribute('href');
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // --- MS WORD CANVAS EDITOR ENGINE ---
    function initWordEditor() {
        bindModeSwitchers();
        bindWordRibbonActions();
        bindWordCanvasEvents();
        loadWordCanvasContent();

        // Render avatar from saved state
        if (resumeState.personal.photo) {
            renderWordAvatar(resumeState.personal.photo);
        }

        // Default to MS Word Canvas mode
        const btnModeWord = document.getElementById('btnModeWord');
        if (btnModeWord) {
            btnModeWord.click();
        }
    }

    // Render/update avatar at the top of the Word canvas (draggable)
    function renderWordAvatar(dataUrl) {
        const paper = document.getElementById('wordDocumentPaper');
        if (!paper) return;

        let avatarWrap = document.getElementById('wordAvatarWrap');
        if (!avatarWrap) {
            avatarWrap = document.createElement('div');
            avatarWrap.id = 'wordAvatarWrap';
            avatarWrap.setAttribute('contenteditable', 'false');
            paper.appendChild(avatarWrap);

            const savedPos = resumeState.avatarPosition || null;
            if (savedPos && typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
                avatarWrap.style.left = savedPos.x + 'px';
                avatarWrap.style.top = savedPos.y + 'px';
            } else {
                avatarWrap.style.left = '40px';
                avatarWrap.style.top = '40px';
            }

            bindAvatarDrag(avatarWrap, paper);
        } else {
            const savedPos = resumeState.avatarPosition || null;
            if (savedPos && typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
                avatarWrap.style.left = savedPos.x + 'px';
                avatarWrap.style.top = savedPos.y + 'px';
            }
        }

        if (dataUrl) {
            avatarWrap.innerHTML = `<img id="wordAvatar" src="${dataUrl}" alt="Profile Photo" class="word-avatar-img" draggable="false">`;
            avatarWrap.style.display = 'block';
        } else {
            avatarWrap.style.display = 'none';
            avatarWrap.innerHTML = '';
        }
    }

    // Drag-and-drop for avatar using delta-based Pointer + Mouse Events
    function bindAvatarDrag(avatarWrap, paper) {
        let isDragging = false;
        let startClientX = 0;
        let startClientY = 0;
        let startLeft = 0;
        let startTop = 0;

        function getZoomScale() {
            const wordZoomSlider = document.getElementById('wordZoomSlider');
            if (wordZoomSlider) {
                const val = parseFloat(wordZoomSlider.value);
                if (!isNaN(val) && val > 0) return val / 100;
            }
            return 1.0;
        }

        avatarWrap.ondragstart = () => false;
        avatarWrap.onselectstart = () => false;
        avatarWrap.setAttribute('draggable', 'false');

        const onStart = (e) => {
            if (e.button !== 0 && (e.pointerType === 'mouse' || e.type === 'mousedown')) return;
            e.preventDefault();
            e.stopPropagation();

            isDragging = true;
            avatarWrap.classList.add('dragging');

            startClientX = e.clientX;
            startClientY = e.clientY;
            startLeft = parseFloat(avatarWrap.style.left) || 0;
            startTop = parseFloat(avatarWrap.style.top) || 0;

            if (e.pointerId !== undefined && typeof avatarWrap.setPointerCapture === 'function') {
                try {
                    avatarWrap.setPointerCapture(e.pointerId);
                } catch (err) {}
            }

            window.addEventListener('pointermove', onMove, { passive: false });
            window.addEventListener('pointerup', onEnd, { passive: false });
            window.addEventListener('pointercancel', onEnd, { passive: false });
            window.addEventListener('mousemove', onMove, { passive: false });
            window.addEventListener('mouseup', onEnd, { passive: false });
        };

        const onMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const scale = getZoomScale();
            const deltaX = (e.clientX - startClientX) / scale;
            const deltaY = (e.clientY - startClientY) / scale;

            const newX = Math.round(startLeft + deltaX);
            const newY = Math.round(startTop + deltaY);

            avatarWrap.style.left = newX + 'px';
            avatarWrap.style.top = newY + 'px';
        };

        const onEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            avatarWrap.classList.remove('dragging');

            if (e && e.pointerId !== undefined && typeof avatarWrap.releasePointerCapture === 'function') {
                try {
                    avatarWrap.releasePointerCapture(e.pointerId);
                } catch (err) {}
            }

            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onEnd);
            window.removeEventListener('pointercancel', onEnd);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onEnd);

            const finalX = parseInt(avatarWrap.style.left, 10) || 0;
            const finalY = parseInt(avatarWrap.style.top, 10) || 0;
            resumeState.avatarPosition = { x: finalX, y: finalY };
            saveToStorage();
        };

        avatarWrap.addEventListener('pointerdown', onStart);
        avatarWrap.addEventListener('mousedown', onStart);
    }

    function bindModeSwitchers() {
        const btnModeForm = document.getElementById('btnModeForm');
        const btnModeWord = document.getElementById('btnModeWord');
        const appMain = document.querySelector('.app-main');
        const wordSection = document.getElementById('wordEditorSection');

        if (btnModeForm && btnModeWord) {
            btnModeForm.addEventListener('click', () => {
                btnModeForm.classList.add('active');
                btnModeWord.classList.remove('active');
                document.body.classList.remove('mode-word-active');
                if (appMain) appMain.style.display = 'flex';
                if (wordSection) wordSection.style.display = 'none';
            });

            btnModeWord.addEventListener('click', () => {
                btnModeWord.classList.add('active');
                btnModeForm.classList.remove('active');
                document.body.classList.add('mode-word-active');
                if (appMain) appMain.style.display = 'none';
                if (wordSection) wordSection.style.display = 'flex';

                const canvas = document.getElementById('wordDocumentCanvas');
                if (canvas && (!canvas.innerHTML || !canvas.innerHTML.trim())) {
                    convertFormToWordCanvas();
                }
                updateWordStats();
                try {
                    if (window.lucide && typeof window.lucide.createIcons === 'function') {
                        window.lucide.createIcons();
                    }
                } catch (e) {
                    console.warn('Lucide createIcons notice:', e);
                }
            });
        }
    }

    function bindWordRibbonActions() {
        function execCmd(cmd, val = null) {
            document.execCommand(cmd, false, val);
            saveWordCanvasContent();
            updateWordStats();
        }

        const cmdMap = {
            'wordUndoBtn': () => execCmd('undo'),
            'wordRedoBtn': () => execCmd('redo'),
            'wordBoldBtn': () => execCmd('bold'),
            'wordItalicBtn': () => execCmd('italic'),
            'wordUnderlineBtn': () => execCmd('underline'),
            'wordStrikethroughBtn': () => execCmd('strikeThrough'),
            'wordClearFormatBtn': () => execCmd('removeFormat'),
            'wordAlignLeft': () => execCmd('justifyLeft'),
            'wordAlignCenter': () => execCmd('justifyCenter'),
            'wordAlignRight': () => execCmd('justifyRight'),
            'wordAlignJustify': () => execCmd('justifyFull'),
            'wordBulletList': () => execCmd('insertUnorderedList'),
            'wordNumberList': () => execCmd('insertOrderedList')
        };

        Object.keys(cmdMap).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    cmdMap[btnId]();
                });
            }
        });

        const wordFontFamily = document.getElementById('wordFontFamily');
        if (wordFontFamily) {
            wordFontFamily.addEventListener('change', (e) => {
                execCmd('fontName', e.target.value);
            });
        }

        const wordFontSize = document.getElementById('wordFontSize');
        if (wordFontSize) {
            wordFontSize.addEventListener('change', (e) => {
                execCmd('fontSize', e.target.value);
            });
        }

        const wordTextColor = document.getElementById('wordTextColor');
        if (wordTextColor) {
            wordTextColor.addEventListener('input', (e) => {
                execCmd('foreColor', e.target.value);
            });
        }

        const wordBgColor = document.getElementById('wordBgColor');
        if (wordBgColor) {
            wordBgColor.addEventListener('input', (e) => {
                execCmd('hiliteColor', e.target.value);
            });
        }

        const wordInsertTable = document.getElementById('wordInsertTable');
        if (wordInsertTable) {
            wordInsertTable.addEventListener('click', () => {
                const tableHtml = `
                    <table>
                        <thead>
                            <tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Data Cell 1</td><td>Data Cell 2</td><td>Data Cell 3</td></tr>
                            <tr><td>Data Cell 4</td><td>Data Cell 5</td><td>Data Cell 6</td></tr>
                        </tbody>
                    </table><p><br></p>
                `;
                execCmd('insertHTML', tableHtml);
            });
        }

        const wordInsertHr = document.getElementById('wordInsertHr');
        if (wordInsertHr) {
            wordInsertHr.addEventListener('click', () => {
                execCmd('insertHTML', '<hr><p><br></p>');
            });
        }

        const wordInsertBadge = document.getElementById('wordInsertBadge');
        if (wordInsertBadge) {
            wordInsertBadge.addEventListener('click', () => {
                execCmd('insertHTML', '<span class="word-badge">New Skill / Certification</span>&nbsp;');
            });
        }

        const wordSyncFromFormBtn = document.getElementById('wordSyncFromFormBtn');
        if (wordSyncFromFormBtn) {
            wordSyncFromFormBtn.addEventListener('click', () => {
                if (confirm('Import structured Form Builder data into MS Word canvas? Current canvas text will be replaced.')) {
                    convertFormToWordCanvas();
                }
            });
        }

        const wordClearCanvasBtn = document.getElementById('wordClearCanvasBtn');
        if (wordClearCanvasBtn) {
            wordClearCanvasBtn.addEventListener('click', () => {
                if (confirm('Clear the MS Word Document Canvas?')) {
                    const canvas = document.getElementById('wordDocumentCanvas');
                    if (canvas) {
                        canvas.innerHTML = '<h1>Your Name</h1><p>Start typing your resume details here...</p>';
                        saveWordCanvasContent();
                        updateWordStats();
                    }
                }
            });
        }

        const wordZoomSlider = document.getElementById('wordZoomSlider');
        const wordZoomVal = document.getElementById('wordZoomVal');
        const wordPageContainer = document.querySelector('.word-page-container');

        if (wordZoomSlider && wordZoomVal && wordPageContainer) {
            wordZoomSlider.addEventListener('input', (e) => {
                const zoom = e.target.value;
                wordZoomVal.innerText = `${zoom}%`;
                wordPageContainer.style.transform = `scale(${zoom / 100})`;
            });
        }

        // --- Word Ribbon: Photo Upload ---
        const inputPhotoWord = document.getElementById('input-photo-word');
        if (inputPhotoWord) {
            inputPhotoWord.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const dataUrl = event.target.result;
                        // Save to state
                        resumeState.personal.photo = dataUrl;
                        saveToStorage();
                        // Update form-builder photo preview
                        syncPhotoPreview();
                        renderPreview();
                        // Insert/update avatar in Word canvas
                        renderWordAvatar(dataUrl);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    function bindWordCanvasEvents() {
        const canvas = document.getElementById('wordDocumentCanvas');
        if (canvas) {
            canvas.addEventListener('input', () => {
                saveWordCanvasContent();
                updateWordStats();
            });

            canvas.addEventListener('keyup', () => {
                updateWordStats();
            });
        }
    }

    function updateWordStats() {
        const canvas = document.getElementById('wordDocumentCanvas');
        const wordStatusWords = document.getElementById('wordStatusWords');
        const wordStatusChars = document.getElementById('wordStatusChars');

        if (canvas) {
            const text = canvas.innerText || '';
            const words = text.trim().split(/\s+/).filter(Boolean).length;
            const chars = text.length;

            if (wordStatusWords) wordStatusWords.innerText = `${words} words`;
            if (wordStatusChars) wordStatusChars.innerText = `${chars} characters`;
        }
    }

    function saveWordCanvasContent() {
        const canvas = document.getElementById('wordDocumentCanvas');
        if (canvas) {
            try {
                localStorage.setItem('easyresume_word_html', canvas.innerHTML);
            } catch (e) {
                console.error('Word Canvas LocalStorage error:', e);
            }
        }
    }

    function loadWordCanvasContent() {
        const canvas = document.getElementById('wordDocumentCanvas');
        if (!canvas) return;

        try {
            const storedHtml = localStorage.getItem('easyresume_word_html');
            if (storedHtml && storedHtml.trim()) {
                canvas.innerHTML = storedHtml;
            } else {
                convertFormToWordCanvas();
            }
        } catch (e) {
            convertFormToWordCanvas();
        }
        updateWordStats();
    }

    function convertFormToWordCanvas() {
        const canvas = document.getElementById('wordDocumentCanvas');
        if (!canvas) return;

        const p = resumeState.personal || {};
        const summary = resumeState.summary || '';
        const experience = resumeState.experience || [];
        const education = resumeState.education || [];
        const skills = resumeState.skills || '';
        const projects = resumeState.projects || [];

        let html = `<h1>${escapeHtml(p.fullName || 'Your Full Name')}</h1>`;
        html += `<p style="font-weight:600; color:var(--accent-color, #10b981); text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">${escapeHtml(p.jobTitle || 'Target Position Title')}</p>`;

        const contacts = [];
        if (p.email) contacts.push(`📧 ${escapeHtml(p.email)}`);
        if (p.phone) contacts.push(`📞 ${escapeHtml(p.phone)}`);
        if (p.location) contacts.push(`📍 ${escapeHtml(p.location)}`);
        if (p.website) contacts.push(`🌐 ${escapeHtml(p.website)}`);
        if (p.linkedin) contacts.push(`💼 ${escapeHtml(p.linkedin)}`);
        if (p.github) contacts.push(`💻 ${escapeHtml(p.github)}`);

        if (contacts.length > 0) {
            html += `<p style="font-size:0.82rem; color:#475569; margin-bottom:16px;">${contacts.join(' &nbsp;|&nbsp; ')}</p>`;
        }

        html += `<hr>`;

        if (summary.trim()) {
            html += `<h2>Profile Summary</h2>`;
            html += `<p>${escapeHtml(summary)}</p>`;
        }

        if (experience.length > 0) {
            html += `<h2>Professional Experience</h2>`;
            experience.forEach(exp => {
                html += `<h3>${escapeHtml(exp.title)} — <strong>${escapeHtml(exp.company)}</strong> <span style="font-size:0.8rem; font-weight:normal; color:#64748b;">(${escapeHtml(exp.dates)}${exp.location ? ' | ' + escapeHtml(exp.location) : ''})</span></h3>`;
                if (exp.description) {
                    const bullets = exp.description.split('\n').filter(b => b.trim());
                    if (bullets.length > 1) {
                        html += `<ul>`;
                        bullets.forEach(b => {
                            html += `<li>${escapeHtml(b.replace(/^•\s*/, ''))}</li>`;
                        });
                        html += `</ul>`;
                    } else {
                        html += `<p>${escapeHtml(exp.description)}</p>`;
                    }
                }
            });
        }

        if (education.length > 0) {
            html += `<h2>Education</h2>`;
            education.forEach(edu => {
                html += `<h3>${escapeHtml(edu.degree)} — <strong>${escapeHtml(edu.school)}</strong> <span style="font-size:0.8rem; font-weight:normal; color:#64748b;">(${escapeHtml(edu.dates)}${edu.location ? ' | ' + escapeHtml(edu.location) : ''})</span></h3>`;
                if (edu.description) html += `<p>${escapeHtml(edu.description)}</p>`;
            });
        }

        if (skills.trim()) {
            html += `<h2>Skills & Technical Expertise</h2><p>`;
            const skillTags = skills.split(',').map(s => s.trim()).filter(Boolean);
            skillTags.forEach(tag => {
                html += `<span class="word-badge">${escapeHtml(tag)}</span> `;
            });
            html += `</p>`;
        }

        if (projects.length > 0) {
            html += `<h2>Projects & Certifications</h2>`;
            projects.forEach(proj => {
                html += `<h3>${escapeHtml(proj.title)}${proj.subtitle ? ' (' + escapeHtml(proj.subtitle) + ')' : ''} <span style="font-size:0.8rem; font-weight:normal; color:#64748b;">${proj.dates ? '| ' + escapeHtml(proj.dates) : ''}</span></h3>`;
                if (proj.description) html += `<p>${escapeHtml(proj.description)}</p>`;
            });
        }

        canvas.innerHTML = html;
        saveWordCanvasContent();
        updateWordStats();
    }

    // Start App
    init();
});
