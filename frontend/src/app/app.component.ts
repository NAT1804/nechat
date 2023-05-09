import { Component } from '@angular/core';
import { Hello, HelloService } from './services/hello.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  testValue: Observable<Hello> = this.helloService.getHello();

  constructor(private helloService: HelloService) {

  }
}
