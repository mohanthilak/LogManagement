# High Level Requirements
- [x] Students must be able to create a account
- [] Student's roll number must be unique for the college he's in
- [] Student must add a teacher (if teacher does not exist) with a review
- [] Students can then add reviews about their professor.
- [] Students can also add rating


### Schema for Student Model
> - Name string
> - RollNumber string
> - College string
> - Semester int 
> - Passowrd string

### Schema for Teacher Model
> - Name string
> - PresentCollege string
> - PreviouslyTaught []string
> - CreatedBy string
> - Reviews []string
> - Rating int

### Schema for Review Model
> - Author stirng
> - TeacherID string
> - Content string

