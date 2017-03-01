Template.playerPage.helpers({
 	email : function(){
 
		var e = this.emails[0].address;
		return e;
 		
 	},

 	isCurrentUser : function(){
 		if (Meteor.userId()==this._id){
 			return true;
 		}
 		return false;
 	},
 	level : function(){
 		

 		function checkRange(average, from, to) {
			 if (average >= from && average <= to) { return average; }
			 else { return !average; }
			}


 		var rs = Rankingset.findOne({playerUserId : this._id});
 		var points = rs.points;
 		
 		if (points > 1000)
 			return "Master";

 		switch(points){
 			case checkRange(points, 1, 10):
 			return "Principiante";
 			break;

 			case checkRange(points, 11, 50):
 			return "Dilettante";
 			break;

 			case checkRange(points, 51, 200):
 			return "Esperto";
 			break;

 			case checkRange(points, 201, 500):
 			return "Professionista";
 			break;

 			case checkRange(points, 501, 1000):
 			return "Campione";
 			break; 			

 			default :
 			return "Novellino";
 			
 		}

 		
 	},
  positioning : function(){
    var table = getRanking();
    var userID = this._id;
    for (i in table){
        if (table[i].userId == userID){
          var pos = Number(i)+Number(1);
          return Number(pos);
        }
    }
    console.log(table);
  },
  avatar : function(){
    return Images.findOne({"_id" : this.profile.avatar});
  },
  address : function(){
    var a = {
      buildings : ["", "A","B","C","D","E","F","G","H","I","L"],
      floor     : ["", "0", "1","2","3","4", "5"],
      int       : ["", "1" ,"2", "3", "4"]
    };
    return a; 
  },
  selectedAddress : function(what, current){
    return this.profile.address[what] == current;  
  }
});


Template.playerPage.events({
	'submit form' : function(e){
		e.preventDefault();
		var name = $('#name').val();
		var surname = $('#surname').val();
		var claim = $('#claim').val();
    var building = $('#building').val();
    var floor = $('#floor').val();
    var int = $('#int').val();
    var phone = $('#phone').val();


		Meteor.users.update(Meteor.userId(), {
                $set: {
                	"profile.name" : name,
                	"profile.surname" : surname,
                  "profile.claim" : claim,
                  "profile.phone" : phone,
                  "profile.address.building" : building,
                  "profile.address.floor" : floor,
                  "profile.address.int" : int

                }
            }, function(error) {
                if (error) {
                    console.log(error.reason);
                } else  {
                	alert("Profilo aggiornato")    
                }
        });
	},
    'click #changePswEvnt': function (e, template) {
      
      var errorMessage = "Password incorrect";
      var oldPassword = document.getElementById('oldPassword').value;
      var newPassword = document.getElementById('newPassword').value;
      var newPasswordConfirm = document.getElementById('newPasswordConfirm').value;
      
      var newPasswordIsValid = newPassword.length > 0 && newPassword != ' ' && newPassword == newPasswordConfirm;
      
      function resetField(){
        
      }


      console.log(newPasswordIsValid, newPassword.length > 0 , newPassword != ' ' ,newPassword == newPasswordConfirm )

      if(newPasswordIsValid){
        
        console.log(0 , newPassword == newPasswordConfirm);
        Accounts.changePassword(oldPassword, newPassword, function(error, id){
          if(error){
            console.log(1,error);  
            alert(error.reason);
            return;
          }

            alert('ok');
            
            /*Router.go('playerPage', {
                _id: id
            });*/
        });

         return;
      }

     
        alert(errorMessage);
        
  
  }
});




Template.uploadedFiles.helpers({
  uploadedFiles: function () {
    return Images.find();
  }
});

Template.uploadAvatar.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadAvatar.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadAvatar.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case 
      // there was multiple files selected
      var file = e.currentTarget.files[0];
      if (file) {
        var uploadInstance = Images.insert({
          file: file,
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
          template.currentUpload.set(this);
        });

        uploadInstance.on('end', function(error, fileObj) {
          if (error) {
            alert('Error during upload: ' + error.reason);
          } else {
            //alert('File "' + fileObj.name + '" successfully uploaded');
            Meteor.users.update(Meteor.userId(), {
                    $set: {
                      "profile.avatar" : fileObj._id
                    }
                }, function(error) {
                    if (error) {
                        console.log(error.reason);
                    } 
            });
          }
          template.currentUpload.set(false);
        });

        uploadInstance.start();
      }
    }
  }
});

/*Template.changePsw.events({
  
})*/