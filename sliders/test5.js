// Load the Slick carousel library
(function loadSlickLibrary() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
    script.onload = initializeCarousels;
    document.head.appendChild(script);
})();

// Core function with default settings
function initializeCarousel(options) {
    var defaultSettings = {
        targetDiv: '.carousel',
        cmsItem: '.tutor-item',
        imageDivClass: '.tutor-image',
        arrowPlacement: 'side', // New option: 'side' or 'bottom'
        responsiveSettings: [
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
        ],
        dots: false,
        accessibility: true,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 600,
        infinite: true,
        arrows: true,
        prevArrow: "<img class='slick-prev' src='https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/607cd7bce2745da838252992_chevron-left.svg'>",
        nextArrow: "<img class='slick-next' src='https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/601cb92b2fe85c3dc00650dc_chevron-right.svg'>"
    };

    // Merge default settings with custom options
    var settings = { ...defaultSettings, ...options };

    $(window).on('resize', function() {
        if (settings.arrowPlacement === 'side') {
            resizeArrows(settings.targetDiv, settings.cmsItem, settings.imageDivClass);
        }
    });

    var slickOptions = {
        dots: settings.dots,
        accessibility: settings.accessibility,
        autoplay: settings.autoplay,
        autoplaySpeed: settings.autoplaySpeed,
        speed: settings.speed,
        infinite: settings.infinite,
        arrows: settings.arrows,
        appendArrows: settings.targetDiv,
        slidesToShow: 2,
        slidesToScroll: 1,
        prevArrow: settings.prevArrow,
        nextArrow: settings.nextArrow,
        appendDots: $(settings.targetDiv),
        responsive: settings.responsiveSettings
    };

    if (settings.arrowPlacement === 'bottom') {
        slickOptions.appendArrows = $('<div class="slick-arrow-container">').appendTo(settings.targetDiv);
    }

    $(settings.targetDiv).slick(slickOptions);

    $(settings.cmsItem).each(function(index, element) {
        var tutorItem = $(this).children();
        var div = tutorItem[0];

        $(settings.targetDiv).slick('slickAdd', div);

        var isLastElement = index == $(settings.cmsItem).length - 1;
        if (isLastElement && settings.arrowPlacement === 'side') {
            resizeArrows(settings.targetDiv, settings.cmsItem, settings.imageDivClass);
        }
    });

    if (settings.arrowPlacement === 'bottom') {
        $(settings.targetDiv).addClass('arrows-bottom');
    }
}

// Function to resize arrows
function resizeArrows(targetDiv, cmsItem, imageDivClass) {
    var height = $($(targetDiv).find(imageDivClass)[0]).css('height');
    var parsedHeight = parseInt(height, 10);

    $(targetDiv).find('.slick-arrow').each(function() {
        $(this).css('top', (parsedHeight / 2 - 15) + 'px');
    });
}

// Initialize multiple carousels with different settings
function initializeCarousels() {
    // Carousel 1 (Tutors)
    initializeCarousel({
        targetDiv: '.carousel',
        cmsItem: '.tutor-item',
        imageDivClass: '.tutor-image',
        arrowPlacement: 'side',
        responsiveSettings: [
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

    // Carousel 2 (Testimonials)
    initializeCarousel({
        targetDiv: '.testimonial-carousel',
        cmsItem: '.testimonial-item',
        imageDivClass: '.testimonial',
        arrowPlacement: 'bottom',
        speed: 1200,
        responsiveSettings: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
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
}