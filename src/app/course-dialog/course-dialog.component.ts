import { AfterViewInit, Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as moment from "moment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService, MessagesService],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.value;
    const saveCourses$ = this.coursesService
      .saveCourse(this.course.id, changes)
      .pipe(
        catchError((err) => {
          const message = "Could not save course";
          console.log(message, err);
          this.messagesService.showErrors(message);
          return throwError(err);
        })
      );
    this.loadingService
      .showLoaderUntilCompleted(saveCourses$)
      .subscribe((val) => this.dialogRef.close(val));
  }

  close() {
    this.dialogRef.close();
  }
}
