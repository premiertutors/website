// Load the Slick carousel library
(function loadSlickLibrary() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
    script.onload = initializeCarousels;
    document.head.appendChild(script);
})();

function initializeCarousel(targetDiv, cmsItem) {
    var $targetDiv = $(targetDiv);
    var $cmsItems = $(cmsItem);

    // Initialize Slick
    $targetDiv.slick({
        dots: false,
        arrows: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: "<img class='slick-prev' src='https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/607cd7bce2745da838252992_chevron-left.svg'>",
        nextArrow: "<img class='slick-next' src='https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/601cb92b2fe85c3dc00650dc_chevron-right.svg'>",
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
                    slidesToShow: 2
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

    // Add CMS items to the carousel
    $cmsItems.each(function() {
        var $item = $(this).children().first();
        $targetDiv.slick('slickAdd', $item);
    });

    // Resize arrows
    function resizeArrows() {
        var height = $targetDiv.find('.tutor-image').first().height();
        $targetDiv.find('.slick-arrow').css('top', (height / 2 - 15) + 'px');
    }

    // Call resizeArrows on window resize and after initialization
    $(window).on('resize', resizeArrows);
    resizeArrows();
}

function initializeCarousels() {
    // Initialize carousels here
    initializeCarousel('.carousel', '.tutor-item');
    // You can add more carousels here, e.g.:
    // initializeCarousel('.another-carousel', '.another-cms-item');
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeCarousels);