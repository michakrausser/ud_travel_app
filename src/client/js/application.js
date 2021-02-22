//API Data
const baseUrl = "http://api.geonames.org/searchJSON?q=";

const username = "&maxRows=10&username=michakrausser";

// Create a new date instance dynamically with JS
let d = new Date();
const months = [ "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December" ];

let today = d.getDate() + '. ' + months[ d.getMonth() ] + ' ' + d.getFullYear();


document.getElementById( 'generate' ).addEventListener( 'click', performAction );

async function performAction( e ) {

  e.preventDefault()

  // Get ZIP
  const location =  document.getElementById( 'zip' ).value;

  // Get user response
  const userResponse =  document.getElementById( 'feelings' ).value;

  // API Call
  if ( location ) {
    fetch( baseUrl + location + username )
      .then( result => result.json() )
      .then( result => {
        console.log( result );
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

// API call, get data

const getWeatherData = async ( baseURL, zip, key ) => {

  console.log( 'url: ', baseURL, zip, key);

  const res = await fetch( baseURL + zip + key )

  try {

    const data = await res.json();
    console.log( 'Data_of_api: ', data )
    return data;

  }  catch( error ) {
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
