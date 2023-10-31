import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

interface Task {
  title: string;
  isComplete: boolean;
}
@Component({
  selector: 'app-task-list-component',
  templateUrl: './task-list-component.component.html',
  styleUrls: ['./task-list-component.component.css']
})
export class TaskListComponentComponent {
  constructor(private renderer: Renderer2, private el: ElementRef) {
    // Add the page refresh confirmation
    this.addPageRefreshConfirmation();
  }

  tasks: Task[] = [
    { title: 'Task 1', isComplete: false },
    { title: 'Task 2', isComplete: false },
    { title: 'Task 3', isComplete: false }
  ];

  showConfirmationModal = false;

  taskToDelete: Task | null = null;

  date:Date = new Date(); 

  editTask(task: Task) {
    // Prompt the user for a new task name
    const newTitle = prompt('Enter the new task name:', task.title);

    if (newTitle !== null) {
      // Find the index of the task in the array
      const index = this.tasks.indexOf(task);

      if (index !== -1) {
        // Create a copy of the task
        const updatedTask = { ...task };

        // Update the title of the copy with the user's input
        updatedTask.title = newTitle;

        // Replace the task in the array with the updated copy
        this.tasks[index] = updatedTask;

        console.log('Task edited:', updatedTask);
      }
    }
  }

  deleteTask() {
    if (this.taskToDelete) {
      const index = this.tasks.indexOf(this.taskToDelete);
      if (index !== -1) {
        this.tasks.splice(index, 1);
        console.log('Task Deleted...')
      }
      this.cancelDeleteTask(); // Reset the modal and taskToDelete
    }
  }

  addNewTask() {
    // Prompt the user for a new task name
    const newTitle = prompt('Add New Task:');

    if (newTitle !== null) {
      // Create a new task with the user's input
      const newTask: Task = { title: newTitle, isComplete: false };

      // Add the new task to the tasks array
      this.tasks.push(newTask);

      console.log('New Task Added:', newTask);
    }
  }

  IsCompleted(task: Task) {
    task.isComplete = !task.isComplete;
  }
  toggleCompletion(task: Task) {
    task.isComplete = !task.isComplete;
  }

  confirmDeleteTask(task: Task) {
    this.taskToDelete = task;
    this.showConfirmationModal = true;
  }

  cancelDeleteTask() {
    this.taskToDelete = null;
    this.showConfirmationModal = false;
  }

  // Function to add page refresh confirmation
  addPageRefreshConfirmation() {
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    });
  }

  // HostListener for beforeunload event (when browser refresh button is clicked)
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event): void {
    event.preventDefault();
  }

}
