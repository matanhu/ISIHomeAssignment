import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrls: ['./todos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosPageComponent implements OnInit, OnDestroy {

  public todos: Observable<Array<any>>;
  public pages = new Array<number>();
  public selectedPage = 1;
  private destroyed$ = new Subject();

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.todos = this.todoService.todos;
    this.todoService.totalCount.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((totalCount: number) => {
      this.pages = Array.from({length: (totalCount / 25)}, (v, k) => k+1);
    });

    this.route.params.subscribe(params => {
      const page = +params['page'] || 1;
      this.getData(page);
    });
  }

  getData(page: number = 1) {
    if (!page) {
      page = 1;
    }
    this.selectedPage = 1;
    this.todoService.getTodos(page - 1);
  }

  onImportantChanged(event) {
    this.todoService.onChangeImportant(event.id, event.important);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

}
