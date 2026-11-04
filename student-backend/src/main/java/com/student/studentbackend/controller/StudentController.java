package com.student.studentbackend.controller;

import com.student.studentbackend.model.Student;
import com.student.studentbackend.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentRepository students;

    public StudentController(StudentRepository students) {
        this.students = students;
    }

    @GetMapping
    public List<Student> getStudents() {
        return students.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Student addStudent(@Valid @RequestBody Student student) {
        return students.save(new Student(student.getName().trim(), student.getAge(), student.getCourse().trim()));
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @Valid @RequestBody Student changes) {
        Student student = findStudent(id);
        student.setName(changes.getName().trim());
        student.setAge(changes.getAge());
        student.setCourse(changes.getCourse().trim());
        return students.save(student);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudent(@PathVariable Long id) {
        students.delete(findStudent(id));
    }

    private Student findStudent(Long id) {
        return students.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
    }
}
