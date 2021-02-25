
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
console.log( d );
const months = [ "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December" ];

let today = d.getFullYear() + '-' + ( "0" + ( d.getMonth() + 1 )).slice( -2 ) + '-' + d.getDate();


let dateControl = document.querySelector('input[ type="date" ]' );
dateControl.value = today;
dateControl.min = today;
dateControl.max = add15days();

document.getElementById( 'generate' ).addEventListener( 'click', performAction );

async function performAction( e ) {

  e.preventDefault()

  // Get ZIP
  let location = document.getElementById( 'location' ).value;
  location = location.replace( /\s/g, '' );

  // API Call
  if ( location ) {
    fetch( baseUrlGeonames + location + username )
      .then( resultGeonames => resultGeonames.json() )
      .then( resultGeonames => {
        console.log( resultGeonames );

        if ( resultGeonames.totalResultsCount === 0 ) {
          alert( 'Please enter a city!' );
        } else {

          fetch( baseUrlWeatherBit + '?lat=' + resultGeonames.geonames[0].lat + '&lon=' + resultGeonames.geonames[0].lng + '&key=' + keyWeatherBit )
            .then( resultWeatherbit => resultWeatherbit.json() )
            .then( resultWeatherbit => {

              document.getElementById( 'place' ).innerHTML = `Date: ${ resultWeatherbit.data[ daysLeft( dateControl.value )].datetime }`;
              document.getElementById( 'country' ).innerHTML = `Temperature: ${ resultWeatherbit.data[ daysLeft( dateControl.value )].temp } °F`;
              document.getElementById( 'lat' ).innerHTML = `Weather description: ${ resultWeatherbit.data[ daysLeft( dateControl.value )].weather.description }`;
              document.getElementById( 'lng' ).innerHTML = `Longitude:  ${ resultGeonames.geonames[0].lng }`;
            })

          fetch( baseUrlPixabay + keyPixabay + searchRequest + location + type )
            .then( result => result.json() )
            .then( result => {
              console.log( result );
              if ( result.total === 0 ) {
                alert( 'No images was found!' );
              } else {
                document.getElementById( 'locationImage' ).style.backgroundImage = `url(${ result.hits[0].previewURL })`;
              }
            })
        }


        /*document.getElementById( 'place' ).innerHTML = `City ${ resultGeonames.geonames[0].name }`;
        document.getElementById( 'country' ).innerHTML = `Country: ${ resultGeonames.geonames[0].countryCode }`;
        document.getElementById( 'lat' ).innerHTML = `Latitude: ${ resultGeonames.geonames[0].lat }`;
        document.getElementById( 'lng' ).innerHTML = `Longitude:  ${ resultGeonames.geonames[0].lng }`;
*/
      })
  } else {
    alert( 'write please a location');
  }
  /*getWeatherData( baseUrl, location, username )
    .then( data => {
      console.log( 'data_from_API: ', data );

      postData( '/add', {
        date: today,
        temperature: data.main.temp,
        userResponse: userResponse,
      });

      updateUI( data.name, zip, );
    })*/
}

function daysLeft( startTrip ) {

  const day = parseInt( startTrip.substring( 8 ) );

  let month = startTrip.substring( 5, 7 );
  if ( month.substring( 0,1 ) === '0' ) {
    month.slice( 0, 1 );
  }
  month = parseInt( month ) -1;

  const year = parseInt( startTrip.substring( 0, 4 ) );

  const oneDay = 24*60*60*1000;
  const end = new Date( year, month, day );

  const result = Math.ceil((  end.getTime() - d.getTime() ) / oneDay);
  return Math.abs( result )
}

function add15days() {

  const maxDays = new Date();
  maxDays.setDate( maxDays.getDate() + 15 )

  return maxDays.getFullYear() + '-' + ( "0" + ( maxDays.getMonth() + 1 )).slice( -2 ) + '-' + maxDays.getDate();
}

// API call, get data

const getWeatherData = async ( baseURL, zip, key ) => {

  console.log( 'url: ', baseURL, zip, key);

  const res = await fetch( baseURL + zip + key )

  try {

    const data = await res.json();
    console.log( 'Data_of_api: ', data )
    return data;

  } catch( error ) {
    console.log( "error" , error );
  }
}

// POST METHOD, post Data to server

const postData = async ( url = '', data = {} ) => {

  const response = await fetch( url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( data ),
  });

  try {
    const newData = await response.json();
    console.log( newData );
    return newData;

  } catch( error ) {
    console.log( "error", error );
  }
};

// Async GET
const updateUI = async ( city, zip ) =>{
  const request = await fetch( '/all' );
  try {
    // Transform into JSON
    const allData = await request.json()
    console.log( 'updateUI', allData );

    // update UI
    document.getElementById( 'location' ).innerHTML = `Weather data in ${ city }, ${ zip }`;
    document.getElementById( 'date' ).innerHTML = `Date: ${ allData.date }`;
    document.getElementById( 'temp' ).innerHTML = `Temperature: ${ allData.temperature } °`;
    document.getElementById( 'content' ).innerHTML = `Your feelings:  ${ allData.userResponse }`;
  }
  catch(error) {
    console.log("error", error);
  }
};

export { performAction }
