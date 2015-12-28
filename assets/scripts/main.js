(function($) {

  function run_it_all() {

    // Variables
    // ------------------------------------------------------------------------
    var $imageCropper = $('.img-section');
    var $curtain      = $('#curtain');
    var $fileInput    = document.getElementById('master-file');
    var $masterImg    = document.getElementById('master-image');
    var $profiles     = $('#profile-images');

    var imgCropLength = $imageCropper.length;
    var cropperCount  = 1;
    var speedIn       = 350;
    var speedOut      = 1500;


    // Markup
    // $.getJSON( "dist/content.json", function( data ) {
    //   var html;
    //   console.log(data);

    //   // Profiles
    //   if(data.profiles) {
    //     var profiles = data.profiles;
    //     console.log(profiles);
    //     html += '<section id="profile-images" class="type-wrapper">';

    //     $.each(profiles.networks, function(i, item) {
    //       console.log(i);
    //       console.log(item);

    //       html += '<section class="img-section">' +
    //                 '<header class="img-section--title">' +
    //                     '<p>' + item.name + ' Profile: ' + item.width + ' x ' + item.height + '</p>' +
    //                 '</header>' +
    //                 '<div class="cropit-image-preview img-' + i + '--profile" style="height: ' + item.height + 'px; width: ' + item.width + 'px;"></div>' +
    //                 '<div class="img-section--ui">' +
    //                   '<input type="range" class="cropit-image-zoom-input" />' +
    //                   '<input type="file" name="' + i + '-profile" id="' + i + '-profile" class="cropit-image-input file-input" />' +
    //                     '<label class="file-label" for="' + i + '-profile"><i class="fa fa-image"></i>Use Custom Image</label>' +
    //                   '<button class="dl export">Download Single Image</button>' +
    //                 '</div>' +
    //               '</section>';
    //     });

    //     html += '</section>';

    //     $profiles.append(html);
    //   }

    // });


    // Show or hide curtain
    // ------------------------------------------------------------------------
    function curtainDisplay() {
      if(cropperCount < imgCropLength) {
        cropperCount++;
      } else if (cropperCount === imgCropLength) {
        $curtain.fadeOut(speedOut);
      } else {
        return;
      }
    }



    // Load demo image into Master Image
    // ------------------------------------------------------------------------
    var img = new Image();
    img.src = 'http://localhost:3000/dist/images/demo.jpg';
    $masterImg.appendChild(img);



    // Initialize Cropit
    // ------------------------------------------------------------------------
    $(window).load(function(){
      $imageCropper.cropit({
        imageState: {
          src: 'http://localhost:3000/dist/images/demo.jpg',
        },
        onImageLoaded: function() {
          curtainDisplay();
        }
      });
    });



    // Update Master Image with FileReader
    // ------------------------------------------------------------------------
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
    // ------------------------------------------------------------------------
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