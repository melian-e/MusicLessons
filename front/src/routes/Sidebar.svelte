<script lang="ts">
import Menu from "./Menu.svelte";
export let open = false;

function close(event: MouseEvent | KeyboardEvent) {
    if(event instanceof MouseEvent && event.target !== event.currentTarget )
    open = false;

    if(event instanceof KeyboardEvent && event.key === "Escape")
    open = false;
}
</script>

<aside
    class="absolute w-fit h-full bg-gray-200 border-r-2 shadow-lg z-50"
    class:open
>
    <Menu />
</aside>

<style>
aside {
    left: -100%;
    transition: left 0.3s ease-in-out;
}

.open {
    left: 0;
}
</style>
