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
    var demoImg      = 'http://j2made.github.io/imgmkr/dist/images/unsplash_matterhorn.jpeg';

    var imgCropLength = $imageCropper.length;
    var cropperCount  = 1;
    var speedIn       = 350;
    var speedOut      = 1500;


    // Navigation
    // ------------------------------------------------------------------------
    var sections = [];
    $('.type-section').each(function(){
      var $this = $(this);
      if( $this.attr('data-title') ) {
        var html = '<a href="#' + $this.attr('id') + '" class="nav-item">' + $this.attr('data-title') + '</a>';
        sections.push(html);
      }
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



    // Create Download Link
    // ------------------------------------------------------------------------
    function downloadURI(uri, name) {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      link.click();
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



    // Download single image
    // ------------------------------------------------------------------------
    $('.export').click(function() {
      var $this = $(this);
      var $editor = $this.closest('.img-section');
      var imgData = $editor.cropit('export');
      var name = $editor.find('.file-input').attr('name');
      console.log(imgData);
      downloadURI(imgData, name);
    });



    // Download all images
    // ------------------------------------------------------------------------
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


    var $header = $('#js-header');
    var $navigation = $('#js-navigation');
    var headerH = $header.height();

    $(window).scroll(function(){
      if($(window).scrollTop() >= headerH ) {
        $navigation.addClass('fix-it');
      } else {
        $navigation.removeClass('fix-it');
      }
    });


  }

  $(document).ready(run_it_all);

  $(window).load(function(){

    $('#js-header').css('height', '95vh');
    $('#smooth-scroll').fadeIn(750);

  });

  $(window).scroll(function(){

    $('.type-section').each(function(){
      var $this = $(this);
      var thisColor = $this.attr('data-color');

      // Return if no color or if color has already been processed
      if(!thisColor) { return; }

      var elTop = $this.offset().top;
      var wBot = $(window).height() + $(window).scrollTop();

      if(elTop > wBot) {
        $('body').css('background-color', thisColor);
        return false;
      }
    });
  });

})(jQuery);









