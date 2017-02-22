let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
};

let closeModal = () => {
  $( '#add-edit-booking-modal' ).modal( 'hide' );
  $( '.modal-backdrop' ).fadeOut();
};


function checkOverlap(event) {  

    var start = new Date(event.start);
    var end = new Date(event.end);

    var overlap = $('#calendar').fullCalendar('clientEvents', function(ev) {
        if( ev == event)
            return false;
        var estart = new Date(ev.start);
        var eend = new Date(ev.end);

        return (Math.round(estart)/1000 < Math.round(end)/1000 && Math.round(eend) > Math.round(start));
    });

    if (overlap.length){  
           return false;
       }                

      return true;   
  }

function getGlist(list){
    
    var gList = [];
    for (i in list){
      var g = Meteor.users.findOne(list[i]).username;
      gList.push(g);
    }
    return gList;
  }

function adaptCalendar(){
  if ($(window).width() < 514){
        $('#calendar').fullCalendar( 'changeView', 'agendaDay' );
    } else {
        $('#calendar').fullCalendar( 'changeView', 'month' );
    }
}

Template.booking.onRendered(function() {
      //moment.locale('it');
		 $( '#calendar' ).fullCalendar({
		    events( start, end, timezone, callback ) {
		      let data = Reservations.find().fetch().map( ( booking ) => {
            console.log(booking.authorID, Meteor.userId())
		        booking.editable = !isPast( booking.start ) && booking.authorID == Meteor.userId();
		        //console.log(booking);
		        return booking;
		      });

		      if ( data ) {
		        callback( data );
		      }
		    },
		     eventRender( booking, element ) {
		      var start = moment(booking.start).format('HH:mm');
          var end = booking.start.clone().add(1, 'hour');
          element.find( '.fc-content' ).html(
		        /*`<h4><strong>${ booking.start }</strong>${ booking.author }</h4>
		         <p class="guest-count">${ booking.title }</p>
		        `*/
            '<b>' + start + ' - ' + moment(end).format('HH:mm') +  '</b><br />' 
            + booking.author +'<br />'
            + booking.title
		      );
		    },
	      dayClick( date ) {
          //console.log(date.format('LLL'));
			   var event = new Object();
          event.start = date;        
          event.end = date.clone().add(1, 'hour');
       
          
          if(!isPast(date) && checkOverlap(event)){  
			      		var end = event.end;

                Session.set( 'bookingModal', { 
                  type: 'add', 
                  dateStart: date.format('LLL'),
                  dateEnd : end.format('LLL') 
                });
               
			      		$( '#add-edit-booking-modal' ).modal( 'show' );
			  		}
			    },
			    eventClick( event ) {
			      if(event.editable){ 
				      Session.set( 'bookingModal', { type: 'edit', booking: event._id } );
				      $( '#add-edit-booking-modal' ).modal( 'show' );
				    }    
			    },
          eventDrop (event, delta, revertFunc){
            //console.log(event, delta, revertFunc);
            
              var newMoment = moment(event.start).add(moment(delta._data));
                      
              if(event.editable && !isPast(newMoment._d) && checkOverlap(event)){
                
                var end = newMoment.clone().add(1, 'hour');

                Session.set( 'bookingModal', { 
                  type: 'edit', 
                  booking: event._id,
                  isdragged : true,
                  dateStart: newMoment.format('LLL'),
                  dateEnd : end.format('LLL')
                });
               
                $( '#add-edit-booking-modal' ).modal( 'show' );


                return;
              }

              revertFunc();

          },
			    header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay'
					 },
          /*select: function (start, end) {
              end = start.clone().add(2, 'hour');
              alert('Time block is between ' + start.format() + ' and ' + end.format());
              $('#calendar').fullCalendar('unselect');
          },*/
					defaultView: 'agendaWeek',
				  eventOverlap:false,
          durationEditable: false,
          defaultTimedEventDuration : '01:00:00',
          lang: 'it',
          eventResize: function(event, delta, revertFunc) {
            revertFunc();
          },
          /*select: function(start, end, allDay) {
            alert(start)
            var event = new Object();
            event.start = start;        
            event.end = end;
            alert(!checkOverlap(event));
            if (!checkOverlap(event)) {
              calendar.fullCalendar('unselect');
            }  
        }*/
        selectOverlap : false,
        windowResize: function(view) {
          adaptCalendar();
        },
         aspectRatio: 2
		  });

		  Tracker.autorun( () => {
		    Reservations.find().fetch();
		    $( '#calendar' ).fullCalendar('refetchEvents');
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
        button: bookingModal.type === 'edit' ? 'Modifica' : 'Prenota',
        label: bookingModal.type === 'edit' ? 'Modifica' : 'Prenota'
      };
    }
  },
  selected( v1, v2 ) {
    return v1 === v2;
  },
  booking() {
    let bookingModal = Session.get( 'bookingModal' );

    /*function getBooking(mode, bookingModal){
      console.log(mode);
      var b = {
        'editClick' : function(){
          alert('a');
          return Reservations.findOne( bookingModal.booking );
        },
        'editDrag' : function(){
          alert('b');
          return {
                  title : bookingModal.title,
                  guest : bookingModal.guest,
                  start : bookingModal.dateStart,
                  end   : bookingModal.dateEnd  
                };
        },
        'add' : function(){
          alert('c');
          return {
                  start: bookingModal.dateStart,
                  end:   bookingModal.dateEnd  
                };
        }
      }
      
      return b[mode];          
      
    }*/

    if ( bookingModal ) {
      
        if(bookingModal.type === 'edit' && bookingModal.isdragged){
         
          //console.log(getBooking('editDrag', bookingModal))
          //return getBooking('editDrag', bookingModal);
          let currentB = Reservations.findOne( bookingModal.booking );
          return {
                  title : currentB.title,
                  guest : currentB.guest,
                  start : bookingModal.dateStart,
                  end   : bookingModal.dateEnd  
                };

        }
        
        else if (bookingModal.type === 'edit' && !bookingModal.isdragged){
          
           //console.log(getBooking('editClick', bookingModal))
           //return getBooking('editClick', bookingModal);
           return Reservations.findOne( bookingModal.booking );
         }

         else{
          //console.log(getBooking('add', bookingModal))
         
            //return getBooking('add', bookingModal);
          return  {
                  start: bookingModal.dateStart,
                  end:   bookingModal.dateEnd  
                };  
         } 

      
      /*return (bookingModal.type === 'edit' && !bookingModal.isdragged) ? Reservations.findOne( bookingModal.booking ) : {
        start: bookingModal.dateStart,
        end:   bookingModal.dateEnd
      };*/
    }
  }
});


Template.addEditBookingModal.events({
  'submit form' ( event, template ) {
    event.preventDefault();

    let userID = Meteor.userId(),
        guestIDs = template.find( '[name="guest"]' ).value,
        bookingModal = Session.get( 'bookingModal' ),
        submitType = bookingModal.type === 'edit' ? 'editBooking' : 'addBooking',
        bookingItem  = {
          title: template.find( '[name="title"] option:selected' ).value,
          start: template.find( '[name="start"]' ).value,
          end: template.find( '[name="end"]' ).value,
          authorID : userID,
          author : Meteor.users.findOne(userID).username,
          //guests: parseInt( template.find( '[name="guests"]' ).value, 10 )
          guestIDs : template.find( '[name="guestIDs"]' ).value,
          guest : template.find( '[name="guest"]' ).value
        };

        console.log(bookingModal);

    if ( submitType === 'editBooking' ) {
      bookingItem._id   = bookingModal.booking;
    }

    Meteor.call(submitType, bookingItem, ( error ) => {
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
   	let guestIDs = Cups.findOne({'title' : cupTitle}).players;
   	let guests = getGlist(guestIDs);
    $('[name="guest"]' ).val(guests);
    $('[name="guestIDs"]' ).val(guestIDs);
  }
});