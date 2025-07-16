document.querySelectorAll(".drop-zone-input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest("#drop-zone");

  let currentFiles = [];

  dropZoneElement.addEventListener("click", (e) => {
    if (e.target === dropZoneElement || e.target.closest("img")) {
      inputElement.click();
    }
  });
  dropZoneElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      inputElement.click();
    }
  });
  dropZoneElement.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-thumb")) {
      const index = e.target.dataset.index;
      currentFiles.splice(index, 1);
      updateThumbnails(dropZoneElement, currentFiles);
      updateInputFiles(inputElement, currentFiles);
    }
  });

  // New: Handle keydown for deleting selected thumbnails
  dropZoneElement.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const selectedThumb = dropZoneElement.querySelector(
        ".drop-zone-thumb.selected"
      );
      if (selectedThumb) {
        // Find index of selected thumbnail
        const thumbs = Array.from(
          dropZoneElement.querySelectorAll(".drop-zone-thumb")
        );
        const index = thumbs.indexOf(selectedThumb);

        if (index > -1) {
          currentFiles.splice(index, 1);
          updateThumbnails(dropZoneElement, currentFiles);
          updateInputFiles(inputElement, currentFiles);
        }
      }
    }
  });

  // Make dropZoneElement focusable to receive keyboard events
  dropZoneElement.tabIndex = 0;

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      currentFiles = currentFiles.concat(Array.from(inputElement.files));
      updateThumbnails(dropZoneElement, currentFiles);
      updateInputFiles(inputElement, currentFiles);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    currentFiles = currentFiles.concat(Array.from(e.dataTransfer.files));
    updateThumbnails(dropZoneElement, currentFiles);
    updateInputFiles(inputElement, currentFiles);
  });

  dropZoneElement.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-thumb")) {
      const index = e.target.dataset.index;
      currentFiles.splice(index, 1);
      updateThumbnails(dropZoneElement, currentFiles);
      updateInputFiles(inputElement, currentFiles);
    }
  });
});

function updateThumbnails(dropZoneElement, files) {
  // Clear all thumbnails
  dropZoneElement
    .querySelectorAll(".drop-zone-thumb")
    .forEach((el) => el.remove());

  files.forEach((file, i) => {
    const thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone-thumb");
    thumbnailElement.dataset.label = file.name;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
        thumbnailElement.style.boxShadow =
          "0px 5px 10px 2px rgba(0, 0, 0, 0.5)";
      };
    }

    dropZoneElement.appendChild(thumbnailElement);
  });

  // After appending all thumbs
  dropZoneElement.querySelectorAll(".drop-zone-thumb").forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      e.stopPropagation();

      dropZoneElement
        .querySelectorAll(".drop-zone-thumb.selected")
        .forEach((el) => {
          el.classList.remove("selected");
        });

      thumb.classList.toggle("selected");
    });
  });
}

function updateInputFiles(inputElement, files) {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  inputElement.files = dataTransfer.files;
}
