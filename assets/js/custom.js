(function($){
  "use strict";
  var WEA = {};
  var plugin_track = 'assets/vendor/';
  $.fn.exists = function () {
        return this.length > 0;
    };

  /* ---------------------------------------------- /*
   * Pre load bootstrapģ��⣺http://www.bootstrapmb.com
  /* ---------------------------------------------- */
  WEA.PreLoad = function() {
    document.getElementById("loading").style.display = "none"; 
  }

    /*--------------------
        * Menu Close
    ----------------------*/
    WEA.MenuClose = function(){
      $('.navbar-nav a').on('click', function() {
       var toggle = $('.navbar-toggler').is(':visible');
       if (toggle) {
         $('.navbar-collapse').collapse('hide');
       }
      });
    }


  WEA.MenuTogglerClose = function(){
    $(".toggler-menu").on('click', function(){
      $(this).toggleClass('open');
      $('.header-left').stop().toggleClass('menu-open menu-open-desk');
    });
    $('.header-left a').on('click', function() {
     var toggle = $('.toggler-menu').is(':visible');
     if (toggle) {
       $('.header-left').removeClass('menu-open');
       $('.toggler-menu').removeClass('open');
     }
    });
  }

  /* ---------------------------------------------- /*
   * Header Fixed
  /* ---------------------------------------------- */
  WEA.HeaderFixd = function() {
    var HscrollTop  = $(window).scrollTop();  
      if (HscrollTop >= 100) {
         $('body').addClass('fixed-header');
      }
      else {
         $('body').removeClass('fixed-header');
      }
  }


    /*--------------------
    * OwlSlider
    ----------------------*/
    WEA.Owl = function () {
      var owlslider = $("div.owl-carousel");
      if(owlslider.length > 0) {  
         loadScript(plugin_track + 'owl-carousel/js/owl.carousel.min.js', function() {
           owlslider.each(function () {
            var $this = $(this),
                $items = ($this.data('items')) ? $this.data('items') : 1,
                $loop = ($this.attr('data-loop')) ? $this.data('loop') : true,
                $navdots = ($this.data('nav-dots')) ? $this.data('nav-dots') : false,
                $navarrow = ($this.data('nav-arrow')) ? $this.data('nav-arrow') : false,
                $autoplay = ($this.attr('data-autoplay')) ? $this.data('autoplay') : true,
                $autospeed = ($this.attr('data-autospeed')) ? $this.data('autospeed') : 5000,
                $smartspeed = ($this.attr('data-smartspeed')) ? $this.data('smartspeed') : 1000,
                $autohgt = ($this.data('autoheight')) ? $this.data('autoheight') : false,
                $CenterSlider = ($this.data('center')) ? $this.data('center') : false,
                $space = ($this.attr('data-space')) ? $this.data('space') : 30;    
           
                $(this).owlCarousel({
                    loop: $loop,
                    items: $items,
                    responsive: {
                      0:{items: $this.data('xs-items') ? $this.data('xs-items') : 1},
                      480:{items: $this.data('sm-items') ? $this.data('sm-items') : 1},
                      768:{items: $this.data('md-items') ? $this.data('md-items') : 1},
                      980:{items: $this.data('lg-items') ? $this.data('lg-items') : 1},
                      1200:{items: $items}
                    },
                    dots: $navdots,
                    autoplayTimeout:$autospeed,
                    smartSpeed: $smartspeed,
                    autoHeight:$autohgt,
                    center:$CenterSlider,
                    margin:$space,
                    nav: $navarrow,
                    navText:["<i class='ti-arrow-left'></i>","<i class='ti-arrow-right'></i>"],
                    autoplay: $autoplay,
                    autoplayHoverPause: true   
                }); 
           }); 
         });
      }
    }

  /* ---------------------------------------------- /*
     * lightbox gallery
    /* ---------------------------------------------- */
    WEA.Gallery = function() {
      $(document).ready(function () {
        // var example = $('[data-mrc]');
        // example.moreContent({
        //     speed: 800,
        //     height:1200,
        //     shadow: true,
        //     easing: 'easeOutBounce',
        //     textClose: 'View More',
        //     textOpen: 'Hide'
        // });
        // $('.method-controls button').on('click', function () {
        //     var methName = $(this).data('meth');
        //     example.moreContent(methName);
        // });

        // document.querySelectorAll('.tag').forEach(tag => {
        //   tag.addEventListener('click', () => {
        //     const input = document.getElementById('tagsBB');
        //     const tagText = tag.textContent.trim();
        //     const currentTags = input.value.split(',').map(t => t.trim()).filter(Boolean);
        //     if (!currentTags.includes(tagText)) {
        //       currentTags.push(tagText);
        //       input.value = currentTags.join(', ');
        //     }
        //   });
        // });

      // Tag click -> add to input
      $('.tag').on('click', function () {
        const tagText = $(this).text().trim();
        let currentTags = $('#tagsInput').val().split(',').map(t => t.trim()).filter(Boolean);
        if (!currentTags.includes(tagText)) {
          currentTags.push(tagText);
          $('#tagsInput').val(currentTags.join(', '));
        }
      });

      // Search button click or enter press
      $('#searchBtn').on('click', filterGallery);
      $('#tagsInput').on('keypress', function (e) {
        if (e.which === 13) filterGallery();
      });

      function filterGallery() {
        const inputTags = $('#tagsInput').val().toLowerCase().split(',').map(t => t.trim()).filter(Boolean);

        $('.portfolio-box > .row').each(function () {
          const itemTags = ($(this).data('tags') || '').toLowerCase().split(',').map(t => t.trim());
          const hasMatch = inputTags.every(tag => itemTags.includes(tag));
          $(this).toggle(hasMatch || inputTags.length === 0); // show all if input is empty
        });
      }
    });



    //     var TagsData = []
    //     TagsData.push({ id: 1, name: "Agent", screen: "0" })

    //     $("#tagsInput").sTags({
    //         data: TagsData,
    //     })
    //     $(".search").click(function () {
    //         var temp = $('.sTags-input');
    //         var tags = [];//输入的标签
    //         temp.find('.sTags-new span').each(function() {
    //         tags.push($(this).text());
    //         });
            
    //         var divs = $("div.portfolio-box div.row");
    //         divs.each(function () {
    //             var $div = $(this);
    //             var tagstemp = [];//每一个div的标签
    //             $div.find('span').each(function() {
    //                 tagstemp.push($(this).text());
    //             });
                
    //             var found = false;//查找标记
    //             if (tags.length === 0){//如果tags为空，显示全部div内容
    //                 // found = true;
    //                 location.reload();
    //                 setTimeout(() => {
    //                 location.hash = '#videosSection';
    //             }, 0);
    //             }else {
    //                 for (var i = 0; i < tags.length; i++) {
    //                     if (tagstemp.includes(tags[i])) {//遍历tags，查找是否和标签有匹配的
    //                         found = true;
    //                         break;
    //                     }
    //                 }
    //             }

    //             if (found) {
    //                 $div.show();
    //             } else {
    //                 $div.hide();
    //             }
    //         });
    //     })
    // });
    }

     /*--------------------
    * Masonry
    ----------------------*/
    WEA.masonry = function () {
      var portfolioWork = $('.portfolio-content');
      if ($(".portfolio-content").exists()){
        loadScript(plugin_track + 'isotope/isotope.pkgd.min.js', function() {
          if ($(".portfolio-content").exists()){
              $(portfolioWork).isotope({
                resizable: false,
                itemSelector: '.grid-item',
                layoutMode: 'masonry',
                filter: '*'
              });
              //Filtering items on portfolio.html
              var portfolioFilter = $('.filter li');
              // filter items on button click
              $(portfolioFilter).on( 'click', function() {
                var filterValue = $(this).attr('data-filter');
                portfolioWork.isotope({ filter: filterValue });
              });
              //Add/remove class on filter list
              $(portfolioFilter).on( 'click', function() {
                $(this).addClass('active').siblings().removeClass('active');
              });
          }
        });
      }
  }

  /*--------------------
        * Progress Bar 
    ----------------------*/
    WEA.ProgressBar = function(){
        $(".skill-bar .skill-bar-in").each(function () {
          var bottom_object = $(this).offset().top + $(this).outerHeight();
          var bottom_window = $(window).scrollTop() + $(window).height();
          var progressWidth = $(this).attr('aria-valuenow') + '%';
          if(bottom_window > bottom_object) {
            $(this).css({
              width : progressWidth
            });
          }
        });
    }

    /*--------------------
        * particles
    ----------------------*/
    WEA.particles = function() {
      if ($("#particles-box").exists()){
        loadScript(plugin_track + 'particles/particles.min.js', function() {
        });
        loadScript(plugin_track + 'particles/particles-app.js', function() {
        });
      }
    }


    /*--------------------
        * Type It
    ----------------------*/
    WEA.mTypeIt = function() {
      if ($("#type-it").exists()){
            loadScript(plugin_track + 'typeit-master/typeit.js', function() {
                new TypeIt('#type-it', {
                speed: 200,
                loop:true,
                strings: [
                  'NICE go!',

                ],
                breakLines: false
            }); 
          });
        }
    }
    WEA.one_page = function() {
        //var HHeight = $('.navbar').outerHeight();
        var $one_page_nav = $('.one-page-nav');
        if($one_page_nav.length > 0) {
            $one_page_nav.each(function(){
                $.scrollIt({
                  upKey: 38,             // key code to navigate to the next section
                  downKey: 40,           // key code to navigate to the previous section
                  easing: 'linear',      // the easing function for animation
                  scrollTime: 600,       // how long (in ms) the animation takes
                  activeClass: 'active', // class given to the active nav element
                  onPageChange: null,    // function(pageIndex) that is called when page is changed
                  topOffset: -70           // offste (in px) for fixed top navigation
                });
            });
        }
    }

  /* ---------------------------------------------- /*
   * All Functions
  /* ---------------------------------------------- */
    // loadScript
  var _arr  = {};
  function loadScript(scriptName, callback) {
      if (!_arr[scriptName]) {
        _arr[scriptName] = true;
        var body    = document.getElementsByTagName('body')[0];
        var script    = document.createElement('script');
        script.type   = 'text/javascript';
        script.src    = scriptName;
        // WEAn bind WEA event to WEA callback function
        // WEAre are several events for cross browser compatibility
        // script.onreadystatechange = callback;
        script.onload = callback;
        // fire WEA loading
        body.appendChild(script);
      } else if (callback) {
        callback();
      }
  };

  // Window on Load
  $(window).on("load", function(){
    WEA.masonry(),
    WEA.PreLoad();
  });
  // Document on Ready
  $(document).ready(function() {
    WEA.particles(),
    WEA.HeaderFixd(),
    WEA.MenuClose(),
    WEA.MenuTogglerClose(),
    WEA.Gallery(),
    WEA.ProgressBar(),
    WEA.mTypeIt(),
    WEA.one_page(),
    WEA.Owl(),
    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
  });

  // Document on Scrool
  $(window).on("scroll", function(){
    WEA.ProgressBar(),
    WEA.HeaderFixd();
  });

  // Window on Resize
  $(window).on("resize", function(){
  });
})(jQuery);

