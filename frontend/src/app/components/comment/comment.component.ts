import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-comment',
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('commentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class CommentComponent {
@Input() comment: any;
  @Output() deleted = new EventEmitter<number>(); 
  
  isDeleted = false;
  showDeleteButton = false;
  private currentUserId: number | null = null;

  constructor(private authService: AuthService) {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.currentUserId = user.data.id;
        this.checkDeletePermission();
      },
      error: () => {
        this.currentUserId = null;
        this.checkDeletePermission();
      }
    });
  }

  private checkDeletePermission() {
    this.showDeleteButton = this.currentUserId === this.comment.user?.id;
  }

  
deleteComment() {
  if (confirm('Are you sure you want to delete this comment?')) {
    this.isDeleted = true;

    setTimeout(() => {
      this.deleted.emit(this.comment.id);
    }, 300);
  }
}
}
