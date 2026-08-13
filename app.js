/**
 * EasyResume - Simple, Fast, Real-Time Resume Builder Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Initial State Definition ---
    const defaultData = {
        template: 'layout-modern',
        themeColor: '#3b82f6',
        font: 'font-inter',
        personal: {
            fullName: 'Alok',
            jobTitle: 'Senior Full Stack Engineer',
            email: 'abcd@example.com',
            phone: '+91 1234567890',
            location: 'Lucknow',
            website: 'xyz.dev',
            linkedin: 'linkedin.com/in/abcd',
            github: 'github.com/abcd',
            photo: ''
        },
        summary: 'Passionate and results-driven Senior Full Stack Engineer with 6+ years of experience crafting high-performance web applications, scalable backend APIs, and intuitive user experiences. Proven track record in leading engineering teams, optimizing site speed, and driving cloud architecture modernization.',
        experience: [
            {
                id: 'exp-1',
                title: 'Senior Software Engineer',
                company: 'Apex Cloud Technologies',
                location: 'lucknow',
                dates: '2025 - Present',
                description: '• Architected and deployed microservices using Node.js, React, and GraphQL handling 5M+ daily requests.\n• Reduced page load times by 42% across core application dashboards through dynamic code-splitting and asset optimization.\n• Mentored a team of 5 junior engineers and established automated CI/CD deployment pipelines.'
            },
            {
                id: 'exp-2',
                title: 'Software Engineer',
                company: 'Vanguard Digital Solutions',
                location: 'mumbai',
                dates: '2019 - 2025',
                description: '• Developed responsive client web apps using React, TypeScript, and Tailwind CSS.\n• Integrated Stripe payment solutions, increasing checkout conversion by 15%.\n• Designed and maintained relational Postgres database schemas with zero-downtime migrations.'
            }
        ],
        education: [
            {
                id: 'edu-1',
                degree: 'B.Tech. in Computer Science',
                school: 'IIT Dholakpur',
                location: 'Dholakpur',
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
                };
                reader.readAsDataURL(file);
            }
        });

        removePhotoBtn.addEventListener('click', () => {
            resumeState.personal.photo = '';
            inputPhoto.value = '';
            saveToStorage();
            syncPhotoPreview();
            renderPreview();
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
                    themeColor: '#3b82f6',
                    font: 'font-inter',
                    personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '' },
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

        printBtn.addEventListener('click', () => {
            window.print();
        });

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

    // --- Arrange Layout according to selected Template ---
    function arrangeLayout(template) {
        const paper = document.getElementById('resumePaper');
        const header = document.getElementById('resumeHeader');
        const sidebarZone = document.getElementById('resumeSidebarZone');
        const mainZone = document.getElementById('resumeMainZone');
        const contactBar = document.getElementById('prev-contactBar');
        const avatarWrap = document.getElementById('prev-avatar-wrap');
        const textBlock = document.getElementById('headerTextBlock');
        const headerMainLayout = document.getElementById('headerMainLayout');
        const footerTag = document.getElementById('resumeFooterTag');
        const divider = document.getElementById('resumeDivider');

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
            titleSummary.textContent = 'ABOUT ME';
            titleExp.textContent = 'EXPERIENCE';
            titleEdu.textContent = 'EDUCATION';
            titleSkills.textContent = 'EXPERTISE';
            titleProj.textContent = 'PROJECTS & CERTIFICATIONS';

            header.style.display = 'block';
            header.innerHTML = '';
            header.appendChild(textBlock);

            sidebarZone.innerHTML = '';
            sidebarZone.appendChild(avatarWrap);
            sidebarZone.appendChild(secSummary);
            sidebarZone.appendChild(contactBar);
            sidebarZone.appendChild(secSkills);

            mainZone.innerHTML = '';
            mainZone.appendChild(secExp);
            mainZone.appendChild(secEdu);
            mainZone.appendChild(secProj);

        } else if (template === 'layout-timeline-yellow') {
            titleSummary.textContent = 'CAREER OBJECTIVE';
            titleSkills.textContent = 'KEY SKILLS';
            titleExp.textContent = 'EXPERIENCE (SKIP IF FRESHER)';
            titleEdu.textContent = 'EDUCATION';
            titleProj.textContent = 'PROJECTS / INTERNSHIPS (FOR FRESHERS)';

            footerTag.style.display = 'block';
            divider.style.display = 'none';

            header.style.display = 'block';
            header.innerHTML = '';
            header.appendChild(textBlock);

            sidebarZone.innerHTML = '';
            sidebarZone.appendChild(avatarWrap);
            
            let sidebarContactHead = sidebarZone.querySelector('.sidebar-sec-title');
            if (!sidebarContactHead) {
                sidebarContactHead = document.createElement('div');
                sidebarContactHead.className = 'sidebar-sec-title';
                sidebarContactHead.textContent = 'CONTACT';
            }
            sidebarZone.appendChild(sidebarContactHead);
            sidebarZone.appendChild(contactBar);
            sidebarZone.appendChild(secProj);

            mainZone.innerHTML = '';
            mainZone.appendChild(secSummary);
            mainZone.appendChild(secSkills);
            mainZone.appendChild(secExp);
            mainZone.appendChild(secEdu);

        } else if (template === 'layout-twocol') {
            titleSummary.textContent = 'Profile Summary';
            titleExp.textContent = 'Work Experience';
            titleEdu.textContent = 'Education';
            titleSkills.textContent = 'Skills & Expertise';
            titleProj.textContent = 'Key Projects & Certifications';

            header.style.display = 'block';
            header.innerHTML = '';
            headerMainLayout.innerHTML = '';
            headerMainLayout.appendChild(avatarWrap);
            headerMainLayout.appendChild(textBlock);
            header.appendChild(headerMainLayout);
            header.appendChild(contactBar);

            sidebarZone.innerHTML = '';
            sidebarZone.appendChild(secSkills);

            mainZone.innerHTML = '';
            mainZone.appendChild(secSummary);
            mainZone.appendChild(secExp);
            mainZone.appendChild(secEdu);
            mainZone.appendChild(secProj);

        } else {
            // Modern Clean & Executive Classic (Single Column)
            titleSummary.textContent = 'Profile Summary';
            titleExp.textContent = 'Work Experience';
            titleEdu.textContent = 'Education';
            titleSkills.textContent = 'Skills & Technical Expertise';
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
            mainZone.appendChild(secExp);
            mainZone.appendChild(secEdu);
            mainZone.appendChild(secSkills);
            mainZone.appendChild(secProj);
        }
    }

    // --- Render Live Preview Canvas ---
    function renderPreview() {
        const p = resumeState.personal || {};

        const resumePaper = document.getElementById('resumePaper');
        const activeTemplate = resumeState.template || 'layout-modern';
        if (resumePaper) {
            resumePaper.className = `resume-paper ${activeTemplate}`;
        }

        // Arrange sections according to current template layout
        arrangeLayout(activeTemplate);

        // Personal Header
        document.getElementById('prev-fullName').innerText = p.fullName || 'Your Full Name';
        document.getElementById('prev-jobTitle').innerText = p.jobTitle || 'Your Target Job Title';

        // Avatar Photo / Icon Placeholder
        const defaultAvatarIcon = document.getElementById('default-avatar-icon');
        if (p.photo && p.photo.trim()) {
            prevAvatar.src = p.photo;
            prevAvatar.style.display = 'block';
            if (defaultAvatarIcon) defaultAvatarIcon.style.display = 'none';
            prevAvatarWrap.style.display = 'block';
        } else if (activeTemplate === 'layout-creative-navy' || activeTemplate === 'layout-timeline-yellow') {
            prevAvatar.src = '';
            prevAvatar.style.display = 'none';
            if (defaultAvatarIcon) defaultAvatarIcon.style.display = 'flex';
            prevAvatarWrap.style.display = 'block';
        } else {
            prevAvatar.src = '';
            prevAvatar.style.display = 'none';
            if (defaultAvatarIcon) defaultAvatarIcon.style.display = 'none';
            prevAvatarWrap.style.display = 'none';
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

        // Skills Section
        const secSkills = document.getElementById('prev-sec-skills');
        const prevSkillsContainer = document.getElementById('prev-skills-container');
        prevSkillsContainer.innerHTML = '';
        if (resumeState.skills && resumeState.skills.trim()) {
            secSkills.classList.remove('is-hidden');
            const tags = resumeState.skills.split(',').map(s => s.trim()).filter(Boolean);

            if (activeTemplate === 'layout-creative-navy') {
                prevSkillsContainer.className = 'skills-progress-list';
                const pcts = [88, 81, 90, 78, 85, 92, 75, 80];
                tags.forEach((tag, idx) => {
                    const pct = pcts[idx % pcts.length];
                    const div = document.createElement('div');
                    div.className = 'skill-progress-item';
                    div.innerHTML = `
                        <div class="skill-progress-head">
                            <span>${escapeHtml(tag)}</span>
                            <span class="skill-pct-val">${pct}%</span>
                        </div>
                        <div class="skill-progress-track">
                            <div class="skill-progress-fill" style="width: ${pct}%;"></div>
                        </div>
                    `;
                    prevSkillsContainer.appendChild(div);
                });
            } else {
                prevSkillsContainer.className = 'skills-tags-cloud';
                tags.forEach(tag => {
                    const chip = document.createElement('span');
                    chip.className = 'skill-chip';
                    chip.innerText = tag;
                    prevSkillsContainer.appendChild(chip);
                });
            }
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

    // --- Helper Functions ---
    function toggleContactItem(wrapId, textId, value) {
        const wrap = document.getElementById(wrapId);
        const text = document.getElementById(textId);
        if (value && value.trim()) {
            wrap.style.display = 'inline-flex';
            text.innerText = value;
        } else {
            wrap.style.display = 'none';
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

    // Start App
    init();
});