document.getElementById("toggleGalleryBtn").addEventListener("click", function () {
  const wrapper = document.getElementById("galleryWrapper");
  const isCollapsed = wrapper.classList.contains("collapsed");

  wrapper.classList.toggle("collapsed");
  this.textContent = isCollapsed ? "Hide Gallery" : "Show Gallery";
});

// committees
document.addEventListener('DOMContentLoaded', function() {
    // Committee data (name and description)
    const committees = {
        'agent': { name: 'Agent Committee', description: 'Agent Committee' },
        'efficient': { name: 'Efficient/Infra Committee', description: 'Efficient/Infra Committee' },
        'evaluation': { name: 'Evaluation Committee', description: 'Evaluation Committee' },
        'interp': { name: 'Interpretation Committee', description: 'Interpretation Committee' },
        'multilingual': { name: 'Multilingual Committee', description: 'Multilingual Committee' },
        'multimodal': { name: 'Multimodal Committee', description: 'Multimodal Committee' },
        'trustworthy': { name: 'Trustworthiness Committee', description: 'Trustworthiness Committee' }
    };

    // Get all filter elements
    const filterButtons = document.querySelectorAll('[data-committee]');
    const allButton = document.getElementById('all-tab');
    const dropdown = document.getElementById('committee-dropdown');
    const membersGrid = document.getElementById('members-grid');
    const committeeHeader = document.getElementById('committee-header');
    const committeeName = document.getElementById('committee-name');
    const committeeDescription = document.getElementById('committee-description');
    const allMembersHeader = document.getElementById('all-members-header');
    const volunteersSection = document.getElementById('volunteers-section');
    let currentCommittee = 'all';

    // Function to filter members
    function filterMembers(committee) {
        const allMembers = document.querySelectorAll('.member-card');
        
        if (committee === 'all') {
            // Show all members and hide committee header
            allMembers.forEach(member => {
                member.style.display = 'block';
            });
            allMembersHeader.style.display = 'block';
            committeeHeader.style.display = 'none';
            // volunteersSection.style.display = 'block';
        } else {
            // Show only members of selected committee
            allMembers.forEach(member => {
                if (member.dataset.committee === committee) {
                    console.log(member.dataset.committee)
                    member.style.display = 'block';
                } else {
                    member.style.display = 'none';
                }
            });
            
            // Show committee header with name and description
            allMembersHeader.style.display = 'none';
            committeeName.textContent = committees[committee].name;
            committeeDescription.textContent = committees[committee].description;
            committeeHeader.style.display = 'block';
            // volunteersSection.style.display = 'none';
        }
    }

    // Function to reset to "All" view
    function resetToAll() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        allButton.classList.add('active');
        dropdown.value = 'all';
        currentCommittee = 'all';
        filterMembers('all');
    }

    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const committee = this.dataset.committee;
            
            // If clicking the currently active committee button
            if (committee === currentCommittee) {
                resetToAll();
                return;
            }
            
            // If clicking a different committee
            if (committee !== 'all') {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter members
                currentCommittee = committee;
                filterMembers(committee);
                
                // Update dropdown to match
                dropdown.value = committee;
            } else {
                resetToAll();
            }
        });
    });

    // Add event listener to dropdown
    dropdown.addEventListener('change', function() {
        const committee = this.value;
        
        // If selecting the currently active committee
        if (committee === currentCommittee && committee !== 'all') {
            resetToAll();
            return;
        }
        
        // Update button states
        filterButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.committee === committee);
        });
        
        // Filter members
        currentCommittee = committee;
        filterMembers(committee);
    });

    // Initialize to show all members
    resetToAll();
});
