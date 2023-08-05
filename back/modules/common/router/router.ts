import { initExampleRouter } from '../../example/exampleRouting';
import { router } from './trpc';
import { initStudentsRouter } from '../../students/studentsRouting';


export function initRouter() {
	return router({
		example: initExampleRouter(),
        students: initStudentsRouter(),
	});
}
