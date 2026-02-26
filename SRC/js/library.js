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

  const wikipediaCache = {};

  let workOpen = false;
  let authorOpen = false;

  let authorTableSortState = { column: null, direction: null };
  let authorTableListenersAttached = false;

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

  [workSection, authorSection].forEach((section) => {
    section.addEventListener("mousedown", (e) => {
      const rect = section.getBoundingClientRect();
      if (e.clientX - rect.left < 10) {
        startResize(e, section);
      }
    });
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing || !resizingSection) return;
    const dx = startX - e.clientX;
    const newWidth = Math.min(
      window.innerWidth,
      Math.max(300, startWidth + dx)
    );
    resizingSection.style.width = `${newWidth}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      resizingSection = null;
      document.body.style.cursor = "";
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

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  async function fetchWikipediaData(authorName, customUrl = null) {
    if (wikipediaCache[authorName]) {
      return wikipediaCache[authorName];
    }

    try {
      const url = customUrl
        ? `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            customUrl.split("/").pop()
          )}`
        : `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            authorName
          )}`;

      const response = await fetch(url);

      if (!response.ok) {
        wikipediaCache[authorName] = null;
        return null;
      }

      const data = await response.json();

      const result = {
        image: data.thumbnail
          ? { src: data.thumbnail.source, alt: authorName }
          : null,
        link:
          customUrl ||
          data.content_urls?.desktop?.page ||
          `https://en.wikipedia.org/wiki/${encodeURIComponent(authorName)}`,
        exists:
          data.type !==
          "https://mediawiki.org/wiki/HyperSwitch/errors/not_found",
      };

      wikipediaCache[authorName] = result;
      return result;
    } catch (error) {
      console.log("Could not fetch Wikipedia data for", authorName);
      wikipediaCache[authorName] = null;
      return null;
    }
  }

  Promise.all([
    fetch("/works.json").then((res) => res.json()),
    fetch("/authors.json").then((res) => res.json()),
  ])
    .then(([worksData, authorsData]) => {
      const authorMap = {};
      authorsData.authors.forEach((author) => {
        authorMap[author.id] = author.name;
      });

      function getAuthorSlug(author) {
        return slugify(author.name);
      }

      function setupAuthorTableSorting() {
        const authorTable = authorSection.querySelector("table");
        if (!authorTable) return;

        const authorHeaders = authorTable.querySelectorAll("thead th");
        const authorTableBody = authorTable.querySelector("tbody");
        if (!authorTableBody) return;

        const originalAuthorRows = Array.from(
          authorTableBody.querySelectorAll("tr")
        );

        if (authorTableListenersAttached) {
          authorHeaders.forEach((th) => {
            const newTh = th.cloneNode(true);
            th.parentNode.replaceChild(newTh, th);
          });
        }

        authorTableSortState = { column: null, direction: null };

        const freshHeaders = authorTable.querySelectorAll("thead th");

        freshHeaders.forEach((th, index) => {
          th.style.cursor = "pointer";
          th.addEventListener("click", () => {
            const column = index;
            let direction;

            if (authorTableSortState.column !== column) {
              direction = "asc";
            } else if (authorTableSortState.direction === "asc") {
              direction = "desc";
            } else if (authorTableSortState.direction === "desc") {
              direction = null;
            } else {
              direction = "asc";
            }

            authorTableSortState = { column, direction };

            freshHeaders.forEach((h) => {
              const existing = h.querySelector(".sort-indicator");
              if (existing) existing.remove();
            });

            if (direction) {
              const indicator = document.createElement("span");
              indicator.className = "sort-indicator";
              indicator.style.fontSize = "0.7em";
              indicator.style.marginLeft = "4px";
              indicator.textContent = direction === "asc" ? "▲" : "▼";
              th.appendChild(indicator);
            }

            let rowsToDisplay;
            if (!direction) {
              rowsToDisplay = originalAuthorRows;
            } else {
              rowsToDisplay = Array.from(
                authorTableBody.querySelectorAll("tr")
              ).sort((a, b) => {
                let aText = a.children[column].textContent.trim();
                let bText = b.children[column].textContent.trim();
                if (th.id === "as-rating") {
                  aText = parseFloat(aText) || 0;
                  bText = parseFloat(bText) || 0;
                }
                return direction === "asc"
                  ? aText < bText
                    ? -1
                    : aText > bText
                    ? 1
                    : 0
                  : aText > bText
                  ? -1
                  : aText < bText
                  ? 1
                  : 0;
              });
            }

            authorTableBody.innerHTML = "";
            rowsToDisplay.forEach((row) => authorTableBody.appendChild(row));
          });
        });

        authorTableListenersAttached = true;
      }

      async function populateAuthorSection(authorId) {
        const authorData = authorsData.authors.find((a) => a.id === authorId);
        const authorName = authorMap[authorId] || authorId;

        authorSection.querySelector("h1").textContent = authorName;

        const bioElement = authorSection.querySelector("#s-bio");
        if (authorData) {
          bioElement.innerHTML = `${authorName} ${authorData.bio || ""}`;
        } else {
          bioElement.innerHTML = "";
        }

        const imgElement = authorSection.querySelector("#a-img");
        imgElement.src = "";
        imgElement.alt = "";
        imgElement.style.display = "none";

        const authorTableBody =
          authorSection.querySelector("table tbody") ||
          (() => {
            const tbody = document.createElement("tbody");
            authorSection.querySelector("table").appendChild(tbody);
            return tbody;
          })();

        authorTableBody.innerHTML = "";

        const wikiField = authorData?.wiki;

        if (wikiField === "off") {
          if (authorData) {
            bioElement.innerHTML = `${authorName} ${authorData.bio || ""}`;
          }
        } else if (wikiField && wikiField !== "off") {
          fetchWikipediaData(authorName, wikiField).then((wikiData) => {
            if (wikiData && wikiData.image) {
              imgElement.src = wikiData.image.src;
              imgElement.alt = wikiData.image.alt;
              imgElement.style.display = "";
            }

            if (authorData) {
              let bioHTML = `<a href="${wikiField}" target="_blank" rel="noopener noreferrer">${authorName}</a> `;
              bioHTML += authorData.bio || "";
              bioElement.innerHTML = bioHTML;
            }
          });
        } else {
          fetchWikipediaData(authorName).then((wikiData) => {
            if (wikiData && wikiData.image) {
              imgElement.src = wikiData.image.src;
              imgElement.alt = wikiData.image.alt;
              imgElement.style.display = "";
            }

            if (authorData) {
              let bioHTML = "";
              if (wikiData && wikiData.link) {
                bioHTML = `<a href="${wikiData.link}" target="_blank" rel="noopener noreferrer">${authorName}</a> `;
              } else {
                bioHTML = `${authorName} `;
              }
              bioHTML += authorData.bio || "";
              bioElement.innerHTML = bioHTML;
            }
          });
        }

        worksData.works
          .filter((work) => work.authors.includes(authorId))
          .forEach((work) => {
            const row = document.createElement("tr");
            if (work.status && work.status.toLowerCase() === "read") {
              row.classList.add("is-read");
            }

            const tdTitle = document.createElement("td");
            const titleLink = document.createElement("a");
            titleLink.textContent = work.title;
            const workSlug = slugify(work.title);
            titleLink.href = `#${workSlug}`;
            titleLink.addEventListener("click", (e) => {
              e.preventDefault();

              const prev = tableBody.querySelectorAll("tr.highlighted");
              prev.forEach((row) => row.classList.remove("highlighted"));

              const mainRow = Array.from(tableBody.querySelectorAll("tr")).find(
                (r) =>
                  r.querySelector("td:first-child").textContent === work.title
              );
              if (mainRow) mainRow.classList.add("highlighted");

              history.replaceState(null, "", `#${workSlug}`);

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

        setupAuthorTableSorting();
      }

      const worksMap = {};
      const rowEventListeners = new WeakMap();

      worksData.works.forEach((work) => {
        const slug = slugify(work.title);
        worksMap[slug] = work;

        const tr = document.createElement("tr");
        if (work.status && work.status.toLowerCase() === "read") {
          tr.classList.add("is-read");
        }

        const cleanupFunctions = [];

        const tdTitle = document.createElement("td");
        const titleLink = document.createElement("a");
        titleLink.textContent = work.title;
        titleLink.href = `#${slug}`;
        const titleClickHandler = (e) => {
          e.preventDefault();

          const prevHighlighted = tableBody.querySelectorAll("tr.highlighted");
          prevHighlighted.forEach((row) => row.classList.remove("highlighted"));

          tr.classList.add("highlighted");

          history.replaceState(null, "", `#${slug}`);

          renderWork(work);
          openWorkSection();
        };
        titleLink.addEventListener("click", titleClickHandler);
        cleanupFunctions.push(() =>
          titleLink.removeEventListener("click", titleClickHandler)
        );
        tdTitle.appendChild(titleLink);
        tr.appendChild(tdTitle);

        const tdAuthors = document.createElement("td");
        work.authors.forEach((authorId, index) => {
          if (authorId === "unknown") {
            const textNode = document.createTextNode(
              authorMap[authorId] || authorId
            );
            tdAuthors.appendChild(textNode);
          } else {
            const authorLink = document.createElement("a");
            authorLink.textContent = authorMap[authorId] || authorId;
            const authorSlug = getAuthorSlug({
              id: authorId,
              name: authorMap[authorId] || authorId,
            });
            authorLink.href = `#${authorSlug}`;
            const authorClickHandler = (e) => {
              e.preventDefault();

              const prevHighlighted =
                tableBody.querySelectorAll("tr.highlighted");
              prevHighlighted.forEach((row) =>
                row.classList.remove("highlighted")
              );
              tr.classList.add("highlighted");

              history.replaceState(null, "", `#${authorSlug}`);

              openAuthorSection();
              populateAuthorSection(authorId);
            };
            authorLink.addEventListener("click", authorClickHandler);
            cleanupFunctions.push(() =>
              authorLink.removeEventListener("click", authorClickHandler)
            );
            tdAuthors.appendChild(authorLink);
          }

          if (index < work.authors.length - 1) {
            tdAuthors.appendChild(document.createTextNode(", "));
          }
        });
        tr.appendChild(tdAuthors);

        const tdTags = document.createElement("td");
        if (work.tags) {
          const tags = work.tags.split(",").map((t) => t.trim());
          tags.forEach((tag, index) => {
            const tagLink = document.createElement("a");
            tagLink.textContent = tag;
            tagLink.href = "#";
            tagLink.style.cursor = "pointer";
            const tagClickHandler = (e) => {
              e.preventDefault();
              e.stopPropagation();
              const searchInput = document.querySelector(
                '#top-section input[type="search"]'
              );
              if (searchInput) {
                const currentValue = searchInput.value;
                const regex = new RegExp(
                  "\\b" + tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b"
                );

                if (regex.test(currentValue)) {
                  searchInput.value = currentValue
                    .replace(regex, "")
                    .replace(/\s+/g, " ")
                    .trim();
                } else {
                  searchInput.value = currentValue.trim()
                    ? currentValue.trim() + " " + tag
                    : tag;
                }

                searchInput.dispatchEvent(new Event("input"));
              }
            };
            tagLink.addEventListener("click", tagClickHandler);
            cleanupFunctions.push(() =>
              tagLink.removeEventListener("click", tagClickHandler)
            );
            tdTags.appendChild(tagLink);
            if (index < tags.length - 1) {
              tdTags.appendChild(document.createTextNode(", "));
            }
          });
        }
        tr.appendChild(tdTags);

        const tdStatus = document.createElement("td");
        tdStatus.textContent = work.status;
        tr.appendChild(tdStatus);

        const tdRating = document.createElement("td");
        tdRating.textContent = work.rating !== null ? work.rating : "";
        tr.appendChild(tdRating);

        rowEventListeners.set(tr, cleanupFunctions);

        tableBody.appendChild(tr);
      });

      const originalRows = Array.from(tableBody.querySelectorAll("tr"));

      let currentSort = { column: null, direction: null };

      const headers = tableBody.parentElement.querySelectorAll("thead th");
      headers.forEach((th, index) => {
        th.style.cursor = "pointer";
        th.addEventListener("click", () => {
          const column = index;
          let direction;

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

          headers.forEach((h) => {
            const existing = h.querySelector(".sort-indicator");
            if (existing) existing.remove();
          });

          if (direction) {
            const indicator = document.createElement("span");
            indicator.className = "sort-indicator";
            indicator.style.fontSize = "0.7em";
            indicator.style.marginLeft = "4px";
            indicator.textContent = direction === "asc" ? "▲" : "▼";
            th.appendChild(indicator);
          }

          let rowsToDisplay;
          if (!direction) {
            rowsToDisplay = originalRows;
          } else {
            rowsToDisplay = Array.from(tableBody.querySelectorAll("tr")).sort(
              (a, b) => {
                let aText = a.children[column].textContent.trim();
                let bText = b.children[column].textContent.trim();

                if (th.id === "rating") {
                  aText = parseFloat(aText) || 0;
                  bText = parseFloat(bText) || 0;
                }

                if (th.id === "authors") {
                  aText = aText.toLowerCase();
                  bText = bText.toLowerCase();
                }

                if (aText < bText) return direction === "asc" ? -1 : 1;
                if (aText > bText) return direction === "asc" ? 1 : -1;
                return 0;
              }
            );
          }

          tableBody.innerHTML = "";
          rowsToDisplay.forEach((row) => tableBody.appendChild(row));
        });
      });

      function renderWork(work) {
        sTitle.textContent = work.title;
        sAuthors.innerHTML = "";

        work.authors.forEach((authorId, index) => {
          if (authorId === "unknown") {
            const textNode = document.createTextNode(
              authorMap[authorId] || authorId
            );
            sAuthors.appendChild(textNode);
          } else {
            const authorLink = document.createElement("a");
            const slug = getAuthorSlug({
              id: authorId,
              name: authorMap[authorId] || authorId,
            });
            authorLink.href = `#${slug}`;
            authorLink.textContent = authorMap[authorId] || authorId;
            authorLink.addEventListener("click", (e) => {
              e.preventDefault();

              const rows = Array.from(tableBody.querySelectorAll("tr"));
              rows.forEach((row) => row.classList.remove("highlighted"));
              const matchingRow = rows.find(
                (row) =>
                  row.querySelector("td:first-child").textContent === work.title
              );
              if (matchingRow) matchingRow.classList.add("highlighted");

              history.replaceState(null, "", `#${slug}`);

              openAuthorSection();
              populateAuthorSection(authorId);
            });

            sAuthors.appendChild(authorLink);
          }
          if (index < work.authors.length - 1) {
            sAuthors.appendChild(document.createTextNode(", "));
          }
        });

        sTags.innerHTML = "";
        if (work.tags) {
          const tags = work.tags.split(",").map((t) => t.trim());
          tags.forEach((tag, index) => {
            const tagLink = document.createElement("a");
            tagLink.textContent = tag;
            tagLink.href = "#";
            tagLink.style.cursor = "pointer";
            tagLink.addEventListener("click", (e) => {
              e.preventDefault();
              const searchInput = document.querySelector(
                '#top-section input[type="search"]'
              );
              if (searchInput) {
                const currentValue = searchInput.value;
                const regex = new RegExp(
                  "\\b" + tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b"
                );

                if (regex.test(currentValue)) {
                  searchInput.value = currentValue
                    .replace(regex, "")
                    .replace(/\s+/g, " ")
                    .trim();
                } else {
                  searchInput.value = currentValue.trim()
                    ? currentValue.trim() + " " + tag
                    : tag;
                }

                searchInput.dispatchEvent(new Event("input"));
              }
            });
            sTags.appendChild(tagLink);
            if (index < tags.length - 1) {
              sTags.appendChild(document.createTextNode(", "));
            }
          });
        }
        sStatus.textContent = work.status || "";
        sRating.textContent = work.rating !== null ? work.rating : "";
        sNote.innerHTML = work.notes || "";
      }

      function openWorkSection() {
        if (workOpen) return;
        if (authorOpen) {
          authorSection.classList.remove("is-open");
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
        authorSection.classList.add("is-open");
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

      document.querySelectorAll(".work-close").forEach((btn) => {
        btn.addEventListener("click", () => {
          const section = btn.closest("section");
          section.classList.remove("is-open");
          if (section.id === "work-section") workOpen = false;
          if (section.id === "author-section") authorOpen = false;

          if (section.id === "work-section") clearSection();

          const highlightedRows = tableBody.querySelectorAll("tr.highlighted");
          highlightedRows.forEach((row) => row.classList.remove("highlighted"));

          if (window.location.hash) {
            history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search
            );
          }
        });
      });

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

          const highlightedRows = tableBody.querySelectorAll("tr.highlighted");
          highlightedRows.forEach((row) => row.classList.remove("highlighted"));

          if (closed && window.location.hash) {
            history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search
            );
          }
        }
      });

      function handleHashNavigation() {
        const hash = window.location.hash.slice(1);
        if (hash) {
          if (worksMap[hash]) {
            renderWork(worksMap[hash]);
            openWorkSection();

            const prevHighlighted =
              tableBody.querySelectorAll("tr.highlighted");
            prevHighlighted.forEach((row) =>
              row.classList.remove("highlighted")
            );

            const workTitle = worksMap[hash].title;
            const rows = Array.from(tableBody.querySelectorAll("tr"));
            const mainRow = rows.find(
              (r) => r.querySelector("td:first-child").textContent === workTitle
            );
            if (mainRow) {
              mainRow.classList.add("highlighted");
              mainRow.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          } else {
            const author = authorsData.authors.find(
              (a) => slugify(a.name) === hash
            );
            if (author) {
              openAuthorSection();
              populateAuthorSection(author.id);

              const prevHighlighted =
                tableBody.querySelectorAll("tr.highlighted");
              prevHighlighted.forEach((row) =>
                row.classList.remove("highlighted")
              );

              const authorName = author.name;
              const mainRows = Array.from(tableBody.querySelectorAll("tr"));
              let firstHighlightedRow = null;

              mainRows.forEach((row) => {
                const authorsTd = row.querySelector("td:nth-child(2)");
                if (authorsTd && authorsTd.textContent.includes(authorName)) {
                  row.classList.add("highlighted");
                  if (!firstHighlightedRow) firstHighlightedRow = row;
                }
              });

              if (firstHighlightedRow) {
                firstHighlightedRow.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }
            }
          }
        }
      }

      handleHashNavigation();

      window.addEventListener("hashchange", handleHashNavigation);

      initializeSearch();
    })
    .catch((err) => {
      console.error("Failed to load library data:", err);
    });

  function initializeSearch() {
    const searchInput = document.querySelector(
      '#top-section input[type="search"]'
    );
    const tableContainer = document.querySelector("#works-table");

    if (!searchInput || !tableBody) return;

    let noResultsMessage = tableContainer.querySelector(".no-results-message");
    if (!noResultsMessage) {
      noResultsMessage = document.createElement("div");
      noResultsMessage.className = "no-results-message";
      noResultsMessage.textContent = "No results found.";
      noResultsMessage.style.display = "none";
      noResultsMessage.style.textAlign = "center";
      noResultsMessage.style.padding = "1em";
      tableContainer.appendChild(noResultsMessage);
    }

    function applyTableFilter() {
      const input = searchInput.value.replace(/[\s#]+/g, " ").toLowerCase();
      const phraseRegex = /"([^"]+)"|(\S+)/g;
      let match;
      const rawTokens = [];

      while ((match = phraseRegex.exec(input)) !== null) {
        if (match[1]) {
          rawTokens.push(match[1]);
        } else if (match[2]) {
          rawTokens.push(match[2]);
        }
      }

      const includeTokens = [];
      const excludeTokens = [];

      rawTokens.forEach((token) => {
        if (token.startsWith("-") && token.length > 1) {
          excludeTokens.push(token.slice(1));
        } else {
          includeTokens.push(token);
        }
      });

      let visibleCount = 0;
      tableBody.querySelectorAll("tr").forEach((row) => {
        const text = Array.from(row.children)
          .map((td) => td.textContent.toLowerCase())
          .join(" ");

        const includesAll = includeTokens.every((token) =>
          text.includes(token)
        );
        const excludesAll = excludeTokens.every(
          (token) => !text.includes(token)
        );

        if (includesAll && excludesAll) {
          row.style.display = "";
          visibleCount++;
        } else {
          row.style.display = "none";
        }
      });

      noResultsMessage.style.display = visibleCount === 0 ? "" : "none";
    }

    const debouncedFilter = debounce(applyTableFilter, 150);
    searchInput.addEventListener("input", debouncedFilter);

    const searchReset = document.querySelector(
      '#top-section input[type="reset"]'
    );
    if (searchReset) {
      searchReset.addEventListener("click", () => {
        searchInput.value = "";
        applyTableFilter();
      });
    }
  }

  const handleSections = document.querySelectorAll("section:not(#top-section)");

  function updateHandleHeight() {
    handleSections.forEach((section) => {
      section.style.setProperty("--handle-height", section.scrollHeight + "px");
    });
  }

  updateHandleHeight();

  handleSections.forEach((section) => {
    section.addEventListener("input", updateHandleHeight);
    section.addEventListener("scroll", updateHandleHeight);
  });

  window.addEventListener("resize", updateHandleHeight);
});
