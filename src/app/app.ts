import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Toolbar, ToolbarWidget } from '@angular/aria/toolbar';
import { TaskService } from './services/task.service';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher';
import { slideIn } from './animations/task.animations';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Toolbar,
    ToolbarWidget,
    ThemeSwitcherComponent,
  ],
  animations: [slideIn],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Task Manager');
  protected readonly taskService = inject(TaskService);
}
