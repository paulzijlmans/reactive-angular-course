import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({ providedIn: "root" })
export class CoursesStore {
  courses$: Observable<Course[]>;

  private subject = new BehaviorSubject<Course[]>([]);

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messages: MessagesService
  ) {
    this.courses$ = this.subject.asObservable();
    this.loadAllCourses();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();
    const index = courses.findIndex((course) => course.id === courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };
    const newCourses: Course[] = courses.slice();
    newCourses[index] = newCourse;

    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((error) => {
        const message = "Could not save course";
        console.log(message, error);
        this.messages.showErrors(message);
        return throwError(error);
      }),
      shareReplay()
    );
  }

  private loadAllCourses() {
    const loadCourses$ = this.http
      .get<{ payload: Course[] }>("/api/courses")
      .pipe(
        map((response) => response.payload),
        catchError((error) => {
          const message = "Could not load courses";
          this.messages.showErrors(message);
          console.log(message, error);
          return throwError(error);
        }),
        tap((courses) => this.subject.next(courses))
      );
    this.loading.showLoaderUntilCompleted(loadCourses$).subscribe();
  }
}
