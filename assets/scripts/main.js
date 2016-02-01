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
    var demoImg       = 'http://j2made.github.io/imgmkr/dist/images/unsplash_matterhorn.jpeg';
    var $modal        = $('#js-modal');

    var imgCropLength = $imageCropper.length;
    var cropperCount  = 1;
    var speedIn       = 350;
    var speedOut      = 1500;


    // Navigation
    // ------------------------------------------------------------------------
    var sections = [];
    var inputs = [];
    $('.type-section').each(function(){
      var $this = $(this);
      if( $this.attr('data-title') ) {
        var html = '<a href="#' + $this.attr('id') + '" id="link-' + $this.attr('id') + '" class="nav-item">' + $this.attr('data-title') + '</a>';
        sections.push(html);
        var input = '<input class="option-check" type="checkbox" id="select-' + $this.attr('id') + '" checked="checked" data-target="' + $this.attr('id') + '"/>' +
                    '<label class="type-check" for="select-' + $this.attr('id') + '"><i class="fa fa-check-circle-o"></i>' + $this.attr('data-title') + '</label>';
        inputs.push(input);
      }
    });
    var content = sections.join('');
    $nav.append(content);
    var checkboxes = inputs.join('');
    $('#js-checkboxes form').append(checkboxes);


    // Option Click
    $('.option-check').on('change', function(){
      var $this = $(this);
      var target = $this.attr('data-target');
      $('#' + target).slideToggle(300, function(){
        var $this = $(this);
        if($this.css('display') === 'none'){
          $('#link-' + target).css({
            'opacity': '0.5',
            'pointer-events': 'none'
          });
        } else {
          $('#link-' + target).css({
            'opacity': '1',
            'pointer-events': 'auto'
          });
        }
      });
    });



    // Lock Body until window loaded, add modal class to footer
    // ------------------------------------------------------------------------
    $('body').css('overflow', 'hidden');
    $modal.addClass('modal-init');


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


    // Toggle Modal
    // ------------------------------------------------------------------------
    $('.js-modal-toggle').click(function(){
      $modal.toggleClass('open-modal');
      $('body').toggleClass('open-modal');
    });



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
      $('.download-all').removeClass('blocked');

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
      var throwError = false;

      $(document).remove('.error');

      $imageCropper.each(function(){
        var $this = $(this);

        // If the image is visible
        if( $this.closest('.type-section').css('display') === 'block' ) {
          var img = $this.cropit('export');
          console.log(img);

          if(img){
            var imgFile = img.replace('data:image/png;base64,', '');
            var name = $this.find('.file-input').attr('name');
            var filename = name + '.png';
            zip.file( filename, imgFile, {base64: true});
          } else {
            var w = $this.width();
            var h = $this.height();

            console.log(w);
            console.log(h);
            var error = '<div class="error">' +
                          '<p>Please upload a new image atleast ' + w + 'px wide by ' + h + 'px</p>' +
                        '</div>';
            $this.closest('.img-section').prepend(error);

            throwError = true;
          }
        }

      });

      if(!throwError) {
        var content = zip.generate({type:"blob"});
        saveAs(content, "example.zip");
      } else {
        var toTop = $('.error:visible:first').offset().top;

        $('html, body').animate({
            scrollTop: (toTop - 100)
        }, 1000 );

        return false;
      }
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
    $('body').css('overflow', 'auto');
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









