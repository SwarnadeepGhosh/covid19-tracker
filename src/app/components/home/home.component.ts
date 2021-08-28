import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  public pieChart: GoogleChartInterface = {
    chartType: 'PieChart',
  };
  public columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
  };

  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        console.log(result);
        this.globalData = result;

        result.forEach((cs) => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalConfirmed += cs.confirmed;
            this.totalActive += cs.active;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }
        });

        this.initChart();
      },
    });
  }

  initChart() {
    let datatable = [];
    datatable.push(['Country', 'Cases']);

    this.globalData.forEach((cs) => {
      if (cs.confirmed > 3000000) datatable.push([cs.country, cs.confirmed]);
    });

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height: 500,
        title: 'Most affected countries',
        is3D: true,
      },
    };

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height: 500,
        title: 'Country Wise confirmed cases',
        is3D: true,
      },
    };
    
  }
}
