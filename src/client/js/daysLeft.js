
function daysLeft( startTrip ) {

  const d = new Date();

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

export  {
  daysLeft
}
