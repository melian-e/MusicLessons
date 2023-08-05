<script lang="ts">
import {
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
    SidebarDropdownItem,
    SidebarDropdownWrapper,
} from "flowbite-svelte";
import { page } from "$app/stores";
import Icon from "@iconify/svelte";
let spanClass = "flex-1 ml-3 whitespace-nowrap";
$: activeUrl = $page.url.pathname;
let studentsOpen = false;
$: {
    if (activeUrl === "/students/." || activeUrl === "/pages/students/manage" || activeUrl === "/pages/students/add") {
        studentsOpen = true;
    } else {
        studentsOpen = false;
    }
}
</script>

<Sidebar>
    <SidebarWrapper>
        <SidebarGroup>
            <SidebarItem label="Home" href="/" active={activeUrl === "/"} />
            <SidebarDropdownWrapper label="Students" active={activeUrl === "/pages/students/."} isOpen={studentsOpen}>
                <svelte:fragment slot="icon">
                    <Icon icon="raphael:people" width="24" />
                </svelte:fragment>
                <svelte:fragment slot="arrowup">
                    <Icon icon="line-md:arrow-right" width="24" rotate={3} />
                </svelte:fragment>
                <svelte:fragment slot="arrowdown">
                    <Icon icon="line-md:arrow-right" width="24" rotate={1} />
                </svelte:fragment>
                <SidebarDropdownItem label="Manage" href="/pages/students/manage" active={activeUrl === "/pages/students/manage"}  />
                <SidebarDropdownItem label="Add" href="/pages/students/add" active={activeUrl === "/pages/students/add"}  />
            </SidebarDropdownWrapper>
            <SidebarDropdownWrapper label="Lessons" active={activeUrl === "/pages/lessons/."} isOpen={studentsOpen}>
                <svelte:fragment slot="icon">
                    <Icon icon="raphael:people" width="24" />
                </svelte:fragment>
                <svelte:fragment slot="arrowup">
                    <Icon icon="line-md:arrow-right" width="24" rotate={3} />
                </svelte:fragment>
                <svelte:fragment slot="arrowdown">
                    <Icon icon="line-md:arrow-right" width="24" rotate={1} />
                </svelte:fragment>
                <SidebarDropdownItem label="Today" href="/pages/lessons/today" active={activeUrl === "/pages/lessons/today"}  />
                <SidebarDropdownItem label="Manage" href="/pages/lessons/manage" active={activeUrl === "/pages/students/add"}  />
            </SidebarDropdownWrapper>
            <SidebarItem label="To-Do" href="/" active={activeUrl === "/"} />
            <SidebarItem label="Home" href="/" active={activeUrl === "/"} />
        </SidebarGroup>
    </SidebarWrapper>
</Sidebar>
