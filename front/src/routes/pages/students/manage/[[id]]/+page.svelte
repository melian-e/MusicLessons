<script lang="ts">
import {
    Button,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Search,
    Chevron,
    Dropdown,
    DropdownItem,
} from "flowbite-svelte";
import { getTRPCClient } from "$lib/clientTRPC";
import { writable } from "svelte/store";
import Time from "svelte-time";
import StudentSemester from "./StudentSemester.svelte";
import { goto } from "$app/navigation";

export let data: import("./$types").PageData;

let students = data.students;

let currentStudentId = data.id;
let currentStudent = students.find(
    (element: any) => element.id == currentStudentId
);
let gridWidth = "col-span-full";

$: {
    currentStudent = students.find(
        (element: any) => element.id == currentStudentId
    );
    if (currentStudentId) {
        gridWidth = "col-span-2";
    } else {
        gridWidth = "col-span-full";
    }
}

let currentTab = StudentSemester;

let search = "";

let showedStudents: any[] = [];

students.forEach((student: any) => {
    let tmp: any = {};
    tmp.id = student.id;
    tmp.firstName = student.firstName;
    tmp.lastName = student.lastName;
    tmp.dateBirth = student.dateBirth;
    tmp.lastInstrument = lastInstrument(student);
    tmp.nextLesson = nextLesson(student);
    tmp.email = student.email;
    tmp.phone = student.phone;
    tmp.school = student.studentSemester[0].school.name;
    tmp.grade = student.studentSemester.find((semester: any) => {
        return (
            semester.schoolYear1 == new Date().getFullYear() &&
            ((semester.semester == "autumn" && new Date().getMonth() >= 6) ||
                (semester.semester == "spring" && new Date().getMonth() < 6))
        );
    }).grade;
    tmp.parent1 = student.parent1;
    tmp.parent2 = student.parent2;
    tmp.allowPhoto = student.allowPhoto;
    tmp.createdAt = student.createdAt;
    tmp.updatedAt = student.updatedAt;
    showedStudents.push(tmp);
});

const sortKey = writable("firstName"); // default sort key
const sortDirection = writable(1); // default sort direction (ascending)
const sortItems = writable(showedStudents.slice()); // make a copy of the items array

// Define a function to sort the items
const sortTable = (key: string) => {
    // If the same key is clicked, reverse the sort direction
    if ($sortKey === key) {
        sortDirection.update((val) => -val);
    } else {
        sortKey.set(key);
        sortDirection.set(1);
    }
};

$: {
    const key = $sortKey;
    const direction = $sortDirection;
    const sorted = [...$sortItems].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) {
            return -direction;
        } else if (aVal > bVal) {
            return direction;
        }
        return 0;
    });
    sortItems.set(sorted);
}

async function getNewStudents() {
    students = await getTRPCClient().students.filterStudents.query({
        filter: search,
    });
    sortItems.set(students);
}

function lastInstrument(student: (typeof students)[0]) {
    let data = student.Queue[0].appliedInstrument.name;
    let lastDate = student.Queue[0].createdAt;
    let date = new Date();

    console.log(student.studentInstruments);

    if (!student.studentInstruments || student.studentInstruments.length == 0) {
        return data;
    }

    student.studentInstruments.foreach((studentInstrument: any) => {
        if (
            studentInstrument.date < date &&
            studentInstrument.date > lastDate
        ) {
            data = studentInstrument.instrument.name;
            lastDate = studentInstrument.date;
        }
    });

    console.log(student.studentInstruments);
    
    return data;
}

function nextLesson(student: (typeof students)[0]): string | Date {
    let data = "No lesson";
    let firstDate = student.Queue[0].createdAt;
    let date = new Date();

    if (!student.lessons || student.lessons.length == 0) {
        return data;
    }

    student.lessons.foreach((lesson: any) => {
        if (lesson.date > date && lesson.date < firstDate) {
            data = lesson.date;
            firstDate = lesson.date;
        }
    });
    return data;
}
</script>

