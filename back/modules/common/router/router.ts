import { initExampleRouter } from 'modules/example/exampleRouting';
import { router } from './trpc';
import { initStudentsRouter } from 'modules/students/studentsRouting';


export function initRouter() {
	return router({
		example: initExampleRouter(),
        students: initStudentsRouter(),
	});
}
