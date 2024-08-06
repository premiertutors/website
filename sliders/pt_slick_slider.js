// Load the Slick carousel library
(function loadSlickLibrary() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
    script.onload = initializeCarousel;
    document.head.appendChild(script);
  })();
  
  // Carousel functions
  function resizeArrows() {
    var height = $($('.tutor-image')[0]).css('height');
    var parsedHeight = parseInt(height, 10);
  
    $('.slick-arrow').each(function() {
      $(this).css('top', (parsedHeight/2 - 15) + 'px');
    });
  }
  
  function initializeCarousel() {
    $(window).on('resize', resizeArrows);
  
    let panel = document.getElementById('pane_1');
    let slickLeftButton = "<img class='slick-prev' src='https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/607cd7bce2745da838252992_chevron-left.svg'>";
    let slickRightButton = "<img class='slick-next' src='https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/601cb92b2fe85c3dc00650dc_chevron-right.svg'>";
  
    $('.carousel').slick({
      dots: false,
      accessibility: true,
      autoplay: true,
      autoplaySpeed: 5000,
      speed: 600,
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
          breakpoint: 250,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  
    $('.tutor-item').each(function(index, element) {
      var tutorItem = $(this).children();
      var div = tutorItem[0];
  
      $('.carousel').slick('slickAdd', div);
  
      var isLastElement = index == $('.tutor-item').length - 1;
      if (isLastElement) resizeArrows();
    });
  }