<div class="h-full w-full overflow-auto m-4">
    <div class="h-full grid grid-cols-3">
        <div class={gridWidth}>
            <form class="flex gap-2 mb-4">
                <Search
                    class="w-full"
                    size="md"
                    bind:value={search}
                    on:input={getNewStudents}
                />
            </form>

            <Table striped={true} hoverable={true} class="overflow-auto">
                <TableHead defaultRow={false}>
                    <tr>
                        <TableHeadCell colspan="9" />
                        <TableHeadCell colspan="2" class="bg-gray-200"
                            >Parent1</TableHeadCell
                        >
                        <TableHeadCell colspan="2" class="bg-gray-200"
                            >Parent2</TableHeadCell
                        >
                        <TableHeadCell colspan="3" />
                    </tr>
                    <tr>
                        <TableHeadCell on:click={() => sortTable("firstName")}
                            >FirstName</TableHeadCell
                        >
                        <TableHeadCell on:click={() => sortTable("lastName")}
                            >LastName</TableHeadCell
                        >
                        <TableHeadCell on:click={() => sortTable("email")}
                            >Email</TableHeadCell
                        >
                        <TableHeadCell on:click={() => sortTable("phone")}
                            >Phone</TableHeadCell
                        >
                        <TableHeadCell on:click={() => sortTable("dateBirth")}
                            >Birthdate</TableHeadCell
                        >
                        <TableHeadCell on:click={() => sortTable("grade")}
                            >Grade</TableHeadCell
                        >
                        <TableHeadCell on:click={() => sortTable("school")}
                            >School</TableHeadCell
                        >
                        <TableHeadCell
                            on:click={() => sortTable("lastInstrument")}
                            >Last instrument</TableHeadCell
                        >
                        <TableHeadCell on:click={() => sortTable("nextLesson")}
                            >Next lesson</TableHeadCell
                        >
                        <TableHeadCell>Phone</TableHeadCell>
                        <TableHeadCell>Email</TableHeadCell>
                        <TableHeadCell>Phone</TableHeadCell>
                        <TableHeadCell>Email</TableHeadCell>
                        <TableHeadCell on:click={() => sortTable("allowPhoto")}
                            >Photo allowed</TableHeadCell
                        >
                        <TableHeadCell on:click={() => sortTable("createdAt")}
                            >Created at</TableHeadCell
                        >
                        <TableHeadCell on:click={() => sortTable("upgradedAt")}
                            >Updated at</TableHeadCell
                        >
                    </tr>
                </TableHead>
                <TableBody>
                    {#each $sortItems as student}
                        <TableBodyRow
                            class="divide-y"
                            on:click={() => {
                                goto("/pages/students/manage/" + student.id);
                                currentStudentId = student.id;
                            }}
                        >
                            <TableBodyCell>{student.firstName}</TableBodyCell>
                            <TableBodyCell>{student.lastName}</TableBodyCell>
                            <TableBodyCell>{student.email}</TableBodyCell>
                            <TableBodyCell>{student.phone}</TableBodyCell>
                            <TableBodyCell
                                ><Time
                                    timestamp={student.dateBirth}
                                    format="YYYY/MM/DD"
                                /></TableBodyCell
                            >
                            <TableBodyCell>{student.grade}</TableBodyCell>
                            <TableBodyCell>{student.school}</TableBodyCell>
                            <TableBodyCell
                                >{student.lastInstrument}</TableBodyCell
                            >
                            <TableBodyCell>
                                {#if student.nextLesson instanceof Date}
                                    <Time
                                        timestamp={student.nextLesson}
                                        format="YYYY/MM/DD"
                                    />
                                {:else}
                                    {student.nextLesson}
                                {/if}</TableBodyCell
                            >
                            <TableBodyCell
                                >{student.parent1.phone}</TableBodyCell
                            >
                            <TableBodyCell
                                >{student.parent1.email}</TableBodyCell
                            >
                            <TableBodyCell
                                >{student.parent2.phone}</TableBodyCell
                            >
                            <TableBodyCell
                                >{student.parent2.email}</TableBodyCell
                            >
                            <TableBodyCell
                                >{student.photoAllowed
                                    ? "yes"
                                    : "no"}</TableBodyCell
                            >
                            <TableBodyCell>
                                <Time
                                    timestamp={student.createdAt}
                                    format="YYYY/MM/DD"
                                />
                            </TableBodyCell>
                            <TableBodyCell>
                                <Time
                                    timestamp={student.updatedAt}
                                    format="YYYY/MM/DD"
                                />
                            </TableBodyCell>
                        </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
        </div>
        <div class="ml-4">
            {#if currentStudentId}
                <div class="h-full w-full">
                    <div class="grid grid-cols-2">
                        <div>
                            <Button color="blue"><Chevron>Menu</Chevron></Button
                            >
                            <Dropdown>
                                <DropdownItem
                                    on:click={() =>
                                        (currentTab = StudentSemester)}
                                    >studentSemester</DropdownItem
                                >
                            </Dropdown>
                        </div>
                        <div>
                            <h1>{currentStudent.firstName}</h1>
                        </div>
                    </div>
                    <svelte:component
                        this={currentTab}
                        {data}
                        student={currentStudent}
                    />
                </div>
            {/if}
        </div>
    </div>
</div>
