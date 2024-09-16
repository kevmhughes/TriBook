      function initializeUploadWidget(buttonId, inputId) {
        var widget = cloudinary.createUploadWidget({
          cloudName: 'dsqhsfety',
          uploadPreset: 'tribook_preset' // Configure this according to your settings
        }, (error, result) => {
          if (!error && result && result.event === "success") {
            console.log('Done! Here is the image info: ', result.info);
            console.log("the photo's url: ", result.info.url);

            document.getElementById(inputId).value = result.info.url;
          }
        });

        document.getElementById(buttonId).addEventListener("click", function () {
          widget.open();
        }, false);
      }

      document.addEventListener("DOMContentLoaded", function () {
        initializeUploadWidget("upload_widget", "mainPhoto");
        initializeUploadWidget("upload_widget_two", "photoTwo");
        initializeUploadWidget("upload_widget_three", "photoThree");
        initializeUploadWidget("upload_widget_four", "photoFour");
      });
