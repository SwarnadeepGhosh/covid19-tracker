import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/06-24-2021.csv`;

  constructor(private http: HttpClient) {}

  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        //let data: GlobalDataSummary[] = [];
        let raw = {}; // Intialising a dictionary which will hold Country as key and its values
        let rows = result.split('\n');
        rows.splice(0, 1);

        rows.forEach((row) => {
          let cols = row.split(/,(?=\S)/); // This will split in ',' and ignore ', ' which is a field value
          let cs = {
            country: cols[3],
            confirmed: +cols[7], // + operator converts string to integer
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };

          // Grouping by Countries (Adding different states values of same countries)
          let temp: GlobalDataSummary = raw[cs.country]; //fetching current country value from raw if there is a match
          if (temp) {           // If the country already added, then add the values in same country
            temp.confirmed += cs.confirmed
            temp.deaths += cs.deaths
            temp.recovered += cs.recovered
            temp.active += cs.active
          } 
          else { // If not added, add it into raw 
            raw[cs.country] = cs
          }
        });

        //console.log(raw);
        return <GlobalDataSummary[]>Object.values(raw);
      })
    );
  }
}
