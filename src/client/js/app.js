
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

// Create a new date instance dynamically with JS
let d = new Date();
let today = d.getFullYear() + '-' + ( "0" + ( d.getMonth() + 1 )).slice( -2 ) + '-' + d.getDate();

// set default value, min and max for start date
let dateControl = document.querySelector('input[ type="date" ]' );
dateControl.value = today;
dateControl.min = today;
dateControl.max = add15days();

document.querySelector( '#generate' ).addEventListener( 'click', performAction );
document.querySelector( '.newBtn' ).addEventListener( 'click', newTrip );

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

function daysLeft( startTrip ) {

  const day = parseInt( startTrip.substring( 8 ) );

  let month = startTrip.substring( 5, 7 );

  // convert month into index
  if ( month.substring( 0,1 ) === '0' ) {
    month.slice( 0, 1 );
  }
  month = parseInt( month ) -1;

  const year = parseInt( startTrip.substring( 0, 4 ) );

  const oneDay = 24*60*60*1000;
  const end = new Date( year, month, day );

  // calculate left days
  const result = Math.ceil((  end.getTime() - d.getTime() ) / oneDay);

  // accept just positiv numbers
  return Math.abs( result )
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

/*function saveTrip() {

  document.querySelector( '.inputs').style.display = 'flex';

}*/

function createImage( result ) {

  let img = document.createElement('img');
  img.src = result.hits[0].largeImageURL;
  document.querySelector( '.locationImageWrapper' ).appendChild( img );

}

export {
  performAction,
  newTrip
}
