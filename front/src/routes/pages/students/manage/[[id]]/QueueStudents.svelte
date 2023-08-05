<script lang="ts">
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";
    import Time from "svelte-time";
    import { goto } from "$app/navigation";
    
    export let sortTable : Function;
    export let sortItems : any;
    export let currentStudentId : any;
    
    </script>
    
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
                        goto("/pages/students/manage/" + student.id + "?thumbnail=queue");
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