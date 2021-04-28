import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-todos-grid',
  templateUrl: './todos-grid.component.html',
  styleUrls: ['./todos-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosGridComponent implements OnInit {

  @Input() todosList: Array<any>;
  @Output() onImportantChanged = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  importantChange(todo) {
    this.onImportantChanged.emit(todo);
  }

}
