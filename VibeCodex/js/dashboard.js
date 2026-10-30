/* =========================================
   VIBECODEX — PROJECT DASHBOARD
   File: js/dashboard.js
   ========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. HTML ELEMENTS
       ===================================== */

    const projectFormPanel = document.getElementById("projectFormPanel");
    const projectForm = document.getElementById("projectForm");

    const openFormButton = document.getElementById("openFormButton");
    const emptyAddButton = document.getElementById("emptyAddButton");
    const cancelFormButton = document.getElementById("cancelFormButton");
    const cancelProjectButton = document.getElementById("cancelProjectButton");

    const projectIdInput = document.getElementById("projectId");
    const projectNameInput = document.getElementById("projectName");
    const projectCategoryInput = document.getElementById("projectCategory");
    const projectUrlInput = document.getElementById("projectUrl");
    const projectImageInput = document.getElementById("projectImage");
    const projectDescriptionInput = document.getElementById("projectDescription");

    const projectGrid = document.getElementById("projectGrid");
    const emptyState = document.getElementById("emptyState");
    const noResults = document.getElementById("noResults");

    const searchProjectsInput = document.getElementById("searchProjects");
    const filterCategoryInput = document.getElementById("filterCategory");

    const totalProjectsElement = document.getElementById("totalProjects");
    const totalCategoriesElement = document.getElementById("totalCategories");
    const linkedProjectsElement = document.getElementById("linkedProjects");
    const currentYearElement = document.getElementById("currentYear");


    /* =====================================
       2. SETTINGS AND STORAGE
       ===================================== */

    const STORAGE_KEY = "vibecodex_projects_v1";

    const DEFAULT_IMAGE = "../assets/images/project-placeholder.jpg";

    const allowedCategories = [
        "Web Development",
        "UI/UX Design",
        "System Design",
        "Database Design",
        "Documentation",
        "Other"
    ];

    let projects = loadProjects();


    /* =====================================
       3. LOAD AND SAVE PROJECTS
       ===================================== */

    function loadProjects() {
        try {
            const savedProjects = localStorage.getItem(STORAGE_KEY);

            if (!savedProjects) {
                return [];
            }

            const parsedProjects = JSON.parse(savedProjects);

            if (!Array.isArray(parsedProjects)) {
                return [];
            }

            // Keep only valid project records.
            return parsedProjects.filter(function (project) {
                return (
                    project &&
                    typeof project.id === "string" &&
                    typeof project.name === "string" &&
                    typeof project.category === "string"
                );
            });

        } catch (error) {
            console.error("Could not load VibeCodex projects:", error);
            return [];
        }
    }

    function saveProjects() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
            return true;

        } catch (error) {
            console.error("Could not save VibeCodex projects:", error);

            alert(
                "Your projects could not be saved. " +
                "Your browser storage may be full or unavailable."
            );

            return false;
        }
    }


    /* =====================================
       4. HELPER FUNCTIONS
       ===================================== */

    function createId() {
        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {
            return window.crypto.randomUUID();
        }

        return Date.now().toString(36) +
            Math.random().toString(36).slice(2);
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }

    function safeExternalUrl(value) {
        const trimmedValue = String(value || "").trim();

        if (!trimmedValue) {
            return "";
        }

        try {
            const url = new URL(trimmedValue);

            if (url.protocol === "https:" || url.protocol === "http:") {
                return url.href;
            }

        } catch (error) {
            // Invalid URLs are not displayed as clickable links.
        }

        return "";
    }

    function safeImageUrl(value) {
        const trimmedValue = String(value || "").trim();

        if (!trimmedValue) {
            return "";
        }

        // Allow web images and relative paths to local project assets.
        if (
            trimmedValue.startsWith("../assets/") ||
            trimmedValue.startsWith("./assets/")
        ) {
            return trimmedValue;
        }

        try {
            const url = new URL(trimmedValue, window.location.href);

            if (
                url.protocol === "https:" ||
                url.protocol === "http:"
            ) {
                return url.href;
            }

        } catch (error) {
            // Invalid image URLs are ignored.
        }

        return "";
    }

    function getCategoryClass(category) {
        return category
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    function formatDate(dateValue) {
        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Recently added";
        }

        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }


    /* =====================================
       5. OPEN AND CLOSE THE PROJECT FORM
       ===================================== */

    function openProjectForm(project) {
        if (!projectFormPanel || !projectForm) {
            return;
        }

        projectForm.reset();
        projectIdInput.value = "";

        const formTitle = projectFormPanel.querySelector("h2");
        const submitButton = document.getElementById("saveProjectButton");

        if (project) {
            projectIdInput.value = project.id;
            projectNameInput.value = project.name;
            projectCategoryInput.value = project.category;
            projectUrlInput.value = project.url || "";
            projectImageInput.value = project.image || "";
            projectDescriptionInput.value = project.description || "";

            if (formTitle) {
                formTitle.textContent = "Edit Project";
            }

            if (submitButton) {
                submitButton.textContent = "Save Changes";
            }

        } else {
            if (formTitle) {
                formTitle.textContent = "Add New Project";
            }

            if (submitButton) {
                submitButton.textContent = "Save Project";
            }
        }

        projectFormPanel.hidden = false;

        projectFormPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        projectNameInput.focus();
    }

    function closeProjectForm() {
        if (!projectFormPanel || !projectForm) {
            return;
        }

        projectForm.reset();
        projectIdInput.value = "";
        projectFormPanel.hidden = true;

        const formTitle = projectFormPanel.querySelector("h2");
        const submitButton = document.getElementById("saveProjectButton");

        if (formTitle) {
            formTitle.textContent = "Add New Project";
        }

        if (submitButton) {
            submitButton.textContent = "Save Project";
        }
    }

    if (openFormButton) {
        openFormButton.addEventListener("click", function () {
            openProjectForm();
        });
    }

    if (emptyAddButton) {
        emptyAddButton.addEventListener("click", function () {
            openProjectForm();
        });
    }

    if (cancelFormButton) {
        cancelFormButton.addEventListener("click", closeProjectForm);
    }

    if (cancelProjectButton) {
        cancelProjectButton.addEventListener("click", closeProjectForm);
    }


    /* =====================================
       6. VALIDATE AND SAVE A PROJECT
       ===================================== */

    if (projectForm) {
        projectForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = projectNameInput.value.trim();
            const category = projectCategoryInput.value;
            const rawUrl = projectUrlInput.value.trim();
            const rawImage = projectImageInput.value.trim();
            const description = projectDescriptionInput.value.trim();

            if (!name) {
                alert("Please enter a project name.");
                projectNameInput.focus();
                return;
            }

            if (!allowedCategories.includes(category)) {
                alert("Please choose a valid project category.");
                projectCategoryInput.focus();
                return;
            }

            if (rawUrl && !safeExternalUrl(rawUrl)) {
                alert("Please enter a valid project URL starting with http:// or https://.");
                projectUrlInput.focus();
                return;
            }

            if (rawImage && !safeImageUrl(rawImage)) {
                alert(
                    "Please enter a valid image URL or a relative path " +
                    "inside the assets folder."
                );
                projectImageInput.focus();
                return;
            }

            const editingId = projectIdInput.value;
            const existingIndex = projects.findIndex(function (project) {
                return project.id === editingId;
            });

            const existingProject = existingIndex >= 0
                ? projects[existingIndex]
                : null;

            const projectData = {
                id: existingProject ? existingProject.id : createId(),
                name: name,
                category: category,
                url: rawUrl ? safeExternalUrl(rawUrl) : "",
                image: rawImage ? safeImageUrl(rawImage) : "",
                description: description,
                createdAt: existingProject
                    ? existingProject.createdAt
                    : new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            let previousProjects = projects.slice();

            if (existingIndex >= 0) {
                projects[existingIndex] = projectData;
            } else {
                projects.unshift(projectData);
            }

            if (!saveProjects()) {
                projects = previousProjects;
                return;
            }

            closeProjectForm();
            renderProjects();

            alert(
                existingIndex >= 0
                    ? "Project updated successfully!"
                    : "Project added successfully!"
            );
        });
    }


    /* =====================================
       7. EDIT A PROJECT
       ===================================== */

    function editProject(projectId) {
        const project = projects.find(function (item) {
            return item.id === projectId;
        });

        if (project) {
            openProjectForm(project);
        }
    }


    /* =====================================
       8. DELETE A PROJECT
       ===================================== */

    function deleteProject(projectId) {
        const project = projects.find(function (item) {
            return item.id === projectId;
        });

        if (!project) {
            return;
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete "' +
            project.name +
            '"? This action cannot be undone.'
        );

        if (!confirmed) {
            return;
        }

        const previousProjects = projects.slice();

        projects = projects.filter(function (item) {
            return item.id !== projectId;
        });

        if (!saveProjects()) {
            projects = previousProjects;
            return;
        }

        renderProjects();
    }


    /* =====================================
       9. CREATE A PROJECT CARD
       ===================================== */

    function createProjectCard(project) {
        const card = document.createElement("article");

        card.className = "project-card dashboard-project-card";

        const categoryClass = getCategoryClass(project.category);
        const category = escapeHTML(project.category);
        const name = escapeHTML(project.name);
        const description = escapeHTML(
            project.description || "No description has been added yet."
        );
        const date = escapeHTML(formatDate(project.createdAt));

        const imageUrl = safeImageUrl(project.image);
        const projectUrl = safeExternalUrl(project.url);

        const imageMarkup = imageUrl
            ? '<img class="project-image" src="' +
                escapeHTML(imageUrl) +
                '" alt="' +
                name +
                '" loading="lazy">'
            : '<div class="project-image project-image-placeholder" aria-hidden="true">' +
                '<span>{ }</span>' +
                '</div>';

        const viewMarkup = projectUrl
            ? '<a class="btn btn-secondary project-view-link" href="' +
                escapeHTML(projectUrl) +
                '" target="_blank" rel="noopener noreferrer">View Project ↗</a>'
            : '<span class="project-no-link">No project link</span>';

        card.innerHTML =
            '<div class="project-card-image">' +
                imageMarkup +
            '</div>' +

            '<div class="project-card-content">' +
                '<span class="project-category ' +
                    escapeHTML(categoryClass) +
                '">' +
                    category +
                '</span>' +

                '<h3 class="project-title">' +
                    name +
                '</h3>' +

                '<p class="project-description">' +
                    description +
                '</p>' +

                '<p class="project-date">Added ' +
                    date +
                '</p>' +

                '<div class="project-card-actions">' +
                    viewMarkup +
                    '<button type="button" class="btn btn-secondary edit-project-button">Edit</button>' +
                    '<button type="button" class="btn btn-danger delete-project-button">Delete</button>' +
                '</div>' +
            '</div>';

        const editButton = card.querySelector(".edit-project-button");
        const deleteButton = card.querySelector(".delete-project-button");

        editButton.addEventListener("click", function () {
            editProject(project.id);
        });

        deleteButton.addEventListener("click", function () {
            deleteProject(project.id);
        });

        const image = card.querySelector("img");

        if (image) {
            image.addEventListener("error", function () {
                const placeholder = document.createElement("div");

                placeholder.className =
                    "project-image project-image-placeholder";

                placeholder.setAttribute("aria-hidden", "true");
                placeholder.textContent = "{ }";

                image.replaceWith(placeholder);
            }, { once: true });
        }

        return card;
    }


    /* =====================================
       10. SEARCH AND CATEGORY FILTER
       ===================================== */

    function getFilteredProjects() {
        const searchTerm = searchProjectsInput
            ? searchProjectsInput.value.trim().toLowerCase()
            : "";

        const selectedCategory = filterCategoryInput
            ? filterCategoryInput.value
            : "all";

        return projects.filter(function (project) {
            const matchesSearch =
                project.name.toLowerCase().includes(searchTerm) ||
                (project.description || "").toLowerCase().includes(searchTerm) ||
                project.category.toLowerCase().includes(searchTerm);

            const matchesCategory =
                selectedCategory === "all" ||
                project.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }

    if (searchProjectsInput) {
        searchProjectsInput.addEventListener("input", renderProjects);
    }

    if (filterCategoryInput) {
        filterCategoryInput.addEventListener("change", renderProjects);
    }


    /* =====================================
       11. UPDATE DASHBOARD STATISTICS
       ===================================== */

    function updateStatistics() {
        if (totalProjectsElement) {
            totalProjectsElement.textContent = projects.length;
        }

        if (totalCategoriesElement) {
            const categories = new Set(
                projects.map(function (project) {
                    return project.category;
                })
            );

            totalCategoriesElement.textContent = categories.size;
        }

        if (linkedProjectsElement) {
            const linkedCount = projects.filter(function (project) {
                return Boolean(safeExternalUrl(project.url));
            }).length;

            linkedProjectsElement.textContent = linkedCount;
        }
    }


    /* =====================================
       12. RENDER THE PROJECT GRID
       ===================================== */

    function renderProjects() {
        if (!projectGrid) {
            return;
        }

        const filteredProjects = getFilteredProjects();

        projectGrid.replaceChildren();

        filteredProjects.forEach(function (project) {
            projectGrid.appendChild(createProjectCard(project));
        });

        const hasProjects = projects.length > 0;
        const hasFilteredProjects = filteredProjects.length > 0;

        if (emptyState) {
            emptyState.hidden = hasProjects;
        }

        if (noResults) {
            noResults.hidden = !hasProjects || hasFilteredProjects;
        }

        projectGrid.hidden = !hasFilteredProjects;

        updateStatistics();
    }


    /* =====================================
       13. FOOTER YEAR
       ===================================== */

    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }


    /* =====================================
       14. INITIALIZE DASHBOARD
       ===================================== */

    if (projectFormPanel) {
        projectFormPanel.hidden = true;
    }

    renderProjects();

});
l