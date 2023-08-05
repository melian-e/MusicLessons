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
    Toolbar,
    ToolbarButton,
    ToolbarGroup,
    ButtonGroup,
} from "flowbite-svelte";
import { getTRPCClient } from "$lib/clientTRPC";
import { writable, type Writable } from "svelte/store";
import Time from "svelte-time";
import StudentSemester from "./StudentSemester.svelte";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { onMount } from "svelte";
import ActiveStudents from "./ActiveStudents.svelte";
import QueueStudents from "./QueueStudents.svelte";
import StoppedStudents from "./StoppedStudents.svelte";

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

const sortKey = writable("firstName"); // default sort key
const sortDirection = writable(1); // default sort direction (ascending)
let sortItems : Writable<any[]>; // make a copy of the items array

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

function nextLesson(student: (typeof students)[0]): string | Date {
    let data = "No lesson";
    let firstDate = new Date();

    let Queue = student.Queue.slice(-1)[0];

    if (Queue !== null) {
        firstDate = Queue.createdAt;
    }

    let date = new Date();

    if (student.lessons || student.lessons.length == 0) {
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

let urlParams = $page.url.searchParams.get("thumbnail");

$: {
    urlParams = $page.url.searchParams.get("thumbnail");
    console.log(urlParams);
    if (urlParams == null) {
        goto($page.url.pathname + "?thumbnail=active");
    }

    showedStudents = [];

    students.forEach((student: any, i) => {
        console.log(student);

        let lastQueue = student.Queue.slice(-1)[0];
        
        if (
            (urlParams ==
                "active" && lastQueue.accepted && !lastQueue.stopped) ||
            (urlParams == "queue" &&
                !lastQueue.accepted &&
                !lastQueue.stopped) ||
            (urlParams == "stopped" && lastQueue.stopped)
        ) {
            let tmp: any = {};
            tmp.id = student.id;
            tmp.firstName = student.firstName;
            tmp.lastName = student.lastName;
            tmp.dateBirth = student.dateBirth;
            tmp.lastInstrument = student.studentInstruments.slice(-1)[0]
                ? student.studentInstruments.slice(-1)[0].instrument.name
                : lastQueue.appliedInstrument.name;
            tmp.nextLesson = nextLesson(student);
            tmp.email = student.email;
            tmp.phone = student.phone;
            tmp.school = student.studentSemester.slice(-1)[0].school.name;
            tmp.grade = student.studentSemester.slice(-1)[0].grade;
            tmp.parent1 = student.parent1;
            tmp.parent2 = student.parent2;
            tmp.allowPhoto = student.allowPhoto;
            tmp.createdAt = student.createdAt;
            tmp.updatedAt = student.updatedAt;

            showedStudents.push(tmp);
        }

        sortItems = writable(showedStudents.slice())
    });
}

onMount(() => {
    if (urlParams == null) {
        goto($page.url.pathname + "?thumbnail=active");
    }
});
</script>

<div class="h-full w-full overflow-auto m-4">
    <div class="h-full grid grid-cols-3 divide-x pt-2 mr-2">
        <div class={gridWidth}>
            <Toolbar color="purple" rounded embedded={false}>
                <ButtonGroup class="space-x-px">
                    <Button
                        pill
                        color={urlParams == "active" ? "purple" : "green"}
                        href={$page.url.pathname + "?thumbnail=active"}
                        >Accepted student</Button
                    >
                    <Button
                        pill
                        color={urlParams == "queue" ? "purple" : "green"}
                        href={$page.url.pathname + "?thumbnail=queue"}
                        >Students in queue</Button
                    >
                    <Button
                        pill
                        color={urlParams == "stopped" ? "purple" : "green"}
                        href={$page.url.pathname + "?thumbnail=stopped"}
                        >Students that stopped</Button
                    >
                </ButtonGroup>
                <ToolbarGroup slot="end">
                    <ToolbarButton href="/pages/students/add"
                        >Add Student</ToolbarButton
                    >
                    <ToolbarButton href="./">Import Students</ToolbarButton>
                </ToolbarGroup>
            </Toolbar>

            <form class="flex gap-2 mt-2 mb-4">
                <Search
                    class="w-full"
                    size="md"
                    bind:value={search}
                    on:input={getNewStudents}
                />
            </form>

            {#if urlParams == "active"}
                <ActiveStudents {sortTable} bind:sortItems bind:currentStudentId />
            {:else if urlParams == "queue"}
                <QueueStudents {sortTable} bind:sortItems bind:currentStudentId />
            {:else if urlParams == "stopped"}
                <StoppedStudents {sortTable} bind:sortItems bind:currentStudentId />
            {/if}
        </div>
        <div class="ml-2">
            {#if currentStudentId}
                <div class="h-full w-full pl-2">
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
