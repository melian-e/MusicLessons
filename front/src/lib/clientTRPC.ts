import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../back/server';
import { PUBLIC_API_URL } from '$env/static/public'
import superjson from 'superjson';

export function getTRPCClient() {
    const client = createTRPCProxyClient<AppRouter>({
        transformer: superjson,
        links: [
            httpBatchLink({
                url: `${PUBLIC_API_URL}/trpc`,
                fetch(url, options) {
                    return fetch(url, {
                        ...options,
                    });
                }
            }),
        ],
    });
    
    return client;
}