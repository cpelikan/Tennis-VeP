Template.register.onRendered(function() {
		$('body').vegas({
		    slides: [
		      {src: '/images/slideshow/1.jpg'},
		      {src: '/images/slideshow/2.jpg'},
		      {src: '/images/slideshow/3.jpg'}
		    ],
		        overlay: true
		  });	
		$('body').addClass('auth');
});


Template.register.events({
		 /*   'submit form' ( event, template ) {
		    event.preventDefault();
		    
		    let user = {
		      email: template.find( '[name="registerEmail"]' ).value,
		      password: template.find( '[name="registerPassword"]' ).value
		    };

		    Accounts.createUser( user, ( error ) => {
		      if ( error ) {
		        Bert.alert( error.reason, 'danger' );
		      } else {
		        Meteor.call( 'sendVerificationLink', ( error, response ) => {
		          if ( error ) {
		            Bert.alert( error.reason, 'danger' );
		          } else {
		            Bert.alert( 'Welcome!', 'success' );
		          }
		        });
		      }
		    });
		  }
	*/	  
    'submit form': function(event){
        event.preventDefault();
        var usernameVar = event.target.registerUsername.value;
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        
        Accounts.createUser({
		    username : usernameVar,
		    email: emailVar,
		    password: passwordVar
		}, function(error) {
		  if (error)
		    alert(error.reason);
		  	
		  	return;
		});

       
    }
});

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar, function(error){
        	if (error)
        	alert(error.reason);

        	return;
        });
    }
});

Template.logout.events({
    'click #logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
});