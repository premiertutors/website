function performSearch(input) {
    var value = format(input.val());
    var index = input.index('input[type=text]');
    var list = lists[index];
  
    if (value != '') {
      list.find('.mix').each(function() {
        var mix = $(this);
        var classList = mix.attr('class');
        // Check whether div contains search class
        if (classList.includes(value) && !classList.includes('show')) {
          // Check whether div contains tag class
          mix.addClass('show');
          if (mix.hasClass('hide')) {
            mix.removeClass('hide');
          }
        }
        if (!classList.includes(value) && !classList.includes('hide') ) {
          // Hide the div
          mix.addClass('hide');
          if (mix.hasClass('show')) {
            mix.removeClass('show');
          }
        }
      });
  
      // The below logic is for local searches - i.e. search that takes into account current selectors
      var currentSelectors = mixitupContainers[index].getState().activeFilter.selector;
      var newSelectors = currentSelectors;
  
      if (currentSelectors == '.mix') {
        newSelectors = '.show';
      }
      else if (!currentSelectors.includes('.show')) {
        newSelectors = currentSelectors + '.show';
      }
      mixitupContainers[index].filter(newSelectors);
  
    } else {
      var currentSelectors = mixitupContainers[index].getState().activeFilter.selector;
      var newSelectors = currentSelectors.replace('.show', '');
      
      if (newSelectors == '') newSelectors = 'all';
      mixitupContainers[index].filter(newSelectors);
    }
  }
  
  // Function for getting URL data in JSON form
  function getUrlData(siteURL, container, link) {
    $.ajax({
        url: "https://api.linkpreview.net",
        dataType: 'jsonp',
        data: {q: siteURL, key: '205cb4ca3fb3a5b118d6f3cfc6b3b289'},
        success: function (data) {
          var parameters;
  
          if (!data.description.includes('response status')) { // Try getting the data automatically (response status means invalid response)
            parameters = {
              'title': data.title.replace(/['"]+/g, ''),
              'desc': data.description.replace(/['"]+/g, ''),
              'image': data.image.replace(/['"]+/g, ''),
              'url': data.url.replace(/['"]+/g, '')
            };
          }
          else { // If this fails, use the data provided
            parameters = {
              'title': link.dataset.title,
              'desc': link.dataset.desc,
              'image': 'hidden',
              'url': link.dataset.url
            };
          }
  
          var preview = generateUrlPreview(parameters, container);
        
          return data;
        },
        error: function(e) {
          var parameters = {
            'title': link.dataset.title,
            'desc': link.dataset.desc,
            'image': 'hidden',
            'url': link.dataset.url
          };
  
          var preview = generateUrlPreview(parameters, container);
          return 'error';
        }   
    });
  }
  
  // Function for generating previews
  function generateUrlPreview(data, container) {
    // Create elements
    var linkWrapper = $('<a href="' + data['url'] + '"></a>')
    var previewWrapper = $('<div class="url-preview-wrapper"></div>');
    var dataWrapper = $('<div class="url-data-wrapper"></div>');
    var title = $('<p class="url-title">' + data['title'] + '</p>');
    var desc = $('<p class="url-desc">' + data['desc'] + '</p>');
    var url = $('<p class="url-link">' + data['url'] + '</p>');
    var urlImage = $('<img class="url-link-image" src="https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/606e70c3ee2dbc38ec1130d8_link.svg">');
    
    // Add elements to wrappers
    dataWrapper.append(title, desc, urlImage, url);
    
    // If the preview falls back, don't display an image
    if (data['image'] != 'hidden') {
      var image = $('<img class="url-image" src="' + data['image'] + '">');
      previewWrapper.append(dataWrapper, image);
    } else {
      previewWrapper.append(dataWrapper);
    }
  
    linkWrapper.append(previewWrapper);
  
    container.html('');
    container.append(linkWrapper);
  }
  
  // Applies search class to divs
  function applySearchClass(groupNumber, selectNumber, select) {
    var classString = '';
    var preString = ''; // Contains other info like location
  
    if ($('#location-field').length) {
      var value = $('#location-field').val();
      if (value) preString = '.' + value;
    }
  
    if (selectNumber > 1) {
      for (var i = 0; i < selectNumber; i++) {
        var id = '#select-' + groupNumber + '-' + (i+1);
        if ($(id).val()) {
          classString += ('.l' + i + '-' + $(id).val());
        }
      }
    } else {
      if (!select.val()) {
        classString = 'all';
      } else {
        classString = '.l' + (selectNumber-1) + '-' + select.val();
      }
    }
    
    if (classString == 'all' && preString) {
      classString = '';
    } 
  
    var index = groupNumber - 1;
  
    mixitupContainers[index].filter(preString + classString);
    return (preString + classString);
  }
  
  // Clears all proceeding selects when 'x' icon is pressed
  function proceedingSelect(groupNumber, selectNumber, hideNextSelect) {
    var id = '#select-' + groupNumber + '-' + selectNumber;
    var nextSelect = $(id);
  
    if (nextSelect.length) { // Next select menu does exist
      nextSelect.val('');
      lightenSelect(nextSelect.parent());
  
      if (hideNextSelect) {
        hideSelect(nextSelect.parent());
      } else {
        showSelect(nextSelect.parent());
      }
      proceedingSelect(groupNumber, selectNumber + 1, true)
    }
  }
  
  function unhideOptions(selectNumber) {
    $('option').each(function() {
      var id = $(this).parents('.select-field').attr('id');
      var number = parseInt(id.split('-')[2]);
  
      if (selectNumber == number) {
        if( ($(this).parent().is('span')) ) $(this).unwrap();
      }
    });
  }
  
  function format(string) {
    return string.replace(/'/g, '')
                .replace(/\s+|_/g, '-')
                .replace(/\\|\//g,'')
                .toLowerCase();
  }
  
  // iframe scaler
  
  $(function() {
      $('.w-iframe').each(function() {
          var $wrap = $(this);
          var initWrapHeight = $wrap.height();
          function iframeScaler(){
              var wrapWidth = $('.rich-text-block').width(); // width of the wrapper
              var wrapHeight = $wrap.height();
              var childWidth = $wrap.children('iframe').width(); // width of child iframe
              var childHeight = $wrap.children('iframe').height(); // child height
              var wScale = wrapWidth / childWidth;
              var hScale = wrapHeight / childHeight;
              var scale = Math.min(wScale,hScale);  // get the lowest ratio
              //var scale = wScale;
              $wrap.children('iframe').css({'transform': 'scale('+scale+')', 'transform-origin': 'left top' });  // set scale
  
              var newHeight = (Math.min(wScale, 1)*initWrapHeight);
              console.log(initWrapHeight);
              $wrap.css('height', newHeight + 'px');
       
  
          };
          $(window).on('resize', iframeScaler);
          $(document).ready( iframeScaler);
      });
  });
  
  function getUrlParams() {
    // This function extracts the url parameters and sets the various page inputs
  
    var urlParams;
    (window.onpopstate = function () {
      var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);
  
      urlParams = {};
      while (match = search.exec(query))
         urlParams[decode(match[1])] = format(decode(match[2]));
    })();
  
    setUrlParams(urlParams);
  }
  
  function setUrlParams(urlParams) {
    var container = $('body');
    var index = getActiveTab();
  
    var tabs = $('.page-tab-button');
  
    if (tabs.length) { // if tabs exist on this page
      var tab = parseInt(urlParams.tab);
  
      if (tabs.length != numLists) { // First tab contains a list
        index -= 1;
      }
  
      if (urlParams.tab) {    
        var tabButton = $($('.page-tab-button')[tab-1]);
        tabButton.triggerHandler('click');
      }
    }
  
    for (const param in urlParams) {
      if (param.substring(0, 3) == 'cat') { // Category of select to change
        var selectNumber = param.substring(3, 4);
  
        var id = '#select-' + (index) + '-' + selectNumber;
  
        var select = container.find(id);
        select.val(urlParams[param]);
  
        if (select) selectDidChange(select, false);
      }
  
      if (param == 'search') {
        var input = container.find('.search-input');
        input.val(urlParams[param]);
        if (input) performSearch(input);
      }
    }
  }
  
  // Config options
  // How configs work: Key used to identify page, array contains multiple Premsearches in one page
  
  var changing = false;
  function restoreConfig(index) {
    changing = true;
    for (var i = 0; i < config[index].length; i++) {
      var selectNumber = config[index][i].select;
      var id = '#select-' + (index+1) + '-' + selectNumber;
      var select = $('body').find(id);
      var value = config[index][i].value;
  
      if (select && value != '') {
        select.val(value);
        selectDidChange(select, false);
      }
    }
    changing = false;
  }
  
  function updateConfig(groupNumber, selectNumber, select) {
    // Set the config value to the select val
    if (changing == false) {
      if (!!select.val()) {
        config[groupNumber-1][selectNumber-1].value = select.val();
      } else {
        config[groupNumber-1][selectNumber-1].value = '';
      }
  
      // Clear all proceeding configs
      for (var i = 0; i < config[groupNumber-1].length; i++) {
        if (i > selectNumber-1) {
          config[groupNumber-1][i].value = '';
        }
      }
      sessionStorage.setItem(key, JSON.stringify(config));
    }
  }
  
  function getIndicesOf(searchStr, str, caseSensitive) {
      var searchStrLen = searchStr.length;
      if (searchStrLen == 0) {
          return [];
      }
      var startIndex = 0, index, indices = [];
      if (!caseSensitive) {
          str = str.toLowerCase();
          searchStr = searchStr.toLowerCase();
      }
      while ((index = str.indexOf(searchStr, startIndex)) > -1) {
          indices.push(index);
          startIndex = index + searchStrLen;
      }
      return indices;
  }
  
  // Creating the data tree
  function createTree(raw) {
    data = []
    rawData = raw;
    var loops = 0;
  
    for (var i = rawData.length - 1; i >= 0; i--) {
      if (rawData[i][0].reference == '') {
        data.push({ 'parent': rawData[i][1] });
        rawData.splice(i, 1);
      }  
    }
  
    while (rawData.length > 0 && loops < 1000) {
      rawData.forEach(function (node, index) {
        searchAndAttachChild(node, data, 2);
      });
      loops++;
      //console.log(rawData[0]);
    }
    
    return {'structure': data,
            'depth': maxDepth };
  }
  
  // CreateTree helper function
  function searchAndAttachChild(child, tree, depth) {
    if (!tree) {
      return;
    }
    
    if (depth > maxDepth) {
      maxDepth = depth;
    }
    // maxDepth = Math.max(depth, maxDepth);
    
    tree.forEach(function (node) {
      if (child[0].reference == node.parent.reference) {
        if (node.child) {
          node.child.push({ 'parent': child[1] });
          var index = rawData.indexOf(child);
          var spliced = rawData.splice(index, 1);
        } else {
          node.child = [{ 'parent': child[1] }];
          var index = rawData.indexOf(child);
          rawData.splice(index, 1);
        }
      } else {
        searchAndAttachChild(child, node.child, depth+1);
      }
    });
  }

<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>

MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  }
};

// <!-- Missive Live Chat -->
  (function(d, w) {
    w.MissiveChatConfig = {
      "id": "19c7f2ab-4afe-4cc7-bf0d-cd59d45afe31"
    };

    var s = d.createElement('script');
    s.async = true;
    s.src = 'https://webchat.missiveapp.com/' + w.MissiveChatConfig.id + '/missive.js';
    if (d.head) d.head.appendChild(s);
  })(document, window);
// </script>
// <!-- /Missive Live Chat -->

// <script>

// Global variables
var treeData = [];
var nodesAdded = 0;
var data;
var rawData;
var maxDepth = 0;
var selects = [];
var classes = [];
var numLists = 0;
var searchOpen = false;
var key = format($('.page-title').text()); // Config key
var config = JSON.parse(sessionStorage.getItem(key));
if (!config) {
  config = []; // If config is empty
}

function hideSelect(wrapper) {
  wrapper.css('margin-top', '0').css('max-height', '0');
}

function showSelect(wrapper) {
  wrapper.css('margin-top', '20px').css('max-height', '100px');
}

function darkenSelect(wrapper) {
  wrapper.css('background-color', '#101c3d');
  wrapper.addClass('dark');
  wrapper.find('.select-field').css('color', 'white');
  wrapper.find('.tag-icon').css('display', 'block');
  wrapper.find('.dropdown-chevron').css('display', 'none');
}

function lightenSelect(wrapper) {
  wrapper.css('background-color', 'rgba(30, 53, 77, 0.04)');
  wrapper.removeClass('dark');
  wrapper.find('.select-field').css('color', 'rgba(0, 0, 0, 0.74)');
  wrapper.find('.tag-icon').css('display', 'none');
  wrapper.find('.dropdown-chevron').css('display', 'inline-block');
}

function isListEmpty(list) {
  var empty = true;
  list.find('.mix').each(function() {
    var display = $(this).css('display');
    if (display != 'none') {
      empty = false;
    }
  });
  return empty;
}

// Generates HTML for select menus
var optionArray;
function generateSelectMenus(form, tree, depth, index) {
  selectWrappers = [];
  optionArray = [];
  for (var i = 0; i < depth-1; i++) {
    var selectId = 'select-' + (index+1) + '-' + (i+1);

    var selectWrapper = $('<div class="select-wrapper"></div>');
    var tagIconContainer = $('<div class="tag-icon"></div>');
    var tagIconImage = $('<svg xmlns="http://www.w3.org/2000/svg" class="rubicons x" width="70%" height="70%" viewBox="-5 -5 25 25" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 6L6 18M18 18L6 6" stroke-linecap="round"></path></svg>');
    var selectField = $('<select id="' + selectId + '" class="select-field"><option disabled selected value>Select</option></select>');
    var dropdownChevron = $('<img class="dropdown-chevron" src="https://uploads-ssl.webflow.com/5fe828cda66535ed122d1912/601cb53a51b718c69967131a_chevron-down.svg"></img>');

    tagIconContainer.append(tagIconImage);
    selectWrapper.append(tagIconContainer, selectField, dropdownChevron);

    selects[index].push(selectField);
    selectWrappers.push(selectWrapper);
  }

  populateSelectMenus(tree, index, 0);
  for (var i = 0; i < optionArray.length; i++) {
    var selectIndex = i;
    var optionsFirst = optionArray[i][0]; // Sort order specified
    var optionsSecond = optionArray[i][1];

    optionsFirst.sort((a, b) => (a[2] > b[2]) ? 1 : -1); 
    optionsSecond.sort((a, b) => (a[1] > b[1]) ? 1 : -1); // Sort by [1] aka display

    var options = optionsFirst.concat(optionsSecond);

    for (var j = 0; j < options.length; j++) {
      var reference = options[j][0];
      var display = options[j][1];

      var option = '<option value="' + reference + '">' + display + '</option>'; // Create an option tag for each layer

      selects[index][selectIndex].append(option);
    }
  }
  
  var startingWrapper = 0;
  var startingText = '';

  for (var i = 0; i < selectWrappers.length; i++) {
    var wrapper = selectWrappers[i];
    var optionsCount = wrapper.find('.select-field').children().length

    if (i == startingWrapper && optionsCount == 2) { // Hide initial select
      wrapper.find('.select-field')[0].selectedIndex = 1;
      startingWrapper ++;

      var parent = $(wrapper.find('.select-field').children().eq(1));
      startingText = parent.text();
      var regex = /[s]+$/g;
      startingText = startingText.replace(regex, '');
    }

    if (i == startingWrapper && i > 0 && optionsCount > 2) {
      var placeholder = $(wrapper.find('.select-field').children().eq(0));
      placeholder.text(startingText);
    }

    form.append(wrapper);

    if (i != startingWrapper) {
      hideSelect(wrapper);
    }
  };
}

// generateSelectMenus helper function
function populateSelectMenus(tree, index, selectIndex) {
  if (!tree) {
    return;
  }

  if (optionArray.length <= selectIndex) {
    optionArray.push([ [], [] ]);
  }

  tree.forEach(function (node) {
    var parent = node.parent; // The 
    var container = lists[index]; // The collection list this select is inside
    var element;

    if (parent) {
      var parentRef = '.l' + selectIndex + '-' + format(parent.reference);
      element = container.find(parentRef); 
    } else {
      return;
    }

    if (element.length) { // ELEMENT.LENGTH
      var display = node.parent.display;
      var reference = format(node.parent.reference);
      var sortOrder = node.parent.sortOrder;

      if (!sortOrder) { // No sort order specified
        optionArray[selectIndex][1].push([reference, display]);
      } else { // Sort order specified
        optionArray[selectIndex][0].push([reference, display, sortOrder]);
      }
      
      populateSelectMenus(node.child, index, selectIndex+1);
    } else {
      return;
    }
  });
}

// Generate share url links

var unformattedUrl = window.location.href;
var title = format($('.post-title').text());
var formattedUrl = unformattedUrl.replace(':', '%3A');

$('.facebook').each(function() {
  var shareLink = 'https://www.facebook.com/sharer/sharer.php?u=' + formattedUrl;
  $(this).attr('href', shareLink);
});

$('.linkedin').each(function() {
  var shareLink = 'https://www.linkedin.com/shareArticle?mini=true&url=' + formattedUrl + '&title=' + title + '&summary=&source=Premier%20Tutors';
  $(this).attr('href', shareLink);
});

$('.twitter').each(function() {
  var shareLink = 'https://twitter.com/share?url=' + formattedUrl;
  $(this).attr('href', shareLink);
});
  
$('.whatsapp').each(function() {
  var shareLink = 'https://wa.me/whatsappphonenumber/?text=' + formattedUrl;
  $(this).attr('href', shareLink);
});

$('.fbmessenger').each(function() {
  var shareLink = 'fb-messenger://share?link=' + formattedUrl;
  $(this).attr('href', shareLink);
});

  
// Dropdown
$(window).scroll(function() {
  if (searchOpen) {
    searchOpen = false;
    closeSearch();
  }
});

$('.dd-toggle').click(function () {
  searchOpen = false;
  closeSearch();
});

$('.navbar-search-icon').click(function() {
  if (searchOpen) {
    closeSearch();
  } else {
    openSearch();
  }

  searchOpen = !searchOpen;
});

$('.navbar-menu-icon').click(function() {
  closeSearch();
  searchOpen = false;
});

$('.fakebody').click(function() {
  closeSearch();
  searchOpen = false;
});

function openSearch() {
  $('.navbar-search-wrapper').css('border-bottom', '1.5px solid #d8d8d8');
  $('.navbar-search-wrapper').css('max-height', '100px');
  $('.navbar-search-icon').html('');
  $('.navbar-search-input').focus();
}

function closeSearch() {
  $('.navbar-search-wrapper').css('max-height', '0px');
  $('.navbar-search-icon').html('');
  $('.navbar-search-input').blur();
  setTimeout(function(){
    $('.navbar-search-wrapper').css('border-bottom', '0px solid #d8d8d8');
  }, 400);
}

$('.param-redirect').click(function() { // Parameter setting buttons
  var paramString = format($(this).data('param'));
  var url = '//' + location.host + location.pathname
  url += ('?' + paramString);
  
  window.location.href = url;
});

$('.param-onpage').click(function() { // Parameter setting buttons
  var paramString = format($(this).data('param'));
  var key = paramString.split('=')[0];
  var value = paramString.split('=')[1];

  var urlParams = {};
  urlParams[key] = value;

  setUrlParams(urlParams);
});

$('.page-tab-button').click(function() {
  var index = $(this).index() - 1;
  if (mixitupContainers[index]) {
    setTimeout(function() {
      mixitupContainers[index].filter('all');
    }, 300);
  }
});

function getActiveTab() {
  var tabNumber;
  $('.page-tab-button').each(function(index) {
    var tab = $(this);
    if (tab.hasClass('w--current')) {
      tabNumber = index + 1;
    }
  });
  return tabNumber;
}

// Initialise mixer (sorter) program)
var mixitupContainers = [];
function initMixer(list, index) {
  // Initialise mixitup container
  var container = mixitup(list, {
    animation: {
      enable: false
    },
    callbacks: {
      onMixStart: function (state, futureState) {
        //console.log('state: ' + futureState.activeFilter.selector)
      },
      onMixEnd: function(state){
        if (searchOptions[index]['tiling']) masonryGrid(list);

        var emptyList = list.parent().next();
        if (isListEmpty(list)) {
          emptyList.css('display', 'block');
        } else {
          emptyList.css('display', 'none');
        }
      }
    }
  });
  mixitupContainers.push(container);

  if (searchOptions[index]['tiling']) {
    list.masonry({
      itemSelector: '.mix',
      transitionDuration: 0,
      horizontalOrder: true
    });
  }
}

function addSlugClasses(list) {
  // Add all slugs to enable more than 5 items per list
  list.find('.mix').each(function() {
    var mix = $(this);

    // Add each slug
    mix.find('.slug').each(function() {
      var text = format($(this).text());
      mix.addClass(text);
    });
  }); 
}

function addSearchClasses(content) {
  // Add each element tagged 'searchable';
  var mix = content.parent();
  content.find('.searchable').each(function() {

    var text = format($(this).text());
    var splitText = text.split(', ');

    for (var i = 0; i < splitText.length; i++) {
      mix.addClass(splitText[i]);
    }
  });
}

// Masonry layout
function masonryGrid(container){
  container.masonry({
    itemSelector: '.mix',
    transitionDuration: 0,
    horizontalOrder: true
  });
  container.masonry('reloadItems');
  container.masonry('layout');
}

var searchOptions = {};
// Add all collection lists to an object so they can be associated with
var lists = {};
$('.collection-list').each(function (index) {
  lists[index] = $(this);
  selects.push([]);
  numLists ++;

  searchOptions[index] = {};
  searchOptions[index]['tiling'] = lists[index].data('tiling');

  initMixer($(this), index);
  addSlugClasses($(this));
});

// Add all forms to an object so they can be associated with
var forms = {};
$('.form').each(function (index) {
  forms[index] = $(this);
});

// Select CMS options
$('.select-cms').each(function(index) {
  var data = [];
  data = [];
  maxDepth = 0;
  classes = [];

  $(this).find('.option').each(function() {
    var option = $(this);
    var child = {
      reference: option.find('.child-reference').text(),
      display: option.find('.child-display').text(),
      sortOrder: option.find('.child-sort_order').text()
    };
    var parent = {
      reference: option.find('.parent-reference').text(),
      display: option.find('.parent-display').text(),
      sortOrder: option.find('.parent-sort_order').text()
    };

    data.push([parent, child]);
  });

  // Sort the array into a tree
  treeData.push(createTree(data));

  if (!lists[index].find('.premsearch-import-script').length) {
    addFilterClasses(lists[index], treeData[index]);
    generateSelectMenus(forms[index], treeData[index].structure, treeData[index].depth, index);
    createEventHandlers();

    //Restore config if it exists
    if (!!config[index]) {
      restoreConfig(index);
    } else {
      config.push([]);
      for (var i = 0; i < treeData[index].depth; i++) {
        config[index].push({
          'select': i+1,
          'value': ''
        });
      }
    }
  }
});

// Below script counts cms and triggers when all items have loaded in
var cmsLoadCount = 0;
var cmsList = 0;
var listCount = Object.keys(lists).length;
var cmsItemCount = [];

for (var i = 0; i < listCount; i++) {
  var count = lists[i].children('.mix').length;
  cmsItemCount.push(count);
}

function cmsLoadCounter() {
  cmsLoadCount++;
  if (cmsLoadCount / cmsItemCount[cmsList] >= 1) {
    addFilterClasses(lists[cmsList], treeData[cmsList]);
    generateSelectMenus(forms[cmsList], treeData[cmsList].structure, treeData[cmsList].depth, cmsList);

    //Restore config if it exists
    if (!!config[cmsList]) {
      restoreConfig(cmsList);
    } else {
      config.push([]);
      for (var i = 0; i < treeData[cmsList].depth; i++) {
        config[cmsList].push({
          'select': i+1,
          'value': ''
        });
      }
    }

    cmsList++;
    cmsLoadCount = 0;
  }

  if (cmsList == listCount) createEventHandlers();
}

function createEventHandlers() {
  // On change of select input
  $('select').on('focus', function () {
    // Store the current value on focus and on change
    previous = this.value;
  }).change(function() {
    // Do something with the previous value after the change
    if ($(this).attr('id') != 'location-field') {
      selectDidChange($(this), false);
      previous = this.value;
    }
  });

  // When the 'x' icon is pressed
  $('.tag-icon').click(function() {
    var select = $(this).parents('.select-wrapper').find('.select-field');
    if (select.attr('id') != 'location-field') {
      select.val('');
      selectDidChange(select, true);
    } else {
      if ($('#location-field').length) locationDidChange(null, true);
      select.val('');
    }
  });

  // When 'clear filters' button is pressed
  $('.clear-filters').click(function() {
    var index = $(this).index('.clear-filters');
    var id = '#select-' + (index+1) + '-1';
    var select = $(id);
    var parent = select.parents('.select-wrapper');
    var search = parent.prev().find('.search-input');
    search.val('');

    if (parent.css('max-height') != '0px') { // Only clear primary select if it's not hidden
      select.val('');
      selectDidChange(select, true);
    } else {
      var sibling = parent.next().find('.select-field');
      sibling.val('');
      selectDidChange(sibling, true);
    }
    
    if ($('#location-field').length) locationDidChange(null, true);
  });

  // On change of search input, add/remove classes to filter .mix boxes
  $('input[type=text]').on('input', function() {
    var input = $(this);
    performSearch(input);
  });
}

function selectDidChange(select, clear) {
  if (select.parents('.form').length) {
    // Scroll to top
    // var linkAnchor = $('.premsearch-link-anchor');
    // $('html, body').animate({ 
    //   scrollTop: linkAnchor.offset().top + 'px'
    // });

    var id = select.attr('id');
    var groupNumber = parseInt(id.split('-')[1]);
    var selectNumber = parseInt(id.split('-')[2]);

    proceedingSelect(groupNumber, selectNumber + 1, clear);
    var classString = applySearchClass(groupNumber, selectNumber, select); 
    restrictSelectOptions(groupNumber, selectNumber + 1, classString); 

    if (clear) {
      lightenSelect(select.parent());
    } else {
      darkenSelect(select.parent());
    }
    updateConfig(groupNumber, selectNumber, select);
  } 
}

function restrictSelectOptions(groupNumber, selectNumber, classString) {
  var id = '#select-' + groupNumber + '-' + selectNumber;
  var nextSelect = $(id);
  var options = [];
  var list = lists[groupNumber - 1]; // Current col. list

  unhideOptions(selectNumber);
  remaining = 0;

  // For every option, check every .mix.
  nextSelect.find('option').each(function() {
    var option = $(this);

    var hide = true;
    list.find('.mix').each(function() {
      var mix = $(this);
      var display = mix.css('display');
      var classList = mix.attr('class')
                         .replace(/[()]/g,'')
                         .replace(/\./g,'')
                         .replace(/\s+/g, '.');

      var searchString = classString + '.l' + (selectNumber-1) + '-' + format(option.val());

      if (option.val()) {
        if (includesAllParts(searchString, classList)) {
          remaining++;
          hide = false;
        }

      } else {
        hide = false;
      }
      
    });
    if (hide) {
      //option.css('display', 'none');
      if( !(option.parent().is('span')) ) option.wrap('<span>');
    }
  });
  if (remaining <= 2) hideSelect(nextSelect.parent());
}

// This function searches through the tree structure and assigns class
function addFilterClasses(list, tree) {
  list.find('.mix').each(function() {
    var mix = $(this);
    var roots = [];
    mix.find('.root-category').each(function() {
      roots.push($(this).text());
    });
    
    var classArray = [];
    var classIndexArray = [];
    roots.forEach(function(root) {
      findOptionPath(root, tree.structure, []);

      var classIndex = null;

      for (var i = 0; i < classes.length; i++) {
        var cur = classes[i];
        
        if (!classIndex) {
          if (classArray.includes(cur)) {
            classIndex = classArray.indexOf(cur);  
          } else {
            classArray.push(cur);
            classIndexArray.push(i);
          }
        } else {
          if (classArray[classIndex+1] == cur) {
            classIndex++;
          } else if (!classArray.includes(cur)) {
            classArray.splice(classIndex+1, 0, cur);
            classIndexArray.splice(classIndex+1, 0, i);
          }
        }
      }
      classes = [];
    });

    classArray.forEach(function(className, index) {
      var level = 'l' + classIndexArray[index] + '-';
      mix.addClass(level + format(className));
    });

  });
}

function findOptionPath(root, tree, path) {
  tree.forEach(function (node) {
    if (node.parent.reference == root) {
      var newPath = path.concat(node.parent.reference);
      classes = newPath;
      return;
    } else if (node.child) { 
      var newPath = path.concat(node.parent.reference);

      findOptionPath(root, node.child, newPath); // Search in child
    } else {
      return;
    }
  });
}

function includesAllParts(searchStr, parentStr) {
  var arr = searchStr.split('.');
  arr.shift();
  var text = parentStr;

  for (var i = 0; i < arr.length-1; i++) {
    var start = arr[i];
    var end = arr[i+1];
    
    var regex = new RegExp(`${start}(.+?)${end}`);
    var cut = text.match(regex);
    
    if (cut) {
      cut = cut[0].split('.');
      var minLevel = arr[i].split('-')[0];
      var minIndex = minLevel.charAt(1);

      for (var j = 1; j < cut.length-1; j++) {
        var curLevel = cut[j].split('-')[0];
        var curIndex = curLevel.charAt(1);
        
        if (curIndex <= minIndex) return false;
      }
    }
    
    text = text.replace(regex, start + '.' + end);
  }

  if (text.includes(searchStr)) return true;
  return false;
}