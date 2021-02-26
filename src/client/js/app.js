import { performAction, add15days, newTrip} from "./performAction";

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

export {
  dateControl,
  d
}
