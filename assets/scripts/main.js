(function($) {

  function run_it_all() {

    // Variables
    // ------------------------------------------------------------------------
    var $imageCropper = $('.img-section');
    var $curtain      = $('#curtain');
    var $fileInput    = document.getElementById('master-file');
    var $masterImg    = document.getElementById('master-image');
    var $profiles     = $('#profile-images');
    var $nav          = $('#site-nav');
    var demoImg      = 'http://j2toolkit.github.io/imgmkr/dist/images/demo.jpg';

    var imgCropLength = $imageCropper.length;
    var cropperCount  = 1;
    var speedIn       = 350;
    var speedOut      = 1500;


    // Navigation
    // ------------------------------------------------------------------------
    var sections = [];
    $('.type-section').each(function(){
      var $this = $(this);
      var html = '<a href="#' + $this.attr('id') + '" class="nav-item">' + $this.attr('data-title') + '</a>';
      sections.push(html);
    });
    var content = sections.join('');
    $nav.append(content);

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
    img.src = demoImg;
    $masterImg.appendChild(img);



    // Initialize Cropit
    // ------------------------------------------------------------------------
    $(window).load(function(){
      $imageCropper.cropit({
        imageState: {
          src: demoImg,
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
    var dlClick = 0;

    function downloadURI(uri, name) {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      link.click();
    }

    $('.export').click(function() {

      var $this = $(this);
      var $editor = $this.closest('.img-section');
      var name = $editor.find('.file-input').attr('name');

      var imgSrc = $editor.cropit('imageSrc');
      var offset = $editor.cropit('offset');
      var zoom = $editor.cropit('zoom');
      var previewSize = $editor.cropit('previewSize');
      var exportZoom = $editor.cropit('exportZoom');
      var picaImageData = '';


      // Draw image in original size on a canvas
      var originalCanvas = document.createElement('canvas');
      originalCanvas.width = previewSize.width / zoom;
      originalCanvas.height = previewSize.height / zoom;
      var ctx = originalCanvas.getContext('2d');
      ctx.drawImage(img, offset.x / zoom, offset.y / zoom);

      // Use pica to resize image and paint on destination canvas
      var zoomedCanvas = document.createElement('canvas');
      zoomedCanvas.width = previewSize.width * exportZoom;
      zoomedCanvas.height = previewSize.height * exportZoom;
      pica.resizeCanvas(originalCanvas, zoomedCanvas, function(err) {

        if (err) {
          return console.log(err);
        }
        // Resizing completed, read resized image data
        picaImageData = zoomedCanvas.toDataURL();

        // Force download
        downloadURI(picaImageData, name);
      });
    });


    $('#master-download').click(function(){
      var zip = new JSZip();
      $imageCropper.each(function(){
        var $this = $(this);
        var img = $this.cropit('export');
        var imgFile = img.replace('data:image/png;base64,', '');
        var name = $this.find('.file-input').attr('name');
        var filename = name + '.png';

        zip.file( filename, imgFile, {base64: true});

      });

      var content = zip.generate({type:"blob"});
      saveAs(content, "example.zip");
    });


  }

  $(document).ready(run_it_all);



})(jQuery);