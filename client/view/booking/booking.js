let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
};

let closeModal = () => {
  $( '#add-edit-booking-modal' ).modal( 'hide' );
  $( '.modal-backdrop' ).fadeOut();
};

Template.booking.onRendered(function() {



		 $( '#calendar' ).fullCalendar({
		    events( start, end, timezone, callback ) {
			      let data = Reservations.find().fetch().map( ( booking ) => {
			        booking.editable = !isPast( booking.start );
			        //console.log(booking);
			        return booking;
			      });

			      if ( data ) {
			        callback( data );
			      }
			    },
			     eventRender( booking, element ) {
			      element.find( '.fc-widget-content' ).html(
			        `<h4>${ booking.author }</h4>
			         <p class="guest-count">${ booking.title }</p>
			        `
			      );
			    },
			        dayClick( date ) {
				        if(!isPast(date)){  
				      		Session.set( 'bookingModal', { type: 'add', date: date.format() } );
				      		$( '#add-edit-booking-modal' ).modal( 'show' );
				  		}
				    },
				    eventClick( event ) {
				      if(event.editable){ 
					      Session.set( 'bookingModal', { type: 'edit', booking: event._id } );
					      $( '#add-edit-booking-modal' ).modal( 'show' );
					  }    
				    },
				    header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay'
					},
					defaultView: 'agendaWeek',
				    eventOverlap:false
		  });




		  Tracker.autorun( () => {
		    Reservations.find().fetch();
		    $( '#calendar' ).fullCalendar( 'refetchReservations' );
		  });
		});


Template.booking.helpers({ 
    


});


Template.addEditBookingModal.helpers({
  
  avaibleMatch (){
  	let list = Cups.find({'done' : false}, {sort: {submitted: -1}}).fetch();
  	return list;
  },/*
 guests(){
 	let cupTitle =  $( '[name="title"] option:selected' ).value;
 	alert(cupTitle);
 	let cup = Cups.find({'title' : cupTitle}).players;

 },*/
  modalType( type ) {
    let bookingModal = Session.get( 'bookingModal' );
    if ( bookingModal ) {
      return bookingModal.type === type;
    }
  },
  modalLabel() {
    let bookingModal = Session.get( 'bookingModal' );

    if ( bookingModal ) {
      return {
        button: bookingModal.type === 'edit' ? 'Edit' : 'Add',
        label: bookingModal.type === 'edit' ? 'Edit' : 'Add an'
      };
    }
  },
  selected( v1, v2 ) {
    return v1 === v2;
  },
  booking() {
    let bookingModal = Session.get( 'bookingModal' );

    if ( bookingModal ) {
      return bookingModal.type === 'edit' ? Reservations.findOne( bookingModal.booking ) : {
        start: bookingModal.date,
        end: bookingModal.date
      };
    }
  }
});


Template.addEditBookingModal.events({
  'submit form' ( event, template ) {
    event.preventDefault();

    let bookingModal = Session.get( 'bookingModal' ),
        submitType = bookingModal.type === 'edit' ? 'editBooking' : 'addBooking',
        bookingItem  = {
          title: template.find( '[name="title"] option:selected' ).value,
          start: template.find( '[name="start"]' ).value,
          end: template.find( '[name="end"]' ).value,
          //guests: parseInt( template.find( '[name="guests"]' ).value, 10 )
          guest : template.find( '[name="guest"]' ).value
        };

    if ( submitType === 'editBooking' ) {
      bookingItem._id   = bookingModal.booking;
    }

    Meteor.call( submitType, bookingItem, ( error ) => {
      if ( error ) {
        alert( error.reason, 'danger' );
      } else {
        alert( `booking ${ bookingModal.type }ed!`, 'success' );
        closeModal();
      }
    });
  },
   'click .delete-booking' ( event, template ) {
   	event.preventDefault();
    let bookingModal = Session.get( 'bookingModal' );
    if ( confirm( 'Are you sure? This is permanent.' ) ) {
      Meteor.call( 'removeBooking', bookingModal.booking, ( error ) => {
        if ( error ) {
          alert( error.reason, 'danger' );
        } else {
          alert( 'Booking deleted!', 'success' );
          closeModal();
        }
      });
    }
  },
  'change [name=title]' ( event ) {
	let cupTitle =  $( '[name="title"]' ).val();
 	alert(cupTitle);
 	let guests = Cups.findOne({'title' : cupTitle}).players;
 	alert(guests);
  	$('[name="guest"]' ).val(guests);
  }
});