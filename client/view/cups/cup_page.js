
Template.cupPage.helpers({
    username: function() {
        var p = Meteor.users.findOne({
            _id: this + ""
        });
        return p.username;
    },

    typeName : function(){
        
        function getTypeName(type){
            var typeName = {
                "1" : "Solo andata",
                "2" : "Andata e ritorno",
                "3" : "KnockOut",
                "default" : "-------------"
            };

            return (typeName[type] || typeName['default']);
        }     

        var tN = getTypeName(this.cup.type);
       
        return tN;
    },
    showTable : function (){
        if(this.cup.type == 3)
            return false;
        else
            return true;
    },
    matchPlayers: function() {

         var p1 = Meteor.users.findOne({
            _id: this.players[0].id
        });
        var p2 = Meteor.users.findOne({
            _id: this.players[1].id
        });

        var p1Score = this.players[0].score;
        var p2Score = this.players[1].score;
       
        var mp = {
            //concats: p1.username + " - " + p2.username,
            p1: {
                name : p1.username,
                id : p1._id,
                score : p1Score
            },
            p2: {
                name : p2.username,
                id : p2._id,
                score : p2Score
            }  
            
        }

        //return p1.username + " - " + p2.username;
        return mp;
    },
    p1win: function() {
        return (Number(this.players[0].score) > Number(this.players[1].score))
    },
    p2win: function() {
        return (Number(this.players[1].score) > Number(this.players[0].score))
    },
    toPlay: function() {
        return this.winner.trim() === '';
    },
   
    tableCup: function() {

        var pList = this.cup.players;

        var table = [];

        var tableCupID = "tableCup_" + this.cup._id;

        Session.set("typeCup_" + this.cup._id, this.cup.type);

        for (var i in pList) {
            // GEnerale classifica var w = Matches.find({winner : pList[i]}).count();
            var w = Matches.find({
                cup: this.cup._id,
                winner: pList[i]
            }).count();
            var p = Meteor.users.findOne({
                _id: pList[i]
            });


            var playerMatches = Matches.find({
                cup: this.cup._id,
                players: {
                    $elemMatch: {
                        id: pList[i]
                    }
                }
            }, {
                sort: {
                    submitted: -1
                }
            }).fetch();
            var deltaMatch = 0;
            for (var pm in playerMatches) {
                for (var pl in playerMatches[pm].players) {
                    if (playerMatches[pm].players[pl].id == pList[i])
                        deltaMatch = deltaMatch + Number(playerMatches[pm].players[pl].score);
                    else
                        deltaMatch = deltaMatch - Number(playerMatches[pm].players[pl].score);
                }
            }

            var item = {
                winning: w,
                username: p.username,
                id: p._id,
                deltaMatch: deltaMatch
            }

            table.push(item);
        };


        /*var tmpSort = table.sort(
            function(a, b) {
                return a.deltaMatch - b.deltaMatch
            });

        var tmpOutput = tmpSort.reverse();*/

        var sort = table.sort(
            function(a, b) {
                return a.winning - b.winning
            });

        var output = sort.reverse();

        Session.set(tableCupID, output);


         return output;

        //return Matches.find({winner : ''}).count();
    }

});



