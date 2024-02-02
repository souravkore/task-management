import { Component, HostListener } from '@angular/core';
interface Task {
  title: any;
  startDate?: string;
  endDate?: string;
  timeSpend?: number;
  isComplete: boolean;
}
@Component({
  selector: 'app-task-list-component',
  templateUrl: './task-list-component.component.html',
  styleUrls: ['./task-list-component.component.css']
})
export class TaskListComponentComponent {
  tasks: Task[] = [
    { title: 'Task 1', isComplete: false },
    { title: 'Task 2', isComplete: false },
    { title: 'Task 3', isComplete: false }
  ];

  showConfirmationModal = false;
  showDeleteAllModal = false;
  taskToDelete: Task | null = null;
  date: Date = new Date();

  ngOnInit() {
    this.loadTasksFromLocalStorage();
  }

  ngOnChanges() {
    this.loadTasksFromLocalStorage();
  }

  loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('userTasks');
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];

    // Ensure that each task has default values for startDate, endDate, and timeSpend
    this.tasks.forEach(task => {
      task.startDate = task.startDate || '';
      task.endDate = task.endDate || '';
      task.timeSpend = task.timeSpend || 0;
    });
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('userTasks', JSON.stringify(this.tasks));
  }

  editTask(task: Task) {
    // You can implement a proper form or dialog for editing, this is just a basic example
    const newTitle = prompt('Enter the new task name:', task.title);

    if (newTitle !== null) {
      const index = this.tasks.indexOf(task);

      if (index !== -1) {
        const updatedTask = { ...task, title: newTitle };
        this.tasks[index] = updatedTask;
        this.saveTasksToLocalStorage();
        console.log('Task edited:', updatedTask);
      }
    }
  }

  deleteTask() {
    if (this.taskToDelete) {
      const index = this.tasks.indexOf(this.taskToDelete);
      if (index !== -1) {
        this.tasks.splice(index, 1);
        this.saveTasksToLocalStorage();
        console.log('Task Deleted...');
      }
      this.cancelDeleteTask();
    }
  }

  addNewTask() {
    let title = prompt('Enter the new task name');

    if (title !== null && title.trim() !== '') {
      const newTask: Task = {
        title: title,
        isComplete: false,
        startDate: '',
        endDate: '',
        timeSpend: 0
      };
      this.tasks.push(newTask);
      this.saveTasksToLocalStorage();
      console.log('New Task Added:', newTask);
    }
  }

  onTaskCompletionChange(task: Task) {
    this.saveTasksToLocalStorage();
    console.log('Task Completion Changed:', task);
  }
  onTimeSpendChange(task: Task) {
    this.saveTasksToLocalStorage();
    console.log('Time Spend Changed:', task);
  }
  onEndDateChange(task: Task) {
    this.saveTasksToLocalStorage();
    console.log('End Date Changed:', task);
  }
  onStartDateChange(task: Task) {
    this.saveTasksToLocalStorage();
    console.log('Start Date Changed:', task);
  }

  confirmDeleteTask(task: Task) {
    this.taskToDelete = task;
    this.showConfirmationModal = true;
  }

  cancelDeleteTask() {
    this.taskToDelete = null;
    this.showConfirmationModal = false;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event): string {
    const unsavedChangesMessage = 'You have unsaved changes. Are you sure you want to leave?';
    event.preventDefault();
    return unsavedChangesMessage;
  }

  deleteAllData() {
    this.showDeleteAllModal = true;
  }

  cancelOperationTask() {
    this.showDeleteAllModal = false;
  }

  deleteOperation() {
    localStorage.clear();
    this.tasks = []; // Clear the tasks array
    this.showDeleteAllModal = false;
    console.log('All Tasks Deleted...');
  }
  
}
