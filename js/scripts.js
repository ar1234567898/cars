fetch("js/image_sources.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const buttonsArea = document.getElementById("buttonsArea");

    // Extract unique brands from the keys
    const brands = [...new Set(Object.keys(data).map((key) => key.split("/")[0]))];

    // Create buttons for each brand
    brands.forEach((brand) => {
      const brandButton = document.createElement("button");
      brandButton.textContent = brand;
      brandButton.addEventListener("click", () => showModels(brand, data, brandButton));
      buttonsArea.appendChild(brandButton);
    });
  })
  .catch((error) => {
    const buttonsArea = document.getElementById("buttonsArea");
    buttonsArea.textContent = `Error: ${error.message}`;
  });

// Function to show models for a selected brand
function showModels(brand, data, brandButton) {
  // Check if models section already exists
  if (brandButton.nextElementSibling && brandButton.nextElementSibling.classList.contains("models-section")) {
    brandButton.nextElementSibling.remove(); // Remove existing models section
    return;
  }

  // Create a new section for models
  const modelsSection = document.createElement("div");
  modelsSection.classList.add("models-section");

  // Extract unique models for the selected brand
  const models = [
    ...new Set(
      Object.keys(data)
        .filter((key) => key.startsWith(brand))
        .map((key) => key.split("/")[1])
    ),
  ];

  // Add model buttons to the new section
  models.forEach((model) => {
    const modelButton = document.createElement("button");
    modelButton.textContent = model;
    modelButton.addEventListener("click", () => showYears(brand, model, data, modelButton));
    modelsSection.appendChild(modelButton);
  });

  // Insert the models section after the brand button
  brandButton.after(modelsSection);
}

// Function to show years for a selected model
function showYears(brand, model, data, modelButton) {
  // Check if years section already exists
  if (modelButton.nextElementSibling && modelButton.nextElementSibling.classList.contains("years-section")) {
    modelButton.nextElementSibling.remove(); // Remove existing years section
    return;
  }

  // Create a new section for years
  const yearsSection = document.createElement("div");
  yearsSection.classList.add("years-section");

  // Extract unique years for the selected model
  const years = [
    ...new Set(
      Object.keys(data)
        .filter((key) => key.startsWith(`${brand}/${model}`))
        .map((key) => key.split("/")[2])
    ),
  ];

  // Add year buttons to the new section
  years.forEach((year) => {
    const yearButton = document.createElement("button");
    yearButton.textContent = year;
    yearButton.addEventListener("click", () => showImages(brand, model, year, data, yearButton));
    yearsSection.appendChild(yearButton);
  });

  // Insert the years section after the model button
  modelButton.after(yearsSection);
}

// Function to show images for a selected year
function showImages(brand, model, year, data, yearButton) {
  // Check if images section already exists
  if (yearButton.nextElementSibling && yearButton.nextElementSibling.classList.contains("images-section")) {
    yearButton.nextElementSibling.remove(); // Remove existing images section
    return;
  }

  // Create a new section for images
  const imagesSection = document.createElement("div");
  imagesSection.classList.add("images-section");

  // Filter images for the selected brand, model, and year
  const images = Object.entries(data).filter(([key]) =>
    key.startsWith(`${brand}/${model}/${year}`)
  );

  // Display images
  images.forEach(([key, imageUrl]) => {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = key;
    img.style.maxWidth = "200px";
    img.style.margin = "10px";
    imagesSection.appendChild(img);
  });

  // Insert the images section after the year button
  yearButton.after(imagesSection);
}
