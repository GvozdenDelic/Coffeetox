// Initialise functions on load event
$(function() {
    appear();
})

function appear(){
	var appearItem = $(".appear");

	setTimeout(function(){
		appearItem.addClass("appeared");
	},100);
}

/* User geolocation start */
var getLocation = $(".js-getLocation");

getLocation.click(function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locate,showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    function locate(position) {
    var latitude            = position.coords.latitude,
        longitude           = position.coords.longitude,
        location            = latitude.toString()+','+longitude.toString(), // User location that I got from the geolocation API
        clientID            = 'IR1JQZSRJAEXIQUZVY1IAZBFTPB301SWC4GSBPC0H4RYA3A3',
        clientSecret        = 'STV0ATESENU2WSOEHWE0EV2MVJ2IIWH1RJ3OFWQCK4RNVMT4',
        itemRadius          = '1000',
        section             = 'coffee',
        openNow             = '1', // Only show open coffee shops
        sortByDistance      = '1',
        limit               = '10',
        venuePhotos         = '1',
        venueID             = [], 
        venueNames          = [],
        venuePhotosList     = [],
        venueDistance       = [],
        venueExpensiveness  = [],
        venueSlider         = [],
        venueTips           = [],
        counter             = 0;

        // If sorting is by distance, change the sorting to price
        if($(this).data('sort') !== "distance"){
            sortByDistance = 0;
            $(this).data('sort','distance');
            $('.sort-button').text('Sort By Distance');
            $(".venues-list .venue-item").fadeOut().delay( 500 ).remove();
        }else {
            sortByDistance = 1;
            $(this).data('sort','price');
            $('.sort-button').text('Sort By Price');
            $(".venues-list .venue-item").fadeOut().delay( 500 ).remove();
        }

        // Search for the best coffee shops around
        $.getJSON('https://api.foursquare.com/v2/venues/explore?ll='+location+'&client_id='+clientID+'&client_secret='+clientSecret+'&sortByDistance='+sortByDistance+'&limit='+limit+'&radius='+itemRadius+'&section='+section+'&venuePhotos='+venuePhotos+'&v=20172611'+sortByDistance,  
        function(data) {

            $.each(data.response.groups[0].items, function(i,item){

                venueID[i]              = item.venue.id;
                venueNames[i]           = item.venue.name;
                venueDistance[i]        = item.venue.location.distance;
                venueExpensiveness[i]   = item.venue.price.message;

                if(item.venue.photos.groups.length){
                    venuePhotosList[i] = item.venue.photos.groups[0].items[0].prefix + '1080x600' + item.venue.photos.groups[0].items[0].suffix;
                }
                else {
                // Venue has no image ? No problem, we got that covered
                    venuePhotosList[i] = document.URL + '/img/no-image.jpg';
                }

                //Now that we have all the data needed, let's make the html
                var venueItem = '<div class="venue-item venue-item-'+[i]+'" data-number="'+[i]+'"><h2 class="venue-name">'+venueNames[i]+'</h2><div class="venue-image" style="background-image:url('+venuePhotosList[i]+');"></div><div class="venue-distance">'+venueDistance[i]+'m</div></div>';
                $(".venues-list").append(venueItem);
            });

        // Lets create logic for details page...
        $(".venue-item").click(function(){
            itemNumber  = $(this).data('number'),
            detailHTML  = '';

            $(".venue-detail").addClass("opened");
            //go to top of the page very fast. User doesn't have the time for long animations because he wants a coffee ASAP
            $("html,body").stop().animate( { scrollTop: 0 }, 200, "swing" );

            //Get venue images for page detail slider
            $.getJSON('https://api.foursquare.com/v2/venues/'+venueID[itemNumber]+'/photos?&VENUE_ID='+venueID[itemNumber]+'&client_id='+clientID+'&client_secret='+clientSecret+'&limit=10&v=20172611'+[itemNumber],
            function(photos) { 
                //new instance
                venueSlider = [];

                $.each(photos.response.photos.items, function(i){ 
                    venueSlider[i] = '<img class="slider-item slick-slide" src="'+photos.response.photos.items[i].prefix+'1080x600'+photos.response.photos.items[i].suffix+'" alt="" />';

                });

                //let's remove the ugly commas after each slide
                venueSlider = venueSlider.join(" ");

            }).done(function() {

                // After very cool back to top effect is done,the detail uncovers
                detailHTML =    '<h2>'+venueNames[itemNumber]+'</h2>'
                                + '<div class="venue-distance">'+venueNames[itemNumber]+' is only '+venueDistance[itemNumber]+'m away. Prices here are '+venueExpensiveness[itemNumber].toLowerCase()+'.</div>'
                                + '<div class="slider">'+venueSlider+'</div>';
                $(".venue-detail-data").append(detailHTML);

                setTimeout(function(){
                    $(".slider").addClass('loaded');
                    $(".slider").slick({
                        fade: true,
                        prevArrow: '<button type="button" class="slick-prev">Prev</button>' // "Prev" is cooler than "previous" because it has the same width as "next"
                    });
                },300);

            });

            // Let's get tips containing the word "coffee" to display on the detail
            $.getJSON('https://api.foursquare.com/v2/venues/'+venueID[itemNumber]+'/tips?&VENUE_ID='+venueID[itemNumber]+'&limit=100&client_id='+clientID+'&client_secret='+clientSecret+'&v=20172611'+[itemNumber],
            function(tips) { 

                //new instance
                venueTips = [];

                $.each(tips.response.tips.items, function(i){ 

                    //
                    if(tips.response.tips.items[i].text.indexOf("coffee") !== -1 || tips.response.tips.items[i].text.indexOf("Coffee") !== -1){
                        venueTips[i] = tips.response.tips.items[i].text;
                    }
                    else {
                        venueTips[i] = ' ';
                    }

                    $(".venue-tips").append('<div class="venue-tip-item appear appear-from-top">'+venueTips[i]+'</div>');

                    setTimeout(function(){
                        $(".venue-tip-item").addClass('appeared');
                    },200);


                });

            });
        });

            $(".close-detail").click(function(){
                $(".venue-detail").removeClass("opened");
                $(".venue-tips").html('');
                $(".venue-detail-data").html('');
                detailHTML = ''; // Erase data after closing, so we don't get data of previous detail after opening new one
            });
        });

        $(".venues-list").addClass('appear appear-from-top');
        $(".description").fadeOut();
        $(".locate-button").fadeOut();
        setTimeout(function(){
            $(".venues-list").addClass('appeared');
        },200);

  }

    // List of errors when user is unlocateable
    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("Please allow us to locate you.");
            break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable. Please enable location informations.");
            break;
            case error.TIMEOUT:
                alert("The request to get your location timed out. Please try again.");
            break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred. Please try again.");
            break;
        }
    }
});

/* User geolocation end */