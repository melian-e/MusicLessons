import { getTRPCClient } from '$lib/clientTRPC';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
    const initRes: {
        instruments: {
            id: number;
            name: string;
        }[], 
        schools: {
            id: number;
            name: string;
        }[]
    } = await getTRPCClient().students.initializationAdd.query();

    if (!initRes) {
        throw redirect(302, '/')
    }

    return {
        instruments: initRes.instruments,
        schools: initRes.schools,
    }
}) satisfies PageLoad;