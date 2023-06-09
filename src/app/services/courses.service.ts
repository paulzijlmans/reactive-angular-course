import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Course } from "../model/course";

type CoursesResponse = {
  payload: Course[];
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
}
