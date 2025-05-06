let currentImageIndex = 0;
let currentImages = [];

// Show the preloader
function showPreloader() {
  document.getElementById("preloader").style.display = "flex";
}

// Hide the preloader
function hidePreloader() {
  document.getElementById("preloader").style.display = "none";
}

// Function to load data from the selected JSON file
function loadData() {
  const jsonSelector = document.getElementById("jsonSelector");
  const selectedFile = jsonSelector.value;

  fetch(selectedFile)
    .then((response) => {
      showPreloader(); // Show preloader while fetching data
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      hidePreloader(); // Hide preloader once data is loaded
      populateBrands(data); // Populate the brands section
    })
    .catch((error) => {
      hidePreloader(); // Hide preloader if there's an error
      const brandsSection = document.getElementById("brandsSection");
      brandsSection.textContent = `Error: ${error.message}`;
    });
}

// Populate the brands section
function populateBrands(data) {
  const brandsSection = document.getElementById("brandsSection");
  brandsSection.innerHTML = ""; // Clear previous brands

  // Extract unique brands from the keys and sort alphabetically
  const brands = [...new Set(Object.keys(data).map((key) => key.split("/")[0]))].sort();

  // Create buttons for each brand
  brands.forEach((brand) => {
    const brandButton = document.createElement("button");
    brandButton.textContent = brand;
    brandButton.addEventListener("click", () => showModels(brand, data));
    brandsSection.appendChild(brandButton);
  });

  // Clear other sections
  document.getElementById("modelsSection").innerHTML = "";
  document.getElementById("yearsSection").innerHTML = "";
  document.getElementById("imagesSection").innerHTML = "";
}

function showModels(brand, data) {
  const modelsSection = document.getElementById("modelsSection");
  modelsSection.innerHTML = ""; // Clear previous models

  // Extract unique models for the selected brand and sort alphabetically
  const models = [
    ...new Set(
      Object.keys(data)
        .filter((key) => key.startsWith(brand))
        .map((key) => key.split("/")[1])
    ),
  ].sort();

  models.forEach((model) => {
    const modelButton = document.createElement("button");
    modelButton.textContent = model;
    modelButton.addEventListener("click", () => showYears(brand, model, data));
    modelsSection.appendChild(modelButton);
  });

  document.getElementById("yearsSection").innerHTML = ""; // Clear years
  document.getElementById("imagesSection").innerHTML = ""; // Clear images
}

function showYears(brand, model, data) {
  const yearsSection = document.getElementById("yearsSection");
  yearsSection.innerHTML = ""; // Clear previous years

  // Extract unique years for the selected brand and model and sort numerically
  const years = [
    ...new Set(
      Object.keys(data)
        .filter((key) => key.startsWith(`${brand}/${model}`))
        .map((key) => key.split("/")[2])
    ),
  ].sort((a, b) => a - b);

  years.forEach((year) => {
    const yearButton = document.createElement("button");
    yearButton.textContent = year;
    yearButton.addEventListener("click", () => showImages(brand, model, year, data));
    yearsSection.appendChild(yearButton);
  });

  document.getElementById("imagesSection").innerHTML = ""; // Clear images
}

function showImages(brand, model, year, data) {
  const imagesSection = document.getElementById("imagesSection");
  imagesSection.innerHTML = ""; // Clear previous images

  const images = Object.entries(data).filter(([key]) =>
    key.startsWith(`${brand}/${model}/${year}`)
  );

  currentImages = []; // Reset the current images for navigation

  const validImages = []; // Store valid images after filtering

  // Process images to filter out small and unavailable ones
  const promises = images.map(([key, imageUrl]) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        if (img.naturalWidth > 1 && img.naturalHeight > 1) {
          validImages.push({ key, imageUrl }); // Add valid images to the list
        }
        resolve();
      };

      img.onerror = () => resolve(); // Ignore invalid images
    });
  });

  // Once all images are processed, display them one by one
  Promise.all(promises).then(() => {
    currentImages = validImages; // Update the current images for navigation

    validImages.forEach(({ key, imageUrl }, index) => {
      setTimeout(() => {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = key;

        // Add click event to open modal
        img.addEventListener("click", () => openModal(index, brand, model, year));

        imageContainer.appendChild(img);
        imagesSection.appendChild(imageContainer);
      }, index * 50); // Delay each image by 200ms for a staggered effect
    });
  });
}

// Function to open the modal
function openModal(index, brand, model, year) {
  currentImageIndex = index; // Set the current image index
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalText = document.getElementById("modalText");

  const [key, imageUrl] = currentImages[currentImageIndex];
  modal.classList.add("show"); // Add the 'show' class to fade in the modal
  modalImage.src = imageUrl; // Set the image source
  modalText.textContent = `${brand} - ${model} - ${year}`; // Set the text content
}

// Function to navigate to the next image
function showNextImage() {
  if (currentImageIndex < currentImages.length - 1) {
    currentImageIndex++;
    const [key, imageUrl] = currentImages[currentImageIndex];
    const modalImage = document.getElementById("modalImage");
    modalImage.src = imageUrl;
  }
}

// Function to navigate to the previous image
function showPrevImage() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    const [key, imageUrl] = currentImages[currentImageIndex];
    const modalImage = document.getElementById("modalImage");
    modalImage.src = imageUrl;
  }
}

// Close the modal when the close button is clicked
document.querySelector(".close").addEventListener("click", () => {
  const modal = document.getElementById("imageModal");
  modal.classList.remove("show"); // Remove the 'show' class to fade out the modal
});

// Close the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  const modal = document.getElementById("imageModal");
  if (event.target === modal) {
    modal.classList.remove("show"); // Remove the 'show' class to fade out the modal
  }
});

// Add event listeners for navigation arrows
document.getElementById("nextArrow").addEventListener("click", showNextImage);
document.getElementById("prevArrow").addEventListener("click", showPrevImage);

// Add event listener to the load data button
document.getElementById("loadDataButton").addEventListener("click", loadData);
