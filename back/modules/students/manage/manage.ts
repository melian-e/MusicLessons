import manageRequests from "./manageRequests";

module manage {
    export async function initialization() {
        const students = await manageRequests.getStudents();

        let newStudents = [];

        //copy all existing element into newStudent array
        for(let i = 0; i < students.length; i++) {
            //make a copy without parent1Email, parent2Email, parent1Phone, parent2Phone
            let newStudent = Object.assign(students[i]);
            newStudent.parent1 = {
                email : students[i].parent1Email,
                phone : students[i].parent1Phone
            }
            newStudent.parent2 = {
                email : students[i].parent2Email,
                phone : students[i].parent2Phone
            }
            delete newStudent.parent1Email;
            delete newStudent.parent2Email;
            delete newStudent.parent1Phone;
            delete newStudent.parent2Phone;
            newStudents.push(newStudent);
        }

        console.log(newStudents);

        const instruments = await manageRequests.getInstruments();
        const schools = await manageRequests.getSchools();
        return {students : newStudents, instruments : instruments, schools : schools};
    }

    export async function filterStudents(filter : string) {
        let students = await manageRequests.getStudents(filter);

        let newStudents = [];

        //copy all existing element into newStudent array
        for(let i = 0; i < students.length; i++) {
            //make a copy without parent1Email, parent2Email, parent1Phone, parent2Phone
            let newStudent = Object.assign(students[i]);
            newStudent.parent1 = {
                email : students[i].parent1Email,
                phone : students[i].parent1Phone
            }
            newStudent.parent2 = {
                email : students[i].parent2Email,
                phone : students[i].parent2Phone
            }
            delete newStudent.parent1Email;
            delete newStudent.parent2Email;
            delete newStudent.parent1Phone;
            delete newStudent.parent2Phone;
            newStudents.push(newStudent);
        }

        return newStudents;
    }

    export async function addStudentSemester(studentId: number, schoolYear1: number, schoolYear2: number, semester: "spring" | "autumn", grade: number, schoolId: number) {
        return await manageRequests.addStudentSemester(studentId, schoolYear1, schoolYear2, semester, grade, schoolId);
    }
}

export default manage;