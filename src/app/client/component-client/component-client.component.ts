import { Component, OnInit, Renderer2 } from '@angular/core';
import { ScriptService } from '../../Service/script/script.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from 'src/app/emitters/emitter';
import { SocketIOServiceService } from 'src/app/Service/SocketIOService/socket-ioservice.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

const SCRIPT_PATH_LIST = [
  'assets/client/js/jquery-3.3.1.min.js',

  'assets/client/js/menu.js',

  'assets/client/js/lazysizes.min.js',

  'assets/client/js/price-range.js',

  'assets/client/js/slick.js',

  'assets/client/js/bootstrap.bundle.min.js',

  'assets/client/js/bootstrap-notify.min.js',

  'assets/client/js/theme-setting.js',
  'assets/client/js/script.js',
];

@Component({
  selector: 'app-component-client',
  templateUrl: './component-client.component.html',
  styleUrls: ['./component-client.component.css'],
})
export class ComponentClientComponent implements OnInit {
  message: any;
  authenticated!: false;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private ScriptServiceService: ScriptService,
    private http: HttpClient,
    private toastr: ToastrService,
    private SocketIOServiceService: SocketIOServiceService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    
    SCRIPT_PATH_LIST.forEach((e) => {
      const scriptElement = this.ScriptServiceService.loadJsScript(
        this.renderer,
        e
      );
      scriptElement.onload = () => {
        console.log('loaded');

      };
      scriptElement.onerror = () => {
        console.log('Could not load the script!');
      };
    });
  }
  onActive() {
    window.scrollTo(0, 0);
  }
}
