<script lang="ts">
import Icon from "@iconify/svelte";
export let sidebar = false;
</script>

<header
    class="flex justify-between bg-gray-200 p-2 items-center text-gray-600 border-b-2"
>
    <button on:click={() => (sidebar = !sidebar)}
        ><Icon icon="typcn:th-menu-outline" width="24" /></button
    >
</header>
