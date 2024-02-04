import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  tasks: Task[] = [];
  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['',Validators.required],
      endDate: [''],
      timeSpend: [0, Validators.min(0)],
      isComplete: [false]
    });
  }
  completedTasks: Task[] = [];

  showConfirmationModal = false;
  showDeleteAllModal = false;
  taskToDelete: Task | null = null;
  date: Date = new Date();

  ngOnInit() {
    this.loadTasksFromLocalStorage();
  }

  loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('userTasks');
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];

    const usercompletedTasks = localStorage.getItem('userCompletedTasks');
    this.completedTasks = usercompletedTasks ? JSON.parse(usercompletedTasks) : [];
    this.tasks.forEach(task => {
      task.startDate = task.startDate || '';
      task.endDate = task.endDate || '';
      task.timeSpend = task.timeSpend || 0;
    });
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('userTasks', JSON.stringify(this.tasks));
    localStorage.setItem('userCompletedTasks', JSON.stringify(this.completedTasks));
  }

  editTask(task: Task) {
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
  if (this.taskForm.valid) {
    const newTask = this.taskForm.value;
    if(newTask.isComplete){
      this.completedTasks.push(newTask);
    }
    else{
      this.tasks.push(newTask);
    }
    this.saveTasksToLocalStorage();
    console.log('New Task Added:', newTask);

    // Reset the form after adding a new task
    this.taskForm.reset({
      timeSpend: 0,
      isComplete: false
    });
  }
}

  onTaskCompletionChange(task: Task) {
    if (task.isComplete) {
      this.tasks = this.tasks.filter((t) => !this.areTasksEqual(t, task));
      const completedTaskWithDetails: Task = {
        title: task.title,
        isComplete: task.isComplete,
        startDate: task.startDate,
        endDate: task.endDate,
        timeSpend: task.timeSpend
      };
      this.completedTasks.push(completedTaskWithDetails);
  
      this.saveTasksToLocalStorage();
      console.log('Task Completion Changed:', task);
    }
  }

  areTasksEqual(task1: Task, task2: Task): boolean {
    return (
      task1.title === task2.title &&
      task1.startDate === task2.startDate &&
      task1.endDate === task2.endDate &&
      task1.timeSpend === task2.timeSpend
    );
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
    this.tasks = [];
    this.completedTasks = [];
    this.showDeleteAllModal = false;
    console.log('All Tasks Deleted...');
  }
  
}
