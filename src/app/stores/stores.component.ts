import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {

  stores: any;

  constructor(private http: HttpClient, public router: Router) { 
    this.getStores()
  }

  ngOnInit(): void {
    
  }

  async getStores() {
    this.stores = await this.http.get(`${environment.backend_uri}/stores/get`).toPromise()
    console.log(this.stores)
  }

  async getDetails(event: any) {

    let options = {
      category : event.category,
      doc_id : event.id
    }
    
    console.log(options.category, options.doc_id)

    await this.http.post(`${environment.backend_uri}/store/input`, options).toPromise()
    
  }

}
