<script lang="ts">
import { Label, Input, Checkbox, Button, Modal, Select } from "flowbite-svelte";
import type { InputType } from "flowbite-svelte/dist/types";
import type { dataMap } from "$lib/interfaces";
import { createEventDispatcher } from "svelte";
import { getTRPCClient } from "./clientTRPC";

export let highestPoint = true;

export let key: string;
export let instruments: {
    id: number;
    name: string;
}[] = [];
export let schools: {
    id: number;
    name: string;
}[] = [];
export let data: dataMap;

let schoolName: string = "";
let schoolAddress: string = "";
let instrumentName: string = "";

let modalInstrument = false;
let modalSchool = false;

const dispatch1 = createEventDispatcher<{
    dataInside: {
        key: string;
        data: string | number | boolean | Date | dataMap | null;
    };
}>();

const dispatch2 = createEventDispatcher<{
    data: {
        key: string;
        data: dataMap;
    };
}>();

function giveData(
    key: string,
    data: dataMap
) {
    if (highestPoint) {
        dispatch2("data", {
            key: key,
            data: data,
        });
    } else {
        dispatch1("dataInside", {
            key: key,
            data: data,
        });
    }
}

function handleData(event: {
    detail: {
        key: string;
        data: string | number | boolean | Date | dataMap | null;
    };
}) {
    data[key] = event.detail.data;
    giveData(key, data);
}

function update() {
    console.log(value)
    data[key] = value;
    giveData(key, data);
}

function updateNumber() {
    value = Number(value);
    update();
}

function updateDate() {
    if (typeof value === "string") value = new Date(value);
    update();
}

let value: string | number | boolean | Date | dataMap | null = data[key];

function getType(
    value: string | number | boolean | Date | dataMap | null
): InputType {
    if (value instanceof Date) return "date";
    if (typeof value === "string") return "text";
    if (typeof value === "number") return "number";

    return "hidden";
}

async function submitInstrument() {
    try {
        const result = await getTRPCClient().students.addInstrument.mutate(
            {
                name: instrumentName,
            }
        );
        console.log(result);
        if (result == "SUCCESS") {
            modalInstrument = false;
            instruments = await getTRPCClient().students.getInstruments.query();
        }
    } catch (error: any) {
        console.log(error);
    }
}

async function submitSchool() {
    try {
        const result = await getTRPCClient().students.addSchool.mutate(
            {
                name: schoolName,
                address: schoolAddress,
            }
        );
        console.log(result);
        if (result == "SUCCESS") {
            modalSchool = false;
            schools = await getTRPCClient().students.getSchools.query();
        }
    } catch (error: any) {
        console.log(error);
    }
}
</script>

{#if value !== null && value !== undefined}
    {#if typeof value === "boolean"}
        <div class="mb-6">
            <Label for={key} class="block mb-2">{key}</Label>
            <Checkbox id={key} class="relative" bind:checked={value} on:change={update}/>
        </div>
    {:else if key === "semester"}
        <Label for="semester">Semester</Label>
        <Select
            id={key}
            bind:value={value}
            class="relative" 
            placeholder="Semester"
        >
            <option value="spring">Spring</option>
            <option value="autumn">Autumn</option>
        </Select>
    {:else if key === "appliedInstrumentId"}
        <div class="mb-6">
            <Label for={key} class="block mb-2">{key}</Label>
            <Select id={key} class="relative" bind:value on:change={update}>
                {#each instruments as instrument}
                    <option value={instrument.id}>{instrument.name}</option>
                {/each}
            </Select>
            <Button class="mt-2" color="dark" on:click={()=>modalInstrument=!modalInstrument}>Add new instrument</Button>
        </div>
    {:else if key === "schoolId"}
        <div class="mb-6">
            <Label for={key} class="block mb-2">{key}</Label>
            <Select id={key} class="relative" bind:value on:change={update}>
                {#each schools as school}
                    <option value={school.id}>{school.name}</option>
                {/each}
            </Select>
            <Button class="mt-2" color="dark" on:click={()=>modalSchool=!modalSchool}>Add new school</Button>
        </div>
    {:else if key === "createdAt" || key === "updatedAt" || key === "deletedAt" || key === "dateBirth"}
        <div class="mb-6">
            <Label for={key} class="block mb-2">{key}</Label>
            <input id={key} type="date" class="relative" bind:value on:input={()=> {if(typeof value == "string") value = new Date(value); update;}}/>
        </div>
    {:else if typeof value === "object"}
        <div class="mb-6 col-start-1 col-span-2 row-span-[{Object.keys(value).length}]">
            <Label for={key} class="block mb-2">{key}</Label>
            <div class="border-2 border-blue-500 rounded-md p-4">
                {#each Object.keys(value) as key2}
                    <svelte:self
                        data={value}
                        key={key2}
                        {instruments}
                        {schools}
                        highestPoint={false}
                        on:dataInside={handleData}
                    />
                {/each}
            </div>
        </div>
    {:else if typeof value === "number"}
        <div class="mb-6">
            <Label for={key} class="block mb-2">{key}</Label>
            <Input id={key} type="number" class="relative" bind:value on:input={updateNumber}/>
        </div>
    {:else}
        <div class="mb-6">
            <Label for={key} class="block mb-2">{key}</Label>
            <Input id={key} type={getType(value)} class="relative" bind:value on:input={update}/>
        </div>
    {/if}
{/if}

<Modal title="Add a new school" bind:open={modalSchool} autoclose>
    <Label for="schoolName" class="block mb-2">School name</Label>
    <Input id="schoolName" type="text" class="relative" bind:value={schoolName}/>
    <Label for="schoolAddress" class="block mb-2">School address</Label>
    <Input id="schoolAddress" type="text" class="relative" bind:value={schoolAddress}/>
    <svelte:fragment slot="footer">
        <Button color="blue" on:click={submitSchool}>Yes</Button>
        <Button color="dark">No</Button>
    </svelte:fragment>
</Modal>

<Modal title="Add a new instrument" bind:open={modalInstrument} autoclose>
    <Label for="instrumentName" class="block mb-2">Instrument name</Label>
    <Input id="instrumentName" type="text" class="relative" bind:value={instrumentName}/>
    <svelte:fragment slot="footer">
        <Button color="blue" on:click={submitInstrument}>Yes</Button>
        <Button color="dark">No</Button>
    </svelte:fragment>
</Modal>