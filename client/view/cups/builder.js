//Meteor.myFunctions = {

    matchBuilder = function(args) {
    	var cupID  = args.cupID,
                teams  = args.teams, 
                x      = args.x,
                y      = args.y, 
                runoff = args.runoff,
                orig   = (args.orig) ? args.orig : 'playoff';

            var r = {};
            var pList = [];
            var p1 = {};
            var p2 = {};
            p1.id = (args.orig =='playoff') ? teams[x].id : teams[x];
            p2.id = (args.orig =='playoff') ? teams[y].id : teams[y];
            p1.score = " ";
            p2.score = " ";
            r.cup = cupID;
            pList.push(p1);
            pList.push(p2);
            r.players = pList;
            r.result = p1.score + " - " + p2.score;
            r.winner = "";
            r.runoff = runoff;
            r.done = false;

            return r;
    }

//}