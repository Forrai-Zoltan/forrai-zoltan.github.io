document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#works-table tbody");
  const workSection = document.querySelector("#work-section");
  const authorSection = document.querySelector("#author-section");
  const closeBtn = document.querySelector("#work-close");

  const sTitle = workSection.querySelector("h1");
  const sAuthors = document.querySelector("#s-authors span");
  const sTags = document.querySelector("#s-tags span");
  const sStatus = document.querySelector("#s-status span");
  const sRating = document.querySelector("#s-rating span");
  const sNote = document.querySelector("#s-note");

  let workOpen = false;
  let authorOpen = false;

  // Initialize left-side drag for resizing
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  let resizingSection = null;

  function startResize(e, section) {
    isResizing = true;
    startX = e.clientX;
    startWidth = section.getBoundingClientRect().width;
    resizingSection = section;
    document.body.style.cursor = "ew-resize";
    e.preventDefault();
  }

  [workSection, authorSection].forEach(section => {
    section.addEventListener("mousedown", e => {
      const rect = section.getBoundingClientRect();
      if (e.clientX - rect.left < 10) {
        startResize(e, section);
      }
    });
  });

  document.addEventListener("mousemove", e => {
    if (!isResizing || !resizingSection) return;
    const dx = startX - e.clientX; // left-edge drag
    const newWidth = Math.min(window.innerWidth, Math.max(300, startWidth + dx));
    resizingSection.style.width = `${newWidth}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      resizingSection = null;
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

      const authorSlugMap = {};
      function getAuthorSlug(author) {
        return slugify(author.name);
      }

      const worksMap = {};
      worksData.works.forEach(work => {
        const slug = slugify(work.title);
        worksMap[slug] = work;

        const tr = document.createElement("tr");
        if (work.status && work.status.toLowerCase() === "read") {
          tr.classList.add("is-read");
        }

        // Title
        const tdTitle = document.createElement("td");
        const titleLink = document.createElement("a");
        titleLink.textContent = work.title;
        titleLink.href = `#${slug}`;
        titleLink.addEventListener("click", () => {
          // Remove highlight from any previously highlighted row
          const prevHighlighted = tableBody.querySelector("tr.highlighted");
          if (prevHighlighted) prevHighlighted.classList.remove("highlighted");

          // Highlight the clicked row
          tr.classList.add("highlighted");

          renderWork(work);
          openWorkSection();
        });
        tdTitle.appendChild(titleLink);
        tr.appendChild(tdTitle);

        // Authors
        const tdAuthors = document.createElement("td");
        work.authors.forEach((authorId, index) => {
          const authorLink = document.createElement("a");
          authorLink.textContent = authorMap[authorId] || authorId;
          const slug = getAuthorSlug({id: authorId, name: authorMap[authorId] || authorId});
          authorLink.href = `#${slug}`;
          authorLink.addEventListener("click", () => {
            // Remove highlight from any previously highlighted row
            const prevHighlighted = tableBody.querySelector("tr.highlighted");
            if (prevHighlighted) prevHighlighted.classList.remove("highlighted");
            tr.classList.add("highlighted");

            // Open the author section
            openAuthorSection();

            // Set author info
            const authorSection = document.querySelector("#author-section");
            const authorName = authorMap[authorId] || authorId;
            authorSection.querySelector("h1").textContent = authorName;

            // Find author details in authorsData
            const authorData = authorsData.authors.find(a => a.id === authorId);
            authorSection.querySelector("#s-bio").innerHTML = authorData ? authorData.bio || "" : "";

            // Populate author table with works by this author
            const authorTableBody = authorSection.querySelector("table tbody") || (() => {
              const tbody = document.createElement("tbody");
              authorSection.querySelector("table").appendChild(tbody);
              return tbody;
            })();
            authorTableBody.innerHTML = "";

            worksData.works.filter(work => work.authors.includes(authorId)).forEach(work => {
              const row = document.createElement("tr");
              if (work.status && work.status.toLowerCase() === "read") {
                row.classList.add("is-read");
              }

              const tdTitle = document.createElement("td");
              const titleLink = document.createElement("a");
              titleLink.textContent = work.title;
              titleLink.href = "#";
              titleLink.addEventListener("click", () => {
                // Remove highlight from main table
                const prev = tableBody.querySelector("tr.highlighted");
                if (prev) prev.classList.remove("highlighted");

                // Highlight corresponding main table row
                const mainRow = Array.from(tableBody.querySelectorAll("tr"))
                  .find(r => r.querySelector("td:first-child").textContent === work.title);
                if (mainRow) mainRow.classList.add("highlighted");

                // Update URL hash
                const workSlug = slugify(work.title);
                history.replaceState(null, "", "#" + workSlug);

                renderWork(work);
                openWorkSection();
              });
              tdTitle.appendChild(titleLink);
              row.appendChild(tdTitle);

              const tdTags = document.createElement("td");
              tdTags.textContent = work.tags || "";
              row.appendChild(tdTags);

              const tdStatus = document.createElement("td");
              tdStatus.textContent = work.status || "";
              row.appendChild(tdStatus);

              const tdRating = document.createElement("td");
              tdRating.textContent = work.rating !== null ? work.rating : "";
              row.appendChild(tdRating);

              authorTableBody.appendChild(row);
            });

            // Add three-state sorting to the author table (after populating all rows)
            const authorTable = authorSection.querySelector("table");
            const authorHeaders = authorTable.querySelectorAll("thead th");
            const originalAuthorRows = Array.from(authorTable.querySelectorAll("tbody tr"));
            let currentAuthorSort = { column: null, direction: null };

            authorHeaders.forEach((th, index) => {
              th.style.cursor = "pointer";
              th.addEventListener("click", () => {
                const column = index;
                let direction;
                if (currentAuthorSort.column !== column) {
                  direction = "asc";
                } else if (currentAuthorSort.direction === "asc") {
                  direction = "desc";
                } else if (currentAuthorSort.direction === "desc") {
                  direction = null;
                } else {
                  direction = "asc";
                }
                currentAuthorSort = { column, direction };

                // Remove previous indicators
                authorHeaders.forEach(h => {
                  const existing = h.querySelector(".sort-indicator");
                  if (existing) existing.remove();
                });

                // Add indicator for current sort
                if (direction) {
                  const indicator = document.createElement("span");
                  indicator.className = "sort-indicator";
                  indicator.style.fontSize = "0.7em";
                  indicator.style.marginLeft = "4px";
                  indicator.textContent = direction === "asc" ? "▲" : "▼";
                  th.appendChild(indicator);
                }

                // Sort rows
                let rowsToDisplay;
                if (!direction) {
                  rowsToDisplay = originalAuthorRows;
                } else {
                  rowsToDisplay = Array.from(authorTable.querySelectorAll("tbody tr")).sort((a, b) => {
                    let aText = a.children[column].textContent.trim();
                    let bText = b.children[column].textContent.trim();
                    if (th.id === "as-rating") {
                      aText = parseFloat(aText) || 0;
                      bText = parseFloat(bText) || 0;
                    }
                    return direction === "asc" ? (aText < bText ? -1 : aText > bText ? 1 : 0)
                                               : (aText > bText ? -1 : aText < bText ? 1 : 0);
                  });
                }

                const tbody = authorTable.querySelector("tbody");
                tbody.innerHTML = "";
                rowsToDisplay.forEach(row => tbody.appendChild(row));
              });
            });
          });
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

      // Keep original row order
      const originalRows = Array.from(tableBody.querySelectorAll("tr"));

      let currentSort = { column: null, direction: null };

      const headers = tableBody.parentElement.querySelectorAll("thead th");
      headers.forEach((th, index) => {
        th.style.cursor = "pointer";
        th.addEventListener("click", () => {
          const column = index;
          let direction;

          // Cycle: null → asc → desc → null
          if (currentSort.column !== column) {
            direction = "asc";
          } else if (currentSort.direction === "asc") {
            direction = "desc";
          } else if (currentSort.direction === "desc") {
            direction = null;
          } else {
            direction = "asc";
          }

          currentSort = { column, direction };

          // Remove any existing indicators
          headers.forEach(h => {
            const existing = h.querySelector(".sort-indicator");
            if (existing) existing.remove();
          });

          // Add new indicator if sorted
          if (direction) {
            const indicator = document.createElement("span");
            indicator.className = "sort-indicator";
            indicator.style.fontSize = "0.7em"; // smaller triangle
            indicator.style.marginLeft = "4px";
            indicator.textContent = direction === "asc" ? "▲" : "▼";
            th.appendChild(indicator);
          }

          // Determine rows to display
          let rowsToDisplay;
          if (!direction) {
            rowsToDisplay = originalRows;
          } else {
            rowsToDisplay = Array.from(tableBody.querySelectorAll("tr")).sort((a, b) => {
              let aText = a.children[column].textContent.trim();
              let bText = b.children[column].textContent.trim();

              // Convert numeric columns
              if (th.id === "rating") {
                aText = parseFloat(aText) || 0;
                bText = parseFloat(bText) || 0;
              }

              // For authors, use full string
              if (th.id === "authors") {
                aText = aText.toLowerCase();
                bText = bText.toLowerCase();
              }

              if (aText < bText) return direction === "asc" ? -1 : 1;
              if (aText > bText) return direction === "asc" ? 1 : -1;
              return 0;
            });
          }

          // Clear table body and append sorted rows
          tableBody.innerHTML = "";
          rowsToDisplay.forEach(row => tableBody.appendChild(row));
        });
      });

      function renderWork(work) {
        sTitle.textContent = work.title;
        // Clear existing content
        sAuthors.innerHTML = "";

        work.authors.forEach((authorId, index) => {
          const authorLink = document.createElement("a");
          const slug = getAuthorSlug({id: authorId, name: authorMap[authorId] || authorId});
          authorLink.href = `#${slug}`;
          authorLink.textContent = authorMap[authorId] || authorId;
          authorLink.addEventListener("click", () => {
            // Highlight the corresponding row in main table
            const rows = Array.from(tableBody.querySelectorAll("tr"));
            rows.forEach(row => row.classList.remove("highlighted"));
            const matchingRow = rows.find(row =>
              work.authors.every(id => row.querySelector("td:nth-child(2)").textContent.includes(authorMap[id] || id))
            );
            if (matchingRow) matchingRow.classList.add("highlighted");

            // Open author section
            openAuthorSection();
            const authorSection = document.querySelector("#author-section");
            authorSection.querySelector("h1").textContent = authorMap[authorId] || authorId;

            const authorData = authorsData.authors.find(a => a.id === authorId);
            authorSection.querySelector("#s-bio").innerHTML = authorData ? authorData.bio || "" : "";

            // Populate author table with works by this author
            const authorTableBody = authorSection.querySelector("table tbody") || (() => {
              const tbody = document.createElement("tbody");
              authorSection.querySelector("table").appendChild(tbody);
              return tbody;
            })();
            authorTableBody.innerHTML = "";

            worksData.works.filter(w => w.authors.includes(authorId)).forEach(w => {
              const row = document.createElement("tr");

              const tdTitle = document.createElement("td");
              const titleLink = document.createElement("a");
              titleLink.textContent = w.title;
              titleLink.href = "#";
              titleLink.addEventListener("click", () => {
                const prev = tableBody.querySelector("tr.highlighted");
                if (prev) prev.classList.remove("highlighted");
                // Highlight corresponding row in main table
                const rowsMain = Array.from(tableBody.querySelectorAll("tr"));
                const mainRow = rowsMain.find(r => r.querySelector("td:first-child").textContent === w.title);
                if (mainRow) mainRow.classList.add("highlighted");
                renderWork(w);
                openWorkSection();
              });
              tdTitle.appendChild(titleLink);
              row.appendChild(tdTitle);

              const tdTags = document.createElement("td");
              tdTags.textContent = w.tags || "";
              row.appendChild(tdTags);

              const tdStatus = document.createElement("td");
              tdStatus.textContent = w.status || "";
              row.appendChild(tdStatus);

              const tdRating = document.createElement("td");
              tdRating.textContent = w.rating !== null ? w.rating : "";
              row.appendChild(tdRating);

              authorTableBody.appendChild(row);
            });
          });

          sAuthors.appendChild(authorLink);
          if (index < work.authors.length - 1) {
            sAuthors.appendChild(document.createTextNode(", "));
          }
        });
        sTags.textContent = work.tags || "";
        sStatus.textContent = work.status || "";
        sRating.textContent = work.rating !== null ? work.rating : "";
        sNote.innerHTML = work.notes || "";
      }

      function openWorkSection() {
        if (workOpen) return;
        if (authorOpen) {
          document.querySelector("#author-section").classList.remove("is-open");
          authorOpen = false;
        }
        workSection.classList.add("is-open");
        workOpen = true;
      }

      function openAuthorSection() {
        if (authorOpen) return;
        if (workOpen) {
          workSection.classList.remove("is-open");
          workOpen = false;
        }
        document.querySelector("#author-section").classList.add("is-open");
        authorOpen = true;
      }

      function clearSection() {
        sTitle.textContent = "";
        sAuthors.textContent = "";
        sTags.textContent = "";
        sStatus.textContent = "";
        sRating.textContent = "";
        sNote.innerHTML = "";
      }

      document.querySelectorAll(".work-close").forEach(btn => {
        btn.addEventListener("click", () => {
          const section = btn.closest("section");
          section.classList.remove("is-open");
          if (section.id === "work-section") workOpen = false;
          if (section.id === "author-section") authorOpen = false;

          if (section.id === "work-section") clearSection();
          // Always remove highlight from main table row when closing either section
          const highlightedRow = tableBody.querySelector("tr.highlighted");
          if (highlightedRow) highlightedRow.classList.remove("highlighted");
          // Clear URL hash when closing a section
          if (window.location.hash) {
            history.replaceState(null, "", window.location.pathname + window.location.search);
          }
        });
      });

      // Close both sections and remove highlight when Escape key is pressed
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          let closed = false;
          if (workOpen) {
            workSection.classList.remove("is-open");
            workOpen = false;
            clearSection();
            closed = true;
          }
          if (authorOpen) {
            authorSection.classList.remove("is-open");
            authorOpen = false;
            closed = true;
          }
          // Remove highlight from main table row
          const highlightedRow = tableBody.querySelector("tr.highlighted");
          if (highlightedRow) highlightedRow.classList.remove("highlighted");
          // Clear URL hash if either section was closed
          if (closed && window.location.hash) {
            history.replaceState(null, "", window.location.pathname + window.location.search);
          }
        }
      });

      function slugify(text) {
        return text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      const hash = window.location.hash.slice(1);
      if (hash) {
        if (worksMap[hash]) {
          renderWork(worksMap[hash]);
          openWorkSection();
        } else {
          const slug = hash;
          const author = authorsData.authors.find(a => {
            let authorSlug = slugify(a.name);
            return authorSlug === slug;
          });
          if (author) {
            openAuthorSection();
            const authorSectionEl = document.querySelector('#author-section');
            authorSectionEl.querySelector('h1').textContent = author.name;
            authorSectionEl.querySelector('#s-bio').innerHTML = author.bio || '';

            const authorTableBody = authorSectionEl.querySelector('table tbody') || (() => {
              const tbody = document.createElement('tbody');
              authorSectionEl.querySelector('table').appendChild(tbody);
              return tbody;
            })();
            authorTableBody.innerHTML = '';

            worksData.works.filter(w => w.authors.includes(author.id)).forEach(w => {
              const row = document.createElement('tr');
              if (w.status && w.status.toLowerCase() === "read") {
                row.classList.add("is-read");
              }

              const tdTitle = document.createElement('td');
              const titleLink = document.createElement('a');
              titleLink.textContent = w.title;
              titleLink.href = '#';
              titleLink.addEventListener('click', () => {
                const prev = tableBody.querySelector('tr.highlighted');
                if (prev) prev.classList.remove('highlighted');
                const mainRow = Array.from(tableBody.querySelectorAll('tr'))
                  .find(r => r.querySelector('td:first-child').textContent === w.title);
                if (mainRow) mainRow.classList.add('highlighted');
                renderWork(w);
                openWorkSection();
              });
              tdTitle.appendChild(titleLink);
              row.appendChild(tdTitle);

              const tdTags = document.createElement('td');
              tdTags.textContent = w.tags || '';
              row.appendChild(tdTags);

              const tdStatus = document.createElement('td');
              tdStatus.textContent = w.status || '';
              row.appendChild(tdStatus);

              const tdRating = document.createElement('td');
              tdRating.textContent = w.rating !== null ? w.rating : '';
              row.appendChild(tdRating);

              authorTableBody.appendChild(row);
            });
          }
        }
      }
    })
    .catch(err => {
      console.error("Failed to load library data:", err);
    });
    const searchInput = document.querySelector('#top-section input[type="search"]');
    const tableContainer = document.querySelector('#works-table');


    if (searchInput && tableBody) {
      const applyTableFilter = () => {
        const cleanedInput = searchInput.value.replace(/[\s#]+/g, ' ').toLowerCase();
        const rawTokens = cleanedInput
          .split(' ')
          .filter(token => token.trim() !== '' && token !== '-');

        const includeTokens = [];
        const excludeTokens = [];
        rawTokens.forEach(token => {
          if (token.startsWith('-') && token.length > 1) {
            excludeTokens.push(token.slice(1));
          } else {
            includeTokens.push(token);
          }
        });

        let visibleCount = 0;

        tableBody.querySelectorAll('tr').forEach(row => {
          const text = Array.from(row.children)
            .map(td => td.textContent.toLowerCase())
            .join(' ');

          const includesAll = includeTokens.every(token => text.includes(token));
          const excludesAll = excludeTokens.every(token => !text.includes(token));

          if (includesAll && excludesAll) {
            row.style.display = '';
            visibleCount++;
          } else {
            row.style.display = 'none';
          }
        });

        noResultsMessage.style.display = visibleCount === 0 ? '' : 'none';
      };

      searchInput.addEventListener('input', applyTableFilter);

      // Reset button
      const searchReset = document.querySelector('#top-section input[type="reset"]');
      if (searchReset && searchInput) {
        searchReset.addEventListener('click', () => {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input'));
        });
      }
    }
  // Update handle height for each section
  const handleSections = document.querySelectorAll('section:not(#top-section)');
  function updateHandleHeight() {
    handleSections.forEach(section => {
      section.style.setProperty('--handle-height', section.scrollHeight + 'px');
    });
  }
  updateHandleHeight();
  handleSections.forEach(section => {
    section.addEventListener('input', updateHandleHeight);
    section.addEventListener('scroll', updateHandleHeight);
    window.addEventListener('resize', updateHandleHeight);
  });
});