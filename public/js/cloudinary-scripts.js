/**
 * Initializes the Cloudinary upload widget.
 * @param {string} buttonId - The ID of the button that triggers the upload widget.
 * @param {string} inputId - The ID of the input field where the image URL will be stored.
 */
function initializeUploadWidget(buttonId, inputId) {
  // Create a new Cloudinary upload widget
  var widget = cloudinary.createUploadWidget(
    {
      cloudName: "dsqhsfety", // Your Cloudinary cloud name
      uploadPreset: "tribook_preset", // The preset for your upload configuration
    },
    (error, result) => {
      // Handle the widget response
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info); // Log the image information
        console.log("the photo's url: ", result.info.url); // Log the URL of the uploaded photo

        // Set the value of the input field to the image URL
        document.getElementById(inputId).value = result.info.url;
      }
    }
  );

  // Add click event listener to the specified button
  document.getElementById(buttonId).addEventListener(
    "click",
    function () {
      widget.open();
    },
    false
  );
}

// Wait for the DOM to fully load before executing the following code
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the upload widgets for different images
  initializeUploadWidget("upload_widget", "mainPhoto");
  initializeUploadWidget("upload_widget_two", "photoTwo");
  initializeUploadWidget("upload_widget_three", "photoThree");
  initializeUploadWidget("upload_widget_four", "photoFour");
});
