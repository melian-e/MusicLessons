<script lang="ts">
import { getTRPCClient } from "$lib/clientTRPC";
import {
    Accordion,
    AccordionItem,
    Button,
    Input,
    Label,
    Modal,
    Select,
} from "flowbite-svelte";

export let data: import("./$types").PageData;
export let student: (typeof data.students)[0];

let schools = data.schools;

let lastSemester = student.studentSemester.slice(-1)[0];

let schoolId: string = lastSemester.school.Id;
let schoolYear1: number = new Date().getFullYear();
let schoolYear2: number = new Date().getFullYear() + 1;
let semester: string = new Date().getMonth() < 6 ? "spring" : "autumn";
let grade: number =
    lastSemester.semester == "spring"
        ? lastSemester.grade + 1
        : lastSemester.grade;

let modalSemester = false;

let editMode = false;

async function addSemester() {
    try {
        let res = await getTRPCClient().students.addStudentSemester.mutate({
            studentId: Number(student.id),
            schoolId: Number(schoolId),
            schoolYear1: Number(schoolYear1),
            schoolYear2: Number(schoolYear2),
            semester: semester,
            grade: Number(grade),
        });
        if (res) {
            student.studentSemester = res.studentSemester;
        }
    } catch (e: any) {}
}
</script>

<div class="h-full w-full overflow-auto p-2">
    <h5 class="m-2">Semesters :</h5>
    <Accordion>
        {#each student.studentSemester as semester}
            <AccordionItem>
                <span slot="header"
                    >{semester.schoolYear1}-{semester.schoolYear2} : {semester.semester}</span
                >
                <div class="grid grid-cols-2">
                    <div>
                        <Label for="schoolName">School Name</Label>
                        <Input
                            id="schoolName"
                            bind:value={semester.school.name}
                            placeholder="School Name"
                            readonly={!editMode}
                        />
                        <Label for="schoolYear1">School Year 1</Label>
                        <Input
                            id="schoolYear1"
                            bind:value={semester.schoolYear1}
                            placeholder="School Year 1"
                            readonly={!editMode}
                        />
                        <Label for="schoolYear2">School Year 2</Label>
                        <Input
                            id="schoolYear2"
                            bind:value={semester.schoolYear2}
                            placeholder="School Year 2"
                            readonly={!editMode}
                        />
                        <Label for="semester">Semester</Label>
                        <Input
                            id="semester"
                            bind:value={semester.semester}
                            placeholder="Semester"
                            readonly={!editMode}
                        />
                        <Label for="grade">Grade</Label>
                        <Input
                            id="grade"
                            bind:value={semester.grade}
                            placeholder="Grade"
                            readonly={!editMode}
                        />
                    </div>
                    <Button
                        class="w-min h-min"
                        color="green"
                        on:click={() => (editMode = !editMode)}>edit</Button
                    >
                </div>
            </AccordionItem>
        {/each}
    </Accordion>

    <Button
        class="mt-5"
        color="blue"
        on:click={() => {
            modalSemester = true;
        }}
    >
        Add Semester
    </Button>
</div>

<Modal bind:open={modalSemester}>
    <div slot="header">Add Semester</div>
    <div>
        <Label for="schoolName">School Name</Label>
        <Select id="schoolName" bind:value={schoolId} placeholder="School Name">
            {#each schools as school}
                <option value={school.id}>{school.name}</option>
            {/each}
        </Select>
        <Label for="schoolYear1">School Year 1</Label>
        <Input
            type="number"
            id="schoolYear1"
            bind:value={schoolYear1}
            placeholder="School Year 1"
        />
        <Label for="schoolYear2">School Year 2</Label>
        <Input
            type="number"
            id="schoolYear2"
            bind:value={schoolYear2}
            placeholder="School Year 2"
        />
        <Label for="semester">Semester</Label>
        <Select id="semester" bind:value={semester} placeholder="Semester">
            <option value="spring">Spring</option>
            <option value="autumn">Autumn</option>
        </Select>
        <Label for="grade">Grade</Label>
        <Input
            id="grade"
            type="number"
            bind:value={grade}
            placeholder="Grade"
        />
    </div>
    <div slot="footer">
        <Button
            color="blue"
            on:click={() => {
                modalSemester = false;
            }}
        >
            Cancel
        </Button>
        <Button
            color="blue"
            on:click={() => {
                modalSemester = false;
                addSemester();
            }}
        >
            Add
        </Button>
    </div>
</Modal>
