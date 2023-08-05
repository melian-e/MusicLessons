<script lang="ts">
import { fade } from "svelte/transition";
import "../app.css";
import Navbar from "./Navbar.svelte";
import Sidebar from "./Sidebar.svelte";

let open = false;
</script>

<div />
<Navbar bind:sidebar={open} />
<Sidebar bind:open />
{#if open}
    <div
        aria-hidden
        class="backdrop w-full h-full z-40"
        transition:fade
        on:click={() => (open = false)}
    />
{/if}
<div class="flex flex-col h-[calc(100%-42px-56px)]">
    <div class="flex justify-center items-center h-full w-full pb-5 pt-5">
        <slot />
    </div>
</div>

<footer class="bg-gray-800 text-white text-center py-4">
    <p>Footer</p>
</footer>

<svelte:head>
    <link
        href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
        rel="stylesheet"
    />
</svelte:head>

<style>
:global(body) {
    padding: 0;
}

.backdrop {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
}
</style>
