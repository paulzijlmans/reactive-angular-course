import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";

type CoursesResponse = {
  payload: Course[];
};

type LessonsResponse = {
  payload: Lesson[];
};

@Injectable({ providedIn: "root" })
export class CoursesService {
  constructor(private http: HttpClient) {}

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<CoursesResponse>("/api/courses").pipe(
      map((res) => res.payload),
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }

  searchLessons(search: string): Observable<Lesson[]> {
    return this.http
      .get<LessonsResponse>("/api/lessons", {
        params: {
          filter: search,
          pageSize: "100",
        },
      })
      .pipe(
        map((res) => res.payload),
        shareReplay()
      );
  }
}
