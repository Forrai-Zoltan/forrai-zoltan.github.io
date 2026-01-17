document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#works-table tbody");
  const workSection = document.querySelector("#work-section");
  const closeBtn = document.querySelector("#work-close");

  const sTitle = workSection.querySelector("h1");
  const sAuthors = document.querySelector("#s-authors span");
  const sTags = document.querySelector("#s-tags span");
  const sStatus = document.querySelector("#s-status span");
  const sRating = document.querySelector("#s-rating span");
  const sNote = document.querySelector("#s-note");

  let isOpen = false;

  // Initialize left-side drag for resizing
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  workSection.addEventListener("mousedown", e => {
    const rect = workSection.getBoundingClientRect();
    // Allow resizing if mouse is within 10px of left edge
    if (e.clientX - rect.left < 10) {
      isResizing = true;
      startX = e.clientX;
      startWidth = rect.width;
      document.body.style.cursor = "ew-resize";
      e.preventDefault();
    }
  });

  document.addEventListener("mousemove", e => {
    if (!isResizing) return;
    const dx = startX - e.clientX; // left-edge drag
    const newWidth = Math.min(window.innerWidth, Math.max(300, startWidth + dx));
    workSection.style.width = `${newWidth}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = "";
    }
  });

  Promise.all([
    fetch("/SRC/json/works.json").then(res => res.json()),
    fetch("/SRC/json/authors.json").then(res => res.json())
  ])
    .then(([worksData, authorsData]) => {
      const authorMap = {};
      authorsData.authors.forEach(author => {
        authorMap[author.id] = author.name;
      });

      const worksMap = {};
      worksData.works.forEach(work => {
        const slug = slugify(work.title);
        worksMap[slug] = work;

        const tr = document.createElement("tr");

        // Title
        const tdTitle = document.createElement("td");
        const titleLink = document.createElement("a");
        titleLink.textContent = work.title;
        titleLink.href = `#${slug}`;
        titleLink.addEventListener("click", () => {
          renderWork(work);
          openSection();
        });
        tdTitle.appendChild(titleLink);
        tr.appendChild(tdTitle);

        // Authors
        const tdAuthors = document.createElement("td");
        work.authors.forEach((authorId, index) => {
          const authorLink = document.createElement("a");
          authorLink.textContent = authorMap[authorId] || authorId;
          authorLink.href = "#";
          tdAuthors.appendChild(authorLink);

          if (index < work.authors.length - 1) {
            tdAuthors.appendChild(document.createTextNode(", "));
          }
        });
        tr.appendChild(tdAuthors);

        // Tags
        const tdTags = document.createElement("td");
        tdTags.textContent = work.tags || "";
        tr.appendChild(tdTags);

        // Status
        const tdStatus = document.createElement("td");
        tdStatus.textContent = work.status;
        tr.appendChild(tdStatus);

        // Rating
        const tdRating = document.createElement("td");
        tdRating.textContent = work.rating !== null ? work.rating : "";
        tr.appendChild(tdRating);

        tableBody.appendChild(tr);
      });

      function renderWork(work) {
        sTitle.textContent = work.title;
        sAuthors.textContent = work.authors.map(id => authorMap[id] || id).join(", ");
        sTags.textContent = work.tags || "";
        sStatus.textContent = work.status || "";
        sRating.textContent = work.rating !== null ? work.rating : "";
        sNote.innerHTML = work.notes || "";
      }

      function openSection() {
        if (isOpen) return;
        workSection.classList.add("is-open");
        isOpen = true;
      }

      function closeSection() {
        // Move section offscreen first
        workSection.classList.remove("is-open");

        // Wait for the CSS transition to finish before clearing
        workSection.addEventListener("transitionend", function handleTransition() {
          clearSection();
          isOpen = false;
          history.replaceState(null, "", window.location.pathname);
          workSection.removeEventListener("transitionend", handleTransition);
        });
      }

      function clearSection() {
        sTitle.textContent = "";
        sAuthors.textContent = "";
        sTags.textContent = "";
        sStatus.textContent = "";
        sRating.textContent = "";
        sNote.innerHTML = "";
      }

      closeBtn.addEventListener("click", closeSection);

      function slugify(text) {
        return text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      const hash = window.location.hash.slice(1);
      if (hash && worksMap[hash]) {
        renderWork(worksMap[hash]);
        openSection();
      }
    })
    .catch(err => {
      console.error("Failed to load library data:", err);
    });
});