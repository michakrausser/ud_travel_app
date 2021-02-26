import { dateControl } from "./app";
import { daysLeft } from "./daysLeft";


//API Data geonames
const baseUrlGeonames = "http://api.geonames.org/searchJSON?q=";
const username = "&maxRows=10&username=michakrausser";

//API Weatherbit
const baseUrlWeatherBit = 'http://api.weatherbit.io/v2.0/forecast/daily'
const keyWeatherBit = '44daab0ad2a84b3d888db4ca130d1b13'

//API Pixabay
const baseUrlPixabay = 'https://pixabay.com/api/?key=';
const keyPixabay = '20390411-62378061cf913a782a63af9a0'
const searchRequest = '&q='
const type = '&image_type=photo'

async function performAction( e ) {

  e.preventDefault()

  // Get ZIP
  let location = document.getElementById( 'location' ).value;
  location = location.replace( /\s/g, '' );

  // API Calls
  if ( location ) {

    // get data of geoname API
    fetch( baseUrlGeonames + location + username )
      .then( resultGeonames => resultGeonames.json() )
      .then( resultGeonames => {

        if ( resultGeonames.totalResultsCount === 0 ) {
          alert( 'Please enter a city!' );
        } else {

          document.querySelector( '.inputs').style.display = 'none';
          document.querySelector( '.results').style.display = 'flex';

          // get data of weatherbit API
          fetch( baseUrlWeatherBit + '?lat=' + resultGeonames.geonames[0].lat + '&lon=' + resultGeonames.geonames[0].lng + '&key=' + keyWeatherBit )
            .then( resultWeatherbit => resultWeatherbit.json() )
            .then( resultWeatherbit => {

              // set or update ui
              document.getElementById( 'destination' ).innerHTML = `Destination: ${ resultGeonames.geonames[0].name },  ${ resultGeonames.geonames[0].countryName }`;
              document.getElementById( 'date' ).innerHTML = `Date: ${ resultWeatherbit.data[ daysLeft( dateControl.value )].datetime }`;
              document.getElementById( 'daysLeft' ).innerHTML = `Days left: ${ daysLeft( dateControl.value )}`;
              document.getElementById( 'temp' ).innerHTML = `Temperature: ${ resultWeatherbit.data[ daysLeft( dateControl.value )].temp } °F`;
              document.getElementById( 'description' ).innerHTML = `Weather description: ${ resultWeatherbit.data[ daysLeft( dateControl.value )].weather.description }`;

            })

          // get data of pixabay API
          fetch( baseUrlPixabay + keyPixabay + searchRequest + location + '+' + resultGeonames.geonames[0].countryName + type )
            .then( locationImage => locationImage.json() )
            .then( locationImage => {

              // looking for country image if image of location isn't available
              if ( locationImage.total === 0 ) {

                fetch(baseUrlPixabay + keyPixabay + searchRequest + resultGeonames.geonames[0].countryName + type )
                  .then( countryImage => countryImage.json() )
                  .then( countryImage => {
                    createImage( countryImage );
                  })

              } else {
                createImage( locationImage );
              }
            })
        }
      })
  } else {
    alert( 'write please a location' );
  }
}

// allow select just 16 days
function add15days() {

  const maxDays = new Date();
  maxDays.setDate( maxDays.getDate() + 15 )

  return maxDays.getFullYear() + '-' + ( "0" + ( maxDays.getMonth() + 1 )).slice( -2 ) + '-' + maxDays.getDate();
}

function newTrip() {

  document.querySelector( '.inputs').style.display = 'flex';

  const img = document.querySelector( '.results img');
  if ( img ) {
    img.remove();
  }

  document.querySelector( '.results').style.display = 'none';
}

function createImage( result ) {

  let img = document.createElement('img');
  img.src = result.hits[0].largeImageURL;
  document.querySelector( '.locationImageWrapper' ).appendChild( img );

}

export {
  add15days,
  performAction,
  newTrip
}
