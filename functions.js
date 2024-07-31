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