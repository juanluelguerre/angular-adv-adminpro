import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

declare function customFunctionInit();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(private settingsService: SettingsService,
              private sidebarService: SidebarService) {
  }

  ngOnInit(): void {

    // Declareted funciontion: "declare function customFunctionInit(); to access global JavaScript function.
    // customs.js updated to create a new function "customFunctionInit() and move inside it all JavaScript initial code".∫
    customFunctionInit();
    this.sidebarService.cargarMenu();

  }

}
