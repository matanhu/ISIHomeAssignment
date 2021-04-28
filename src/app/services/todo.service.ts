import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


const BASE_API_URL = 'https://jsonplaceholder.typicode.com';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private _todosList = new BehaviorSubject<Array<any>>(null);
  get todos(): Observable<Array<any>> {
    return this._todosList.asObservable();
  }

  private _totalCount = new BehaviorSubject<number>(0);
  get totalCount(): Observable<number> {
    return this._totalCount.asObservable();
  }

  private _importantTodos = new Map<number, boolean>();

  constructor(
    private http: HttpClient
  ) { 
    this.getImportants();
  }

  getTodos(page: number = 0): void {
    let params = new HttpParams({ 
      fromObject: {
        _start: `${page * 25}`,
        _limit: '25'
      }
    });
    this.http.get(`${BASE_API_URL}/todos`, {params, observe: 'response'}).pipe(
      tap((res: any) => {
        const todos = (res.body as Array<any>).map((todo) => {
          return {
            ...todo,
            important: this._importantTodos.has(todo.id) ? this._importantTodos.get(todo.id) : false
          }
        });
        this._todosList.next(todos);
        this._totalCount.next(+res.headers.get('x-total-count'));
      })
    ).subscribe();
  }

  onChangeImportant(todoId: number, newVal: boolean) {
    this._importantTodos.set(todoId, newVal);
    this.saveImportants();
  }

  saveImportants() {
    localStorage.setItem('importantTodos', JSON.stringify(Array.from(this._importantTodos.entries())));
  }

  getImportants() {
    const pd = localStorage.getItem('importantTodos');
    if (pd) {
      this._importantTodos = new Map(JSON.parse(pd));
    }
  }
}
