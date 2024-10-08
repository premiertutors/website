// // Load the Slick carousel library
// (function loadSlickLibrary() {
//     var script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = '//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
//     script.onload = initializeCarousels;
//     document.head.appendChild(script);
// })();

// // Core function with default settings
// function initializeCarousel(options) {
//     var defaultSettings = {
//         targetDiv: '.testimonial-carousel',
//         cmsItem: '.testimonial-item',
//         imageDivClass: '.testimonial',
//         arrowPosition: 'side', // New option for arrow position
//         responsiveSettings: [
//             {
//                 breakpoint: 991,
//                 settings: {
//                     slidesToShow: 3
//                 }
//             },
//             {
//                 breakpoint: 767,
//                 settings: {
//                     slidesToShow: 2,
//                     arrows: true
//                 }
//             },
//             {
//                 breakpoint: 250,
//                 settings: {
//                     slidesToShow: 1
//                 }
//             }
//         ],
//         dots: false,
//         accessibility: true,
//         autoplay: true,
//         autoplaySpeed: 5000,
//         speed: 600,
//         infinite: true,
//         arrows: true,
//         prevArrow: "<img class='slick-prev' src='https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/607cd7bce2745da838252992_chevron-left.svg'>",
//         nextArrow: "<img class='slick-next' src='https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/601cb92b2fe85c3dc00650dc_chevron-right.svg'>"
//     };

//     // Merge default settings with custom options
//     var settings = { ...defaultSettings, ...options };

//     $(window).on('resize', function() {
//         resizeArrows(settings.targetDiv, settings.cmsItem, settings.imageDivClass, settings.arrowPosition);
//     });

//     $(settings.targetDiv).slick({
//         dots: settings.dots,
//         accessibility: settings.accessibility,
//         autoplay: settings.autoplay,
//         autoplaySpeed: settings.autoplaySpeed,
//         speed: settings.speed,
//         infinite: settings.infinite,
//         arrows: settings.arrows,
//         appendArrows: settings.targetDiv,
//         slidesToShow: 2,
//         slidesToScroll: 1,
//         prevArrow: settings.prevArrow,
//         nextArrow: settings.nextArrow,
//         appendArrows: $(settings.targetDiv),
//         appendDots: $(settings.targetDiv),
//         responsive: settings.responsiveSettings
//     });

//     $(settings.cmsItem).each(function(index, element) {
//         var tutorItem = $(this).children();
//         var div = tutorItem[0];

//         $(settings.targetDiv).slick('slickAdd', div);

//         var isLastElement = index == $(settings.cmsItem).length - 1;
//         if (isLastElement) resizeArrows(settings.targetDiv, settings.cmsItem, settings.imageDivClass, settings.arrowPosition);
//     });
// }

// // Function to resize arrows
// function resizeArrows(targetDiv, cmsItem, imageDivClass, arrowPosition) {
//     var height = $($(targetDiv).find(imageDivClass)[0]).css('height');
//     var parsedHeight = parseInt(height, 10);

//     $(targetDiv).find('.slick-arrow').each(function() {
//         if (arrowPosition === 'side') {
//             $(this).css({
//                 'top': (parsedHeight / 2 - 15) + 'px',
//                 'left': '',
//                 'right': ''
//             });
//         } else if (arrowPosition === 'bottom') {
//             $(this).css({
//                 'top': '',
//                 'bottom': '10px',
//                 'left': $(this).hasClass('slick-prev') ? 'calc(50% - 30px)' : 'calc(50% + 30px)',
//                 'right': '',
//                 'transform': 'translateX(-50%)'
//             });
//         }
//     });
// }

// // Initialize multiple carousels with different settings
// function initializeCarousels() {
//     // Carousel 1
//     initializeCarousel({
//         targetDiv: '.carousel',
//         cmsItem: '.tutor-item',
//         imageDivClass: '.tutor-image',
//         arrowPosition: 'side', // Keep arrows on the side
//         responsiveSettings: [
//             {
//                 breakpoint: 991,
//                 settings: {
//                     slidesToShow: 3
//                 }
//             },
//             {
//                 breakpoint: 767,
//                 settings: {
//                     slidesToShow: 2
//                 }
//             },
//             {
//                 breakpoint: 250,
//                 settings: {
//                     slidesToShow: 1
//                 }
//             }
//         ]
//     });
//     // Carousel 2
//     initializeCarousel({
//         targetDiv: '.testimonial-carousel',
//         cmsItem: '.testimonial-item',
//         imageDivClass: '.testimonial',
//         arrowPosition: 'bottom', // Move arrows to the bottom
//         speed: 1200,
//         autoplaySpeed: 10000,
//         responsiveSettings: [
//             {
//                 breakpoint: 991,
//                 settings: {
//                     slidesToShow: 2
//                 }
//             },
//             {
//                 breakpoint: 767,
//                 settings: {
//                     slidesToShow: 1
//                 }
//             },
//             {
//                 breakpoint: 250,
//                 settings: {
//                     slidesToShow: 1
//                 }
//             }
//         ]
//     });
// }