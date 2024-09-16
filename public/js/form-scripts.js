
document.addEventListener("DOMContentLoaded", function () {
  // Function to capitalize the first letter of each word
  function capitalizeFirstLetterOfEachWord(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Function to set up event listeners for a given input field
  function setupCapitalizationForInput(inputId) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.addEventListener("input", function () {
        inputElement.value = capitalizeFirstLetterOfEachWord(inputElement.value);
      });

      inputElement.addEventListener("blur", function () {
        inputElement.value = capitalizeFirstLetterOfEachWord(inputElement.value);
      });
    }
  }

  // List of input field IDs to apply the capitalisation
  const inputFieldIds = [
    "title",
    "mainPhotoCaption",
    "photoTwoCaption",
    "photoThreeCaption",
    "photoFourCaption",
    "city",
    "province",
    "location"
  ];

  // Set up event listeners for all specified input fields
  inputFieldIds.forEach(setupCapitalizationForInput);
});
