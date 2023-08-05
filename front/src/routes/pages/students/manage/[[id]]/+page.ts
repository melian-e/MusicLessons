import { getTRPCClient } from '$lib/clientTRPC';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    const initRes = await getTRPCClient().students.initializationManage.query();

    if (!initRes) {
        throw redirect(302, '/')
    }

    return {
        students: initRes.students,
        instruments: initRes.instruments,
        schools: initRes.schools,
        id: params.id,
    }
}) satisfies PageLoad;