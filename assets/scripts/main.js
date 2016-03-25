(function ( $ ) {

    $.fn.colorshift = function(options) {
      // Setup default options
      var opts = $.extend({
          colors: []
      }, options );

      var errors = {
        style:    'background: #222; color: #bada55',
        intro:    'colorshift.js: ',
        noColors: ' no colors entered',
        notHex:   ' is not a valid hex code'
      };


      /**
       * Send 'em packin if they can't follow the rules
       *
       */
      var colors = opts.colors;

      // No colors, no va
      if(colors.length <= 0) {
        return false;
      }


      /**
       * Vars
       *
       */
      var $body       = $('body');
      var bkgStart    = $body.css('background-color');
      var $window     = $(window);
      var dh          = $(document).height();
      var vh          = $window.height();
      var scrolled    = $window.scrollTop();
      var scrollBlock = (dh - vh);
      var zones       = colors.length;
      var zh          = (scrollBlock / zones);


      function updateAllVars() {
        $window     = $(window);
        dh          = $(document).height();
        scrolled    = $window.scrollTop();
        vh          = $window.height();
        scrollBlock = (dh - vh);
        var zh      = (scrollBlock / zones);    console.log('zh: ' + zh);
      }

      function updateScrollVars() {
        scrolled    = $window.scrollTop();
      }



      /**
       * Initialize
       *
       * Add wrapper and color blocks
       */

      var initialize = function() {
        var controlObject = {};
        var positionCover = 'top: 0; right: 0; bottom: 0; left: 0;';
        var wrapper       = ['<div id="colorshift--wrapper" style="z-index: -1; position: fixed; ' +
                            positionCover + '">'];

        for (i = 0; i < colors.length; i++) {
          var opacity = 'opacity: 0; ';
          var id = 'colorshift--panel--' + (i + 1);
          var start = Math.abs( Math.floor(i * zh) );
          var end = Math.abs( Math.floor((i + 1) * zh) );

          wrapper.push('<div id="' + id + '" class="colorshift--panel" style="position: absolute; ' + opacity +
                      positionCover + 'background-color:' + colors[i] + ';" ' +
                      'data-start="'+ start +'" ' +
                      'data-end="' + end + '"></div>');
        }

        wrapper.push('</div>');
        $body.prepend( wrapper.join('') );
      };

      /**
       * Run operations on scroll
       *
       */
      function scrollOps() {
        if(scrolled > zh) {
          $body.css('background-color', colors[zones-1]);
        } else {
          $body.css('background-color', bkgStart);
        }

        $('.colorshift--panel').each(function(){
          var $this = $(this);
          var start = $this.attr('data-start');
          var end = $this.attr('data-end');

          // Determine if this element is in play
          if( (scrolled >= start) && (scrolled < end) ) {
            var zp = Math.floor(scrolled / zh); // Zones Passed
            var curZ = Math.abs( Math.floor(scrolled - ( zp * zh ) ) );
            var curO = Math.abs(curZ / zh);

            // Update opacity
            $this.css({opacity: curO});

          } else if(scrolled <= start) {
            $this.css({opacity: 0});

          } else if(scrolled > end) {
            $this.css({opacity: 1});

          }
        });
      }





      /**
       * Set it off and keep it updated
       *
       */
      new initialize();

      $(document).ready(function(){
        scrollOps();
      });

      $(window).scroll(function(){
        updateScrollVars();
        scrollOps();
      });

      $(window).resize(function(){
        updateAllVars();
      });

    };

}( jQuery ));


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
    var demoImg       = 'http://j2made.github.io/imgmkr/dist/images/unsplash_matterhorn_full.jpeg';
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
          smallImage: 'allow'
        },
        onImageLoaded: function() {
          curtainDisplay();
        }
      });
    });



    // Update Master Image with FileReader
    // ------------------------------------------------------------------------
    $('#master-file').on('change', function(event){

      // Remove Errors
      $('.error').remove();


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
            // smallImage: 'allow',
            imageState: {
              src: reader.result,
            },
            // onImageError: function() {
            //   var el = this.$el[0].childNodes[3].childNodes[1].className;
            //   var newEl = el.replace(' cropit-image-loading', '');
            //   var elSolo = newEl.replace('cropit-image-preview', '');
            //   var elClass = elSolo.replace(/ /g, '.');
            //   $(elClass).addClass('error-thrown');
            // }
            smallImage: 'allow'
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
      downloadURI(imgData, name);
    });



    // Download all images
    // ------------------------------------------------------------------------
    $('#master-download').click(function(){
      var zip = new JSZip();
      var throwError = false;

      $('.error').remove();

      $imageCropper.each(function(){
        var $this = $(this);

        // If the image is visible
        if( $this.closest('.type-section').css('display') === 'block' ) {
          var img = $this.cropit('export');

          if(img){
            var imgFile = img.replace('data:image/png;base64,', '');
            var name = $this.find('.file-input').attr('name');
            var filename = name + '.png';
            zip.file( filename, imgFile, {base64: true});
          } else {
            var w = $this.width();
            var h = $this.height();

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

  $('#color-block').colorshift({
    colors: ['#fff', '#FEFDF0', '#FDFBDF', '#F0F5DB', '#D3EDF1', '#D1EADF', '#D1EADD', '#DBCEDD', '#DBC8E2' ]
  });

})(jQuery);









