<script lang="ts">
import Icon from "@iconify/svelte";
import { Button, Modal } from "flowbite-svelte";
import Input from "../../../../lib/Input.svelte";
import type { dataMap } from "$lib/interfaces";
import { getTRPCClient } from "$lib/clientTRPC";
import { goto } from "$app/navigation";
import Layout from "../../../+layout.svelte";
export let data: import("./$types").PageData;

let instruments = data.instruments;
let schools = data.schools;
let errorMessage: string | null = null;
let dataInputs: dataMap = {
    firstName: "",
    lastName: "",
    dateBirth: new Date(),

    email: "",
    phone: "",
    allowPhoto: false,

    parent1: {
        parentPhone: "",
        parentEmail: "",
    },
    parent2: {
        parentPhone: "",
        parentEmail: "",
    },

    studentSemester: {
        schoolYear1: new Date().getFullYear(),
        schoolYear2: new Date().getFullYear() + 1,
        semester: new Date().getMonth() < 6 ? "spring" : "autumn",
        grade: 0,
        schoolId: 0,
    },

    queue: {
        createdAt: new Date(),
        accepted: false,
        acceptedAt: null,
        appliedInstrumentId: 0,
    },
};

let defaultModal = false;

async function submit() {
    try {
        
        const result = await getTRPCClient().students.addStudent.mutate(
            // @ts-ignore
            dataInputs
        );
        console.log(result);
        if (result == "SUCCESS") {
            goto("/pages/students/manage");
        }
    } catch (error: any) {
        console.log("error", error.message);
        try {
            errorMessage = JSON.parse(error.message).error;
        } catch (error1: any) {
            errorMessage = "Server error";
        }

        if (error.name == "ZodError") {
            errorMessage = "";
            for (const sub of error.issues[0].path) {
                errorMessage += sub + " : ";
            }
            errorMessage += error.issues[0].message;
        }
    }
}

function handleData(event: { detail: { key: string; data: dataMap } }) {
    dataInputs = event.detail.data;
}
</script>

<div class="h-full w-full overflow-auto">
    <div class="grid grid-cols-4 gap-4 m-4">
        {#if errorMessage}
            <div
                class="p-3 m-3 col-span-2 text-center border-2 border-red-500 rounded-md"
            >
                <Icon icon="codicon:error" width="24" height="24" color="red" />
                <p>{errorMessage}</p>
            </div>
        {/if}
        {#each Object.keys(dataInputs) as key}
            <Input
                data={dataInputs}
                {key}
                {instruments}
                {schools}
                on:data={handleData}
            />
        {/each}
    </div>
    <Button
        color="purple"
        class="col-start-2"
        on:click={() => {
            defaultModal = true;
        }}
        pill>Add <Icon icon="ri:user-add-fill" width="24" /></Button
    >
</div>

<Modal title="Add the student ?" bind:open={defaultModal} autoclose>
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Are you sure you want to add the student ?
    </p>
    <svelte:fragment slot="footer">
        <Button color="blue" on:click={submit}>Yes</Button>
        <Button color="dark">No</Button>
    </svelte:fragment>
</Modal>