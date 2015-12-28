(function($) {

  function run_it_all() {

    var $imageCropper = $('.img-section');
    var $curtain      = $('#curtain');
    var $fileInput    = document.getElementById('master-file');
    var $masterImg    = document.getElementById('master-image');

    var imgCropLength = $imageCropper.length;
    var cropperCount  = 1;
    var speedIn       = 350;
    var speedOut      = 1500;


    function curtainDisplay() {
      if(cropperCount < imgCropLength) {
        cropperCount++;
      } else if (cropperCount === imgCropLength) {
        $curtain.fadeOut(speedOut);
      } else {
        return;
      }
    }

    // Initialize Cropit
    $imageCropper.cropit({
      imageState: {
        src: 'http://localhost:3000/dist/images/demo.jpg',
      },
      onImageLoaded: function() {
        curtainDisplay();
      }
    });


    // Update Master Image with FileReader
    $('#master-file').on('change', function(event){

      // Fade in the curtain
      $curtain.fadeIn(speedIn);

      // Master Image to data input
      var file = $fileInput.files[0];
      var imageType = /image.*/;

      if (file.type.match(imageType)) {
        var reader = new FileReader();

        reader.onload = function(event) {

          // Update the master image
          $masterImg.innerHTML = '';
          var img = new Image();
          img.src = reader.result;
          $masterImg.appendChild(img);

          // Destroy the cropit instance
          $imageCropper.cropit('destroy');

          // Reinstate with the new image
          $imageCropper.cropit({
            imageState: {
              src: reader.result,
            },
            onImageLoaded: function() {
              curtainDisplay();
            }
          });
        };

       reader.readAsDataURL(file);
      }
    });

    // Download all images





    $('.export').click(function(event) {
      event.preventDefault();

      var imageData = $(this).parent().cropit('export');
      window.open(imageData);

      // If you wanna force a download
      // var imageForce = imageData.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      // window.open(imageForce);
    });

  }

  $(document).ready(run_it_all);



})(jQuery);