import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ChatComponent } from './components/chat/chat.component';
import { TodoComponent } from './components/todo/todo.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { FlashcardComponent } from './components/flashcard/flashcard.component';
import { ExamPrepComponent } from './components/exam-prep/exam-prep.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: 'todo', component: TodoComponent, canActivate: [authGuard] },
  { path: 'timetable', component: TimetableComponent, canActivate: [authGuard] },
  { path: 'flashcards', component: FlashcardComponent, canActivate: [authGuard] },
  { path: 'exam-prep', component: ExamPrepComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
