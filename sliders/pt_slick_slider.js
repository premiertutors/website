// Function to load an external script
function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  }
  
  // Load the Slick carousel library and then run the custom script
  loadScript('//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js', function() {
    // Your custom JavaScript code below

  // Carousel
  $(window).on('resize', function(){
    resizeArrows();
  });

  function resizeArrows() {
    var height = $($('.tutor-image')[0]).css('height');
    var parsedHeight = parseInt(height, 10);

    $('.slick-arrow').each(function() {
      $(this).css('top', (parsedHeight/2 - 15) + 'px');
    });
  }
  
  // Carousel code below

  let panel = document.getElementById('pane_1');
  let slickLeftButton = "<img class='slick-prev' src='https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/607cd7bce2745da838252992_chevron-left.svg'>";
  let slickRightButton = "<img class='slick-next' src='https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/601cb92b2fe85c3dc00650dc_chevron-right.svg'>";

$('.carousel').slick({
    dots: false,
    accessibility: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 600, //changed from 600
    infinite: true,
    arrows: true,
    appendArrows: panel,
    slidesToShow: 2,
    slidesToScroll: 1,
    prevArrow: slickLeftButton,
    nextArrow: slickRightButton,
    appendArrows: $('.carousel'),
    appendDots: $('.carousel'),
    responsive: [
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 3
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        arrows: true
      }
    },
    {
      breakpoint: 250, //478
      settings: {
        slidesToShow: 1
      }
    }
  ]
  });
 

  $('.tutor-item').each(function(index, element) {
    var tutorItem = $(this).children(); // .categories value (the cms option selected)
    var div = tutorItem[0];

    $('.carousel').slick('slickAdd', div);

    var isLastElement = index == $('.tutor-item').length -1;
    if (isLastElement) resizeArrows();
  }); 
});