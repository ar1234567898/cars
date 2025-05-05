fetch("js/image_sources.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const brandsSection = document.getElementById("brandsSection");

    // Extract unique brands from the keys and sort alphabetically
    const brands = [...new Set(Object.keys(data).map((key) => key.split("/")[0]))].sort();

    // Create buttons for each brand
    brands.forEach((brand) => {
      const brandButton = document.createElement("button");
      brandButton.textContent = brand;
      brandButton.addEventListener("click", () => showModels(brand, data));
      brandsSection.appendChild(brandButton);
    });
  })
  .catch((error) => {
    const brandsSection = document.getElementById("brandsSection");
    brandsSection.textContent = `Error: ${error.message}`;
  });

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

  // Filter images for the selected brand, model, and year
  const images = Object.entries(data).filter(([key]) =>
    key.startsWith(`${brand}/${model}/${year}`)
  );

  images.forEach(([key, imageUrl]) => {
    const imageContainer = document.createElement("div"); // Create a container for the image
    imageContainer.classList.add("image-container");

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = key;
    img.onerror = () => (img.src = "img/default.png"); // Fallback for unavailable images

    // Add click event to open modal
    img.addEventListener("click", () => openModal(imageUrl, brand, model, year));

    imageContainer.appendChild(img); // Add the image to the container
    imagesSection.appendChild(imageContainer); // Add the container to the section
  });
}

// Function to open the modal
function openModal(imageUrl, brand, model, year) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalText = document.getElementById("modalText");

  modal.style.display = "block"; // Show the modal
  modalImage.src = imageUrl; // Set the image source
  modalText.textContent = `${brand} - ${model} - ${year}`; // Set the text content
}

// Close the modal when the close button is clicked
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("imageModal").style.display = "none";
});

// Close the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  const modal = document.getElementById("imageModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
