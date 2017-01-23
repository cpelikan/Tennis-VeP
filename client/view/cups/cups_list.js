Template.cupsList.helpers({ 
  cups: function() {    
    return Cups.find({}, {sort: {submitted: -1}}); 
  }
});