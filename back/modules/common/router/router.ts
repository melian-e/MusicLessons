import { router } from './trpc';


export function initRouter() {
	return router({
		example: initExampleRouter(),
	});
}
