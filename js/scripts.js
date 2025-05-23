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
  const preloader = document.getElementById("preloader");
  preloader.style.display = "flex"; // Show the preloader

  const brands = document.getElementById("brandsSection");
  const models = document.getElementById("modelsSection");
  const years = document.getElementById("yearsSection");
  const images = document.getElementById("imagesSection");

  brands.innerHTML = ""; // Clear previous brands
  models.innerHTML = ""; // Clear previous models
  years.innerHTML = ""; // Clear previous years
  images.innerHTML = ""; // Clear previous images

  fetch(selectedFile)
    .then((response) => response.json())
    .then((data) => {
      // Call the function to populate brand buttons
      showBrands(data);
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });
}

function showBrands(data) {
  preloader.style.display = "none"; // Hide the preloader
  const brandsSection = document.getElementById("brandsSection");
  brandsSection.innerHTML = ""; // Clear previous buttons

  // Extract and sort the brands alphabetically, ignoring case
  const brands = [
    ...new Set(Object.keys(data).map((key) => key.split("/")[0])),
  ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  brands.forEach((brand, index) => {
    const brandButton = document.createElement("button");
    brandButton.textContent = brand;

    // Add click event to toggle active state
    brandButton.addEventListener("click", () => {
      const modelsSection = document.getElementById("modelsSection");
      const yearsSection = document.getElementById("yearsSection");
      const imagesSection = document.getElementById("imagesSection");

      if (brandButton.classList.contains("active")) {
        // If the button is already active, clear subsequent sections and deactivate the button
        modelsSection.innerHTML = "";
        yearsSection.innerHTML = "";
        imagesSection.innerHTML = "";
        brandButton.classList.remove("active");
      } else {
        // Otherwise, clear subsequent sections, activate the button, and show models
        Array.from(brandsSection.children).forEach((btn) =>
          btn.classList.remove("active")
        );
        modelsSection.innerHTML = "";
        yearsSection.innerHTML = "";
        imagesSection.innerHTML = "";
        brandButton.classList.add("active");
        showModels(brand, data);
      }
    });

    brandsSection.appendChild(brandButton);

    // Add the "visible" class with a slight delay for each button
    setTimeout(() => {
      brandButton.classList.add("visible");
    }, index * 50); // Delay based on the index for a staggered effect
  });
}

function showModels(brand, data) {
  const modelsSection = document.getElementById("modelsSection");
  modelsSection.innerHTML = ""; // Clear previous models

  const models = [
    ...new Set(
      Object.keys(data)
        .filter((key) => key.startsWith(brand))
        .map((key) => key.split("/")[1])
    ),
  ].sort();

  models.forEach((model, index) => {
    const modelButton = document.createElement("button");
    modelButton.textContent = model;

    // Add click event to toggle active state
    modelButton.addEventListener("click", () => {
      const yearsSection = document.getElementById("yearsSection");
      const imagesSection = document.getElementById("imagesSection");

      if (modelButton.classList.contains("active")) {
        // If the button is already active, clear subsequent sections and deactivate the button
        yearsSection.innerHTML = "";
        imagesSection.innerHTML = "";
        modelButton.classList.remove("active");
      } else {
        // Otherwise, clear subsequent sections, activate the button, and show years
        Array.from(modelsSection.children).forEach((btn) =>
          btn.classList.remove("active")
        );
        yearsSection.innerHTML = "";
        imagesSection.innerHTML = "";
        modelButton.classList.add("active");
        showYears(brand, model, data);
      }
    });

    modelsSection.appendChild(modelButton);

    // Add the "visible" class with a slight delay for each button
    setTimeout(() => {
      modelButton.classList.add("visible");
    }, index * 100); // Delay based on the index for a staggered effect
  });
}

function showYears(brand, model, data) {
  const yearsSection = document.getElementById("yearsSection");
  yearsSection.innerHTML = ""; // Clear previous buttons

  const years = [
    ...new Set(
      Object.keys(data)
        .filter((key) => key.startsWith(`${brand}/${model}`))
        .map((key) => key.split("/")[2])
    ),
  ].sort((a, b) => a - b);

  years.forEach((year, index) => {
    const yearButton = document.createElement("button");
    yearButton.textContent = year;

    // Add click event to toggle active state
    yearButton.addEventListener("click", () => {
      const imagesSection = document.getElementById("imagesSection");

      if (yearButton.classList.contains("active")) {
        // If the button is already active, clear the images section and deactivate the button
        imagesSection.innerHTML = "";
        yearButton.classList.remove("active");
      } else {
        // Otherwise, clear the images section, activate the button, and show images
        Array.from(yearsSection.children).forEach((btn) =>
          btn.classList.remove("active")
        );
        imagesSection.innerHTML = "";
        yearButton.classList.add("active");
        showImages(brand, model, year, data);
      }
    });

    yearsSection.appendChild(yearButton);

    // Add the "visible" class with a slight delay for each button
    setTimeout(() => {
      yearButton.classList.add("visible");
    }, index * 100); // Delay based on the index for a staggered effect
  });
}

function showImages(brand, model, year, data) {
  const imagesSection = document.getElementById("imagesSection");

  // Clear previous images
  imagesSection.innerHTML = "";

  // Create and show the preloader
  const imagesPreloader = document.createElement("div");
  imagesPreloader.id = "imagesPreloader";
  imagesPreloader.classList.add("preloader");
  imagesPreloader.innerHTML = '<div class="spinner"></div>';
  imagesSection.appendChild(imagesPreloader);

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

    // Remove the preloader
    imagesPreloader.remove();

    validImages.forEach(({ key, imageUrl }, index) => {
      setTimeout(() => {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = key;

        // Add click event to open modal
        img.addEventListener("click", () =>
          openModal(index, brand, model, year)
        );

        imageContainer.appendChild(img);
        imagesSection.appendChild(imageContainer);
      }, index * 50); // Delay each image by 50ms for a staggered effect
    });
  });
}

