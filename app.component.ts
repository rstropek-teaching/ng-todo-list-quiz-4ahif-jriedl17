import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

interface ITodoItem {
  id: number;
  assignedTo?: string;
  description: string;
  done?: boolean
}

interface IPerson {
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  toDos: Observable<ITodoItem[]>;
  people: Observable<IPerson[]>;
  httpClient: HttpClient;
  name: string = "";
  apiUrl: string = "http://localhost:8080/api";
  currentTodo: ITodoItem = {
    "id": null,
    "assignedTo": null,
    "description": null,
    "done": null
  };
  toAddTodo= {
    "assignedTo": null,
    "description": null,
    "done": null
  };
  constructor(httpClientConstr: HttpClient) {
    this.httpClient = httpClientConstr;
  }

  public getAllToDos() {
    if ($("#getAllToDos").prop('checked')) {
      this.toDos = this.httpClient.get<ITodoItem[]>(this.apiUrl + "/todos");
      $("#ToDoTable tbody").show();
    } else {
      $("#ToDoTable tbody").hide();
    }
  }

  public getUndoneToDos() {
    if ($("#getUndoneToDos").prop('checked')) {
      this.toDos = this.httpClient.get<ITodoItem[]>(this.apiUrl + "/todos").
        map(todo => todo.filter(item => item.done == false));
      $("#ToDoTable tbody").show();
    } else {
      $("#ToDoTable tbody").hide();
    }
  }

  public getAssignedToDos() {
    if ($("#getAssignedToDos").prop('checked')) {
      this.toDos = this.httpClient.get<ITodoItem[]>(this.apiUrl + "/todos").
        map(todo => todo.filter(item => item.assignedTo == $('#currentUser').val()));
      $("#ToDoTable tbody").show();
    } else {
      $("#ToDoTable tbody").hide();
    }
  }

  public getAllPeople() {
    this.people = this.httpClient.get<IPerson[]>(this.apiUrl + "/people");
  }

  public deleteToDo(id: number) {
    this.toDos = this.httpClient.delete<ITodoItem[]>(this.apiUrl + "/todos/" + id);
  }

  public fillUpdateData(id: number, assignedTo: string, description: string, done: boolean) {
    $('#edit').show();
    this.currentTodo.id = id;
    this.currentTodo.assignedTo = assignedTo;
    this.currentTodo.description = description;
    this.currentTodo.done = done;
  }

  public updateData() {
    this.toDos = this.httpClient.patch<ITodoItem[]>(this.apiUrl + "/todos/" + this.currentTodo.id, this.currentTodo);
    $('#edit').hide();
  }

  public showAdd(){
    $('#add').show();
  }

  public addTodo() {
    this.toDos = this.httpClient.post<ITodoItem[]>(this.apiUrl + "/todos", this.toAddTodo);
    $('#add').hide();
  }
}