Template.cupPage.events({
    'submit form': function(e) {

        e.preventDefault();


        var p1 = $(e.target).find('[name=p1Score]');
        var p2 = $(e.target).find('[name=p2Score]');

        var p1Score = Number(p1.val().trim());
        var p2Score = Number(p2.val().trim());

        var isValidResult = (p1Score >= 0 && p2Score >= 0) && (p1Score != p2Score);

        var thisCup = this.cup;

        var tableCupID = "tableCup_" + thisCup;

        function playOffBuilder(cupID, playersList) {

            var teams = playersList;
            var typeCup = Session.get("typeCup_" + cupID);

            var matches = [];

            if (typeCup != 3) {
                for (var x = 0; x < teams.length; x++) {
                    for (var y = x + 1; y < teams.length; y++) {
                        if (x != y) {
                            var m = matchBuilder({cupID : cupID, teams : teams, x : x, y : y, runoff : true, orig : 'playoff'});
                            matches.push(m);
                        }
                    }
                }
            } else {

                for (var x = 0; x < teams.length; x += 2) {
                    var y = x + 1;
                    if (x != y) {
                        var m = matchBuilder({cupID : cupID, teams : teams, x : x, y : y, runoff : false, orig : 'playoff' });
                        matches.push(m);
                    }

                }

            }

            for (var m in matches) {
                //console.log(matches[m]);
                Meteor.call('match', matches[m], function(error, id) {
                    if (error)
                        return alert(error.reason);

                });
            }


        }


        function setCupWinner(thisCup) {
            var c = Cups.findOne(thisCup);
            var areOnlyTwoPlayer = (c.players.length == 2);

            var paramToUpdate;

            if (areOnlyTwoPlayer) {
                paramToUpdate = {
                    done : true
                };
            }
            else{
                paramToUpdate = {
                    winner: Session.get("tableCup_" + thisCup)[0].id,
                    done : true
                };
            }

            var cupBonus = Cups.findOne(thisCup).bonus;

            Cups.update(thisCup, {
                $set: paramToUpdate
            }, function(error) {
                if (error) {
                    console.log(error.reason);
                } else if (!areOnlyTwoPlayer) {
                    arg = {
                        'winner': paramToUpdate.winner,
                        'bonus': cupBonus,
                        'where': 'cupsWon',
                        'what': thisCup
                    };

                    updateRanking(arg);
                    console.log("done");
                }
            });
        }

        function checkWinner(thisCup) {
            var tableCup = Session.get("tableCup_" + thisCup);
            var tableCupLeadWinning = tableCup[0].winning;
            var leaders = [];

            for (p in tableCup) {
                if (tableCup[p].winning == tableCupLeadWinning) {
                    leaders.push(tableCup[p]);
                }
            }

            return leaders;

        }

        function cupWinnerStrategy(thisCup) {
            var c = Cups.findOne(thisCup);
            var areOnlyTwoPlayer = c.players.length == 2;
            
            var leaders = checkWinner(thisCup);

            console.log(leaders);
            if (leaders.length == 1) {
                
                alert("Il vincitore è " + leaders[0].username + "!");

                setCupWinner(thisCup);
              
            } else {
                if(c.type!=3)
                alert("Nessun vincitore, spareggio necessario");
                //playOffBuilder(thisCup);
                playOffBuilder(thisCup, leaders);
            }
        }

        function updateRanking(arg) {

            var user = arg.winner;
            var bonus = arg.bonus;
            var where = (arg.where == 'matchesWon') ? 'matchesWon' : 'cupsWon';
            var what = arg.what;
            var push;

            alert("USER TO UPDATE for " + where);


            function getWhere(where){
                var push = {
                   'matchesWon' : function(){
                        return  {
                            matchesWon: what
                        };

                                               
                    },
                    'cupsWon' : function(){
                       return {
                            cupsWon: what
                        };

                    },
                    'default' : function(){
                       return {
                            matchesWon: what
                        };

                    }
                }

                return (push[where] || push['default'])();

            }

            var push = getWhere(where);

            console.log(push)

            var ranking = Rankingset.findOne({
                playerUserId: user
            });

            Rankingset.update(ranking._id, {
                $push: push
            });
            Rankingset.update(ranking._id, {
                $inc: {
                    points: bonus
                }
            });

        }


        if (isValidResult) {

            if (confirm('Sei sicuro del risultato? Non potrai più modificarlo!')) {

                var currentMatchId = this._id;
                var isRunOff = this.runoff;

                var players = [{
                    "id": p1.attr('data-pid'),
                    "score": p1Score
                }, {
                    "id": p2.attr('data-pid'),
                    "score": p2Score
                }];



                function getWinner(p1, p2) {

                    var p1Val = Number(p1.val());

                    var p2Val = Number(p2.val());

                    var winner = (p1Val > p2Val) ? p1.attr('data-pid') : p2.attr('data-pid');

                    return winner;
                }


                var winner = getWinner(p1, p2);


                Matches.update(currentMatchId, {
                    //$set: players
                    $set: {
                        "players": players,
                        "winner": winner
                    }
                }, function(error) {
                    if (error) {
                        // display the error to the user
                        console.log(error.reason);
                    } else {
                        p1.prop('disabled', true);
                        p2.prop('disabled', true);

                        arg = {
                            'winner': winner,
                            'bonus': 1,
                            'where': 'matchesWon',
                            'what': currentMatchId
                        };

                        if (!isRunOff) {
                            updateRanking(arg);
                        }

                        //SET CUP WINNER
                        if (Matches.find({
                                cup: thisCup,
                                winner: ""
                            }).count() === 0) {


                            cupWinnerStrategy(thisCup);

                        }

                    }
                });


                //var thisCup = location.href.split('/').pop()+"";



            } else {
                return;
            }

        } else {
            alert("Risulato non valido");
            p1.val('');
            p2.val('');
        }


    }
});