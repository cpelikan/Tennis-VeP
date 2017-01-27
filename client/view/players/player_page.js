Template.playerPage.helpers({
 	email : function(){
 	
		var e = this.emails[0].address;
		console.log(this.emails)
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
 	points : function(){
 		return Rankingset.findOne({"playerUserId" : this._id}).points;
 	},
 	profileNotComplete : function(){
 		if(!this.profile.name || !this.profile.surname)
 			return true;
 		return false;
 	},
  avatar : function(){
    return Images.findOne({"_id" : this.profile.avatar});
  }
});


Template.playerPage.events({
	'submit form' : function(e){
		e.preventDefault();
		var name = $('#name').val();
		var surname = $('#surname').val();
		console.log(name + '' + surname);

		Meteor.users.update(Meteor.userId(), {
                $set: {
                	"profile.name" : name,
                	"profile.surname" : surname
                }
            }, function(error) {
                if (error) {
                    console.log(error.reason);
                } else  {
                	alert("Profilo aggiornato")    
                }
        });
	}
});




Template.uploadedFiles.helpers({
  uploadedFiles: function () {
    return Images.find();
  }
});

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({
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