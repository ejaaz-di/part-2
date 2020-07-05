"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//let csv is the CSV file with headers
var csv_parser_1 = __importDefault(require("csv-parser"));
var fs_1 = __importDefault(require("fs"));
function noMatchesPlayed(csvfile) {
    var results = [];
    fs_1.default.createReadStream(csvfile)
        .pipe(csv_parser_1.default())
        .on('data', function (data) { return results.push(data); })
        .on('end', function () {
        var lookup = {};
        var items = results;
        var result = [];
        var played_matches_per_year = 0;
        var remaining_year = 0;
        for (var item = void 0, i = 0; item = items[i++];) {
            var season = item.season;
            if (i == 1) {
                remaining_year = season;
            }
            if (!(season in lookup)) {
                if (played_matches_per_year != 0) {
                    console.log("No. of Matches Played in ", season, " are ", played_matches_per_year);
                    played_matches_per_year = 0;
                }
                lookup[season] = 1;
                result.push(season);
            }
            else {
                played_matches_per_year++;
            }
        }
        console.log("No. of Matches Played in ", remaining_year, " are ", played_matches_per_year, '\r\n');
    });
}
console.log('\r\n', "1. Number of matches played per year of all the years in IPL", '\r\n');
noMatchesPlayed('./matches.csv');
/* ------------------------------------------------------------------------------------------------------ */
function noMatchesWon(csvfile) {
    var results = [];
    fs_1.default.createReadStream(csvfile)
        .pipe(csv_parser_1.default())
        .on('data', function (data) { return results.push(data); })
        .on('end', function () {
        console.log("2. Number of matches won of all teams over all the years of IPL.", '\r\n');
        var lookup_winner = {};
        var items_winner = results;
        var won_matches_by_team = 0;
        var result = [];
        for (var item_winner = void 0, i = 0; item_winner = items_winner[i++];) {
            var winner = item_winner.winner;
            if (!(winner in lookup_winner)) {
                console.log("No. of won by ", winner, " - ", winner.length);
                lookup_winner[winner] = 1;
                result.push(winner);
            }
            else {
                won_matches_by_team++;
            }
        }
    });
}
noMatchesWon('./matches.csv');
/* ------------------------------------------------------------------------------------------------------ */
function extraRunsConducted(csvfile) {
    var results = [];
    fs_1.default.createReadStream(csvfile)
        .pipe(csv_parser_1.default())
        .on('data', function (data) { return results.push(data); })
        .on('end', function () {
        console.log('\r\n', "3. For the year 2016 get the extra runs conceded per team.", '\r\n');
        var lookup_runs = {};
        var items_runs = results;
        var total_run = 0;
        var result = [];
        for (var item_runs = void 0, i = 0; item_runs = items_runs[i++];) {
            var season_winner = item_runs.season;
            var season_winner_runs = item_runs.win_by_runs;
            var extra_run_winner = item_runs.winner;
            if (season_winner == 2016) {
                if (!(extra_run_winner in lookup_runs)) {
                    lookup_runs[extra_run_winner] = season_winner_runs;
                    result.push(extra_run_winner);
                }
                else {
                    lookup_runs[extra_run_winner] = (+lookup_runs[extra_run_winner]) + (+season_winner_runs);
                }
            }
        }
        console.log(lookup_runs);
    });
}
extraRunsConducted('./matches.csv');
/* ------------------------------------------------------------------------------------------------------ */
function topEconomicBowler(csvfile_matches, csvfile_deleveres, season_year) {
    var results_match = [];
    var results_bowl = [];
    fs_1.default.createReadStream(csvfile_matches)
        .pipe(csv_parser_1.default())
        .on('data', function (data) { return results_match.push(data); })
        .on('end', function () {
        console.log('\r\n', "4. For the year 2015 get the top economical bowlers.", '\r\n');
        /* Taking year id */
        var year_id = {};
        results_match.forEach(function (element) {
            if (element.season == season_year) {
                year_id[element.id] = 1;
            }
        });
        fs_1.default.createReadStream(csvfile_deleveres)
            .pipe(csv_parser_1.default())
            .on('data', function (data) { return results_bowl.push(data); })
            .on('end', function () {
            var lookup_economy = {};
            var count_ball = {};
            var items_economy = results_bowl;
            for (var item_economy = void 0, i_1 = 0; item_economy = items_economy[i_1++];) {
                var bowler = item_economy.bowler;
                var total_runs_bow = item_economy.total_runs;
                var bowling_data_id = item_economy.match_id;
                if (bowling_data_id in year_id) {
                    if (!(bowler in lookup_economy)) {
                        lookup_economy[bowler] = total_runs_bow;
                        count_ball[bowler] = 1;
                        results_match.push(bowler);
                    }
                    else {
                        lookup_economy[bowler] = (+lookup_economy[bowler]) + (+total_runs_bow);
                        count_ball[bowler] = (+count_ball[bowler]) + 1;
                    }
                }
            }
            var bowers_final_economy = {};
            for (var i in count_ball) {
                bowers_final_economy[i] = (lookup_economy[i] / (+(count_ball[i]) / 6));
            }
            var array_sorted = [];
            for (var a in bowers_final_economy) {
                array_sorted.push([a, bowers_final_economy[a]]);
            }
            array_sorted.sort(function (a, b) { return a[1] - b[1]; }).slice(0, 10);
            console.log(array_sorted.slice(0, 10));
        });
    });
}
topEconomicBowler('./matches.csv', './deliveries.csv', 2015);
