// 'request' package handles making HTTP rest calls to the API
var request = require('request');

// 'msexcel-builder' used to write data into excel spreadsheet
var excelbuilder = require('msexcel-builder');
var workbook = excelbuilder.createWorkbook('./', 'data.xlsx');

var async = require('async');

var sheet1 = workbook.createSheet('sheet1', 20, 200);

// Initialize headers and set specific cell widths
var headers = [ "Champion","Play Rate","Win Rate",
				"Ban Rate","Placement","Gold Gain",
				"Kills","Deaths","Assists",
				"Team Jg Kills","Enemy Jg Kills","Minions Killed",
				"Largest Spree","Healing Done", "Dmg Taken",
				"Dmg Dealt","Experience"
			  ];

for (i = 1; i < 18; i++) {
	var tmp = headers[i-1];
	sheet1.set(i,1,tmp);
	sheet1.align(i,1,'center');
	sheet1.width(i,12);
}
sheet1.width(1,20); // Make the first column (champion names) intentionally wider than the rest

// API used: http://api.champion.gg/

var API_KEY = "5a61f99bc2293f94ce55c11746ca0d0d";

var url1 = "http://api.champion.gg/champion?api_key="+API_KEY;
makeRequest(url1, function(err,result) {

	if (err) {
		console.log("something bad happened");
	}
	else {

		champions = [];

		for (i = 0; i < result.length; i++) {
			champions.push(result[i]['key']);
		}

		// Now, "champions" is a 129-length array that contains the names of every champion
		// champions[0] = "Graves"
		// champions.length = 129

		// For each champion name & role, we need to find their corresponding statistics
		var AllChampsAllRoles = [];
		var counter = 2;

		// Via async map, I can loop through the entire list of champions and make API calls for each one.
		async.map(champions, function(name, callback){
			var url2 = "http://api.champion.gg/stats/champs/"+ name +"?api_key=" + API_KEY;
			makeRequest(url2, function(err,result) {
					if (err) {
						console.log("something really bad happened!");
					}
					else { // parse "result", which contain our individual champion JSON string
						i = 0;
						while (typeof result[i] !== 'undefined' && result[i] !== null) {
							var tmpname = result[i]['title'] + " (" +result[i]['role'] + ")"; // Example: Graves (Jungle)
							AllChampsAllRoles.push(tmp);

							// Name of the champion + role goes into first column
							sheet1.set(1,counter,tmpname);

							// First metric: Play Rate
							sheet1.set(2,counter,result[i]['general']['playPercent']);

							// Second metric: Win Rate
							sheet1.set(3,counter,result[i]['general']['winPercent']);

							// Third metric: Ban Rate
							sheet1.set(4,counter,result[i]['general']['banRate']);

							// Fourth metric: Placement
							sheet1.set(5,counter,result[i]['general']['overallPosition']);

							// Fifth metric: Gold Gain
							sheet1.set(6,counter,result[i]['general']['goldEarned']);

							// Sixth metric: Kills
							sheet1.set(7,counter,result[i]['general']['kills']);

							// Seventh metric: Deaths
							sheet1.set(8,counter,result[i]['general']['deaths']);

							// Eighth metric: Assists
							sheet1.set(9,counter,result[i]['general']['assists']);

							// Ninth metric: Team Jungle Monsters Killed
							sheet1.set(10,counter,result[i]['general']['neutralMinionsKilledTeamJungle']);

							// 10th metric: Enemy Jungle Monsters Killed
							sheet1.set(11,counter,result[i]['general']['neutralMinionsKilledEnemyJungle']);

							// 11th metric: Minions Killed
							sheet1.set(12,counter,result[i]['general']['minionsKilled']);

							// 12th metric: Largest Killing Spree
							sheet1.set(13,counter,result[i]['general']['largestKillingSpree']);

							// 13th metric: Healing Done
							sheet1.set(14,counter,result[i]['general']['totalHeal']);

							// 14th metric: Damage Taken
							sheet1.set(15,counter,result[i]['general']['totalDamageTaken']);

							// 15th metric: Damage Dealt
							sheet1.set(16,counter,result[i]['general']['totalDamageDealtToChampions']);

							// 16th metric: Experience Gained
							sheet1.set(17,counter,result[i]['general']['experience']);

							counter++;
							i++;

						}
					}
					callback();
			});


		}, function(err, results){
			// When here, all mapping has been done, and our spreadsheet has been completely filled. Save and done.
			workbook.save(function(err){
				if (err)
					throw err;
				else
					console.log("workbook successfully created");
			});
		});

	}
});

function makeRequest(url, callback) {
	request(url, function(err,res,body) {
		if (err === null) callback(null, JSON.parse(body));
		else callback(err,null);
	});
}
