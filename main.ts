import $ from "jquery";
//let csv is the CSV file with headers
import csv from 'csv-parser';
import fs from 'fs';
 
function noMatchesPlayed(csvfile: string){
    const results: any = [];
    fs.createReadStream(csvfile)
    .pipe(csv())
    .on('data', (data: any) => results.push(data))
    .on('end', () => {
        let lookup: any = {};
        let items = results;
        let result = [];
        let played_matches_per_year = 0;
        let remaining_year: number = 0;
        for (let item, i = 0; item = items[i++];) {
            let season: number = item.season;
            if(i == 1){
            remaining_year = season;
            }
            if (!(season in lookup)) {
            if(played_matches_per_year != 0){
                console.log("No. of Matches Played in ",season," are ",played_matches_per_year);
                played_matches_per_year = 0;
            }
            lookup[season] = 1;
            result.push(season);
            } else {
            played_matches_per_year++;
            }
        }
        console.log("No. of Matches Played in ",remaining_year," are ",played_matches_per_year,'\r\n');
    });
}
console.log('\r\n',"1. Number of matches played per year of all the years in IPL",'\r\n');
noMatchesPlayed('./matches.csv');

/* ------------------------------------------------------------------------------------------------------ */

function noMatchesWon(csvfile: string){
    const results: any = [];
    fs.createReadStream(csvfile)
    .pipe(csv())
    .on('data', (data: any) => results.push(data))
    .on('end', () => {
        console.log("2. Number of matches won of all teams over all the years of IPL.",'\r\n');
        let lookup_winner: any = {};
        let items_winner = results
        let won_matches_by_team = 0;
        let result = [];
        for (let item_winner, i = 0; item_winner = items_winner[i++];) {
            let winner: string = item_winner.winner;
        
            if (!(winner in lookup_winner)) {
            console.log("No. of won by ",winner," - ",winner.length);
            lookup_winner[winner] = 1;
            result.push(winner);
            } else {
            won_matches_by_team++;
            }

        }
    });
}

noMatchesWon('./matches.csv');

/* ------------------------------------------------------------------------------------------------------ */

function extraRunsConducted(csvfile: string){
    const results: any = [];
    fs.createReadStream(csvfile)
    .pipe(csv())
    .on('data', (data: any) => results.push(data))
    .on('end', () => {
        console.log('\r\n',"3. For the year 2016 get the extra runs conceded per team.",'\r\n');
        let lookup_runs: any = {};
        let items_runs = results;
        let total_run = 0;
        let result = [];
        for (let item_runs, i = 0; item_runs = items_runs[i++];) {
      
          let season_winner: number = item_runs.season;
          let season_winner_runs: number = item_runs.win_by_runs;
          let extra_run_winner = item_runs.winner;
          if(season_winner == 2016){
            if (!(extra_run_winner in lookup_runs)) {
              lookup_runs[extra_run_winner] = season_winner_runs;
              result.push(extra_run_winner);
            } else{
              lookup_runs[extra_run_winner] = (+lookup_runs[extra_run_winner]) + (+season_winner_runs);
            }
          }
      
        }
        console.log(lookup_runs);
    });
}

extraRunsConducted('./matches.csv');

/* ------------------------------------------------------------------------------------------------------ */

function topEconomicBowler(csvfile_matches: string, csvfile_deleveres: string, season_year: number){
    const results_match: any = [];
    const results_bowl: any = [];
    fs.createReadStream(csvfile_matches)
    .pipe(csv())
    .on('data', (data: any) => results_match.push(data))
    .on('end', () => {
        console.log('\r\n',"4. For the year 2015 get the top economical bowlers.",'\r\n');

        /* Taking year id */
        let year_id: any = {};
        results_match.forEach((element: { season: number; id: string | number; }) => {
            if(element.season == season_year){
                year_id[element.id] = 1;
            }
        });

        fs.createReadStream(csvfile_deleveres)
        .pipe(csv())
        .on('data', (data: any) => results_bowl.push(data))
        .on('end', () => {
            
            let lookup_economy: any = {};
            let count_ball:any = {};
            let items_economy = results_bowl;

            for (let item_economy, i = 0; item_economy = items_economy[i++];) {
    
                let bowler = item_economy.bowler;
                let total_runs_bow: number = item_economy.total_runs;
                let bowling_data_id = item_economy.match_id;
                if(bowling_data_id in year_id){
                  if (!(bowler in lookup_economy)) {
                    lookup_economy[bowler] = total_runs_bow;
                    count_ball[bowler] = 1;
                    results_match.push(bowler);
                  } else {
                    lookup_economy[bowler] = (+lookup_economy[bowler]) + (+total_runs_bow);
                    count_ball[bowler] = (+count_ball[bowler]) + 1;
                  }
                }
            }

            let bowers_final_economy: any = {};
            for(var i in count_ball)
            {
            bowers_final_economy[i] = (lookup_economy[i]/(+(count_ball[i]) / 6));
            }
            let array_sorted=[];
            for(const a in bowers_final_economy){
            array_sorted.push([a,bowers_final_economy[a]]);
            }
            array_sorted.sort(function(a,b){return a[1] - b[1]}).slice(0, 10);
            console.log(array_sorted.slice(0,10));
            
        });

        
    });
}

topEconomicBowler('./matches.csv','./deliveries.csv',2015);