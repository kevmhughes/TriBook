
/* Capitalise the first letter of words in the form inputs */
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


/* set/get local storage filter value */
window.onload = () => {
  const defaultValue = localStorage.getItem("sortByValue") || "mostRecent";

  // Set the initial value of the select element
  const sortByElement = document.getElementById('sortBy');
  sortByElement.value = defaultValue;

  // Add event listener for change event
  sortByElement.addEventListener("change", function () {
      const sortByValue = this.value;

      // Store the new value in local storage
      localStorage.setItem("sortByValue", sortByValue);
  });
};

// Send error message when search start date is later than end date
document.getElementById('searchForm').addEventListener('submit', function(event) {
  const startDateInput = document.getElementById('startDate').value;
  const endDateInput = document.getElementById('endDate').value;
  const dateErrorMessage = document.getElementById('dateErrorMessage');
  const searchErrorMessage = document.getElementById("search-error");

  if (dateErrorMessage) {
    dateErrorMessage.style.display = 'none'; // Ensure the error message is hidden initially
  }

  if (searchErrorMessage) {
    searchErrorMessage.style.display = 'none'; // Hide search error message if applicable
  }

  if (startDateInput && endDateInput) {
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (startDate > endDate) {
      if (dateErrorMessage) {
        dateErrorMessage.style.display = 'block'; // Show error message
      }
      event.preventDefault(); // Prevent form submission
    }
  }
});

