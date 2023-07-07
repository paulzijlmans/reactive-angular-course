import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, combineLatest } from "rxjs";
import { map, startWith, tap } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit {
  data$: Observable<CourseData>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));

    this.data$ = combineLatest([
      this.coursesService.loadById(courseId).pipe(startWith(null)),
      this.coursesService.loadAllCourseLessons(courseId).pipe(startWith([])),
    ]).pipe(
      map(([course, lessons]) => {
        return { course, lessons };
      }),
      tap(console.log)
    );
  }
}
