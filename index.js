const GradePoints = {
    "A": 4.00,
    "A-": 3.67,
    "B+": 3.33,
    "B": 3.00,
    "B-": 2.67,
    "C+": 2.33,
    "C-": 1.67,
    "D+": 1.33
}
const Grades = ["A", "A-", "B+", "B", "B-", "C+", "C-", "D+", "P", "NC"];
const App = getById("app");
const CreateSemesterButton = getById("create-semester");
const CalculateGPA = getById("calculate");

let semester = 1; 

CalculateGPA.addEventListener("click", calculateGPA);

CreateSemesterButton.addEventListener("click", () => {
    App.append(createSemester());
})

function createSemester() {
    const semesterContainer = document.createElement("section");
    semesterContainer.classList.add("semester")
    semesterContainer.append(createSemesterName());
    semesterContainer.append(createSemesterGPA());
    semesterContainer.append(document.createElement("br"));
    semesterContainer.append(createAddClassButton(semesterContainer));
    return semesterContainer;
}

function createSemesterGPA() {
    const semesterGPA = document.createElement("output");
    semesterGPA.className = "gpa"
    semesterGPA.textContent = "Semester GPA: 0.0";
    return semesterGPA;
}

function createSemesterName() {
    const semesterName = document.createElement("h2");
    semesterName.textContent = `Semester ${semester++}`;
    return semesterName;
}

function createAddClassButton(semester) {
    const addClassButton = document.createElement("button");
    addClassButton.textContent = "Add Class";
    addClassButton.addEventListener("click", () => {
        semester.append(createClass())
    });
    return addClassButton;
}

function createClass() {
    const classRow = document.createElement("div");
    classRow.classList.add("class-row")
    classRow.append(createClassNameInput());
    classRow.append(createCreditInput());
    classRow.append(createGradeSelector());
    classRow.append(removeClass(classRow));
    return classRow;
}

function removeClass(classRow) {
    const removeClassButton = document.createElement("button");
    removeClassButton.textContent = "X";
    removeClassButton.addEventListener("click", () => {
        classRow.remove()
    });
    return removeClassButton;
}

function createClassNameInput() {
    const input = document.createElement("input");
    input.className = "name"
    input.placeholder = "Enter class name"
    return input;
}

function createCreditInput() {
    const input = document.createElement("input");
    input.className = "credits";
    input.placeholder = "Enter credit hours";
    return input;
}

function createGradeSelector() {
    const gradeDropdown = document.createElement("select");
    gradeDropdown.className = "grade"
    Grades.forEach((grade) => {
        const option = document.createElement("option");
        option.textContent = grade;
        option.value = grade;
        gradeDropdown.append(option)
    });
    return gradeDropdown;
}

function getById(id) {
    return document.getElementById(id);
}

function getElementsWithClass(className) {
    return document.getElementsByClassName(className);
}

function calculateGPA() {
    const semesters = getElementsWithClass("semester");
    const semesterGPAs = Array.from(semesters).map(calculateSemesterGPA);
    const gpa = semesterGPAs.reduce((state, semester) => {
        return {
            points: state.points + semester.points,
            credits: state.credits + semester.credits
        }
    }, {
        points: 0,
        credits: 0
    });
    displayCulmativeGPA(gpa);
}

function displayCulmativeGPA(gpa) {
    getById("GPA").textContent = `GPA: ${(gpa.points / gpa.credits).toFixed(3)}`
}

function calculateSemesterGPA(semester) {
    const classRows = semester.getElementsByClassName("class-row");
    const semesterGPA = Array.from(classRows).reduce((state, classRow) => {
        const creditInput = classRow.getElementsByClassName("credits")[0];
        const grade = classRow.getElementsByClassName("grade")[0];
        if (grade.value !== "P" && grade.value !== "NC") {
            return {
                credits: state.credits + parseFloat(creditInput.value),
                points: state.points + parseFloat(creditInput.value) * GradePoints[grade.value]
            }
        }
        return state;
    }, {
        credits: 0.0,
        points: 0.0
    });
    displaySemesterGPA(semester, semesterGPA);
    return semesterGPA;
}

function displaySemesterGPA(semester, gpa) {
    const gpaDisplay = semester.getElementsByClassName("gpa")[0];
    gpaDisplay.textContent = `Semester GPA: ${(gpa.points / gpa.credits).toFixed(3)}`;
}