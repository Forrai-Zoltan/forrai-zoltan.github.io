// For Contact File upload //

document.querySelectorAll(".drop-zone-input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest("#Drop-zone");

  let currentFile = null;

  dropZoneElement.addEventListener("click", (e) => {
    if (e.target === dropZoneElement || e.target.closest("img")) {
      inputElement.click();
    }
    if (e.target.classList.contains("remove-thumb")) {
      currentFile = null;
      updateThumbnails(dropZoneElement, currentFile);
      updateInputFiles(inputElement, currentFile);
    }
  });

  dropZoneElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      inputElement.click();
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const selectedThumb = dropZoneElement.querySelector(
        ".drop-zone-thumb.selected"
      );
      if (selectedThumb) {
        currentFile = null;
        updateThumbnails(dropZoneElement, currentFile);
        updateInputFiles(inputElement, currentFile);
      }
    }
  });

  dropZoneElement.tabIndex = 0;

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      currentFile = inputElement.files[0];
      updateThumbnails(dropZoneElement, currentFile);
      updateInputFiles(inputElement, currentFile);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, () => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZoneElement.classList.remove("drop-zone--over");

    if (e.dataTransfer.files.length) {
      currentFile = e.dataTransfer.files[0];
      updateThumbnails(dropZoneElement, currentFile);
      updateInputFiles(inputElement, currentFile);
    }
  });
});

function updateThumbnails(dropZoneElement, file) {
  dropZoneElement
    .querySelectorAll(".drop-zone-thumb")
    .forEach((el) => el.remove());

  if (!file) return;

  const thumbnailElement = document.createElement("div");
  thumbnailElement.classList.add("drop-zone-thumb");
  thumbnailElement.dataset.label = file.name;

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      thumbnailElement.style.boxShadow = "0px 5px 10px 2px rgba(0, 0, 0, 0.5)";
      thumbnailElement.style.width = "233px";
      thumbnailElement.style.height = "120px";
    };
  }

  dropZoneElement.appendChild(thumbnailElement);

  thumbnailElement.addEventListener("click", (e) => {
    e.stopPropagation();
    thumbnailElement.classList.toggle("selected");
  });
}

function updateInputFiles(inputElement, file) {
  const dataTransfer = new DataTransfer();
  if (file) dataTransfer.items.add(file);
  inputElement.files = dataTransfer.files;
}