// Function to open the modal
function openModal(index, brand, model, year) {
  currentImageIndex = index; // Set the current image index
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalText = document.getElementById("modalText");

  const { key, imageUrl } = currentImages[currentImageIndex];
  modal.classList.add("show"); // Add the 'show' class to fade in the modal
  modalImage.src = imageUrl; // Set the image source
  modalImage.classList.add("active"); // Add the active class for the initial image
  modalText.textContent = `${brand} - ${model} - ${year}`; // Set the text content

  // Add keyboard navigation
  document.addEventListener("keydown", handleKeyNavigation);
}

// Function to close the modal and remove the keyboard event listener
function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.classList.remove("show"); // Remove the 'show' class to fade out the modal

  // Remove keyboard navigation
  document.removeEventListener("keydown", handleKeyNavigation);
}

// Function to handle keyboard navigation
function handleKeyNavigation(event) {
  if (event.key === "ArrowRight") {
    showNextImage(); // Navigate to the next image
  } else if (event.key === "ArrowLeft") {
    showPrevImage(); // Navigate to the previous image
  } else if (event.key === "Escape") {
    closeModal(); // Close the modal when Escape is pressed
  }
}

// Function to navigate to the next image
function showNextImage() {
  const modalImage = document.getElementById("modalImage");

  // Add sliding-out animation for the current image
  modalImage.classList.remove("active");
  modalImage.classList.add("slide-left");

  // Wait for the animation to complete before updating the image
  setTimeout(() => {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length; // Loop to the first image if at the end
    const { key, imageUrl } = currentImages[currentImageIndex];

    // Update the image source and add the entering animation
    modalImage.src = imageUrl;
    modalImage.classList.remove("slide-left");
    modalImage.classList.add("enter-right");

    // Wait for the entering animation to complete, then make it active
    setTimeout(() => {
      modalImage.classList.remove("enter-right");
      modalImage.classList.add("active");
    }, 100); // Match the CSS transition duration
  }, 100); // Match the CSS transition duration
}

// Function to navigate to the previous image
function showPrevImage() {
  const modalImage = document.getElementById("modalImage");

  // Add sliding-out animation for the current image
  modalImage.classList.remove("active");
  modalImage.classList.add("slide-right");

  // Wait for the animation to complete before updating the image
  setTimeout(() => {
    currentImageIndex =
      (currentImageIndex - 1 + currentImages.length) % currentImages.length; // Loop to the last image if at the beginning
    const { key, imageUrl } = currentImages[currentImageIndex];

    // Update the image source and add the entering animation
    modalImage.src = imageUrl;
    modalImage.classList.remove("slide-right");
    modalImage.classList.add("enter-left");

    // Wait for the entering animation to complete, then make it active
    setTimeout(() => {
      modalImage.classList.remove("enter-left");
      modalImage.classList.add("active");
    }, 100); // Match the CSS transition duration
  }, 100); // Match the CSS transition duration
}

// Close the modal when the close button is clicked
document.querySelector(".close").addEventListener("click", closeModal);

// Close the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  const modal = document.getElementById("imageModal");
  if (event.target === modal) {
    closeModal();
  }
});

// Add event listener to the load data button
document.getElementById("loadDataButton").addEventListener("click", loadData);

window.addEventListener("load", () => {
  const generalPreloader = document.getElementById("preloader");
  if (generalPreloader) {
    generalPreloader.style.display = "none"; // Hide the general preloader
  }
});

const arrowLeft = document.querySelector(".left-arrow");
const arrowRight = document.querySelector(".right-arrow");

arrowLeft.addEventListener("click", showPrevImage);
arrowRight.addEventListener("click", showNextImage);
