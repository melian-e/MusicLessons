import { z } from 'zod';
import { publicProcedure, router } from '../common/router/trpc';
import add from './add/add';
import manage from './manage/manage';


export function initStudentsRouter() {
    return router({
        add: publicProcedure
            .input(z.object({
                token: z.string(),
                date: z.date(),
            }))
            .query(async ({ input }) => {
                console.log("example");

                return await add.example(input.token, input.date);
            }),
        initializationAdd: publicProcedure
            .query(async () => {
                return await add.initialization();
            }),
        addStudent: publicProcedure
            .input(z.object({
                firstName: z.string().min(1),
                lastName: z.string().min(1),
                dateBirth: z.date(),
                email: z.string(),
                phone: z.string(),
                allowPhoto: z.boolean(),
                parent1: z.object({
                    parentPhone: z.string(),
                    parentEmail: z.string(),
                }),
                parent2: z.object({
                    parentPhone: z.string(),
                    parentEmail: z.string(),
                }),
                studentSemester: z.object({
                    schoolYear1: z.number(),
                    schoolYear2: z.number(),
                    semester: z.union([z.literal("spring"), z.literal("autumn")]),
                    grade: z.number(),
                    schoolId: z.number()
                }),
                queue: z.object({
                    createdAt: z.date(),
                    accepted: z.boolean(),
                    acceptedAt: z.date().nullable(),
                    appliedInstrumentId: z.number()
                }),
            }))
            .mutation(async ({ input }) => {
                return await add.addStudent(input);
            }),
        initializationManage: publicProcedure
            .query(async () => {
                return await manage.initialization();
            }),
        filterStudents: publicProcedure
            .input(z.object({
                filter: z.string()
            }))
            .query(async ({ input }) => {
                return await manage.filterStudents(input.filter);
            }),
        addInstrument: publicProcedure
            .input(z.object({
                name: z.string()
            }))
            .mutation(async ({ input }) => {
                return await add.addInstrument(input.name);
            }),
        addSchool: publicProcedure
            .input(z.object({
                name: z.string(),
                address: z.string()
            }))
            .mutation(async ({ input }) => {
                return await add.addSchool(input.name, input.address);
            }),
        getInstruments: publicProcedure
            .query(async () => {
                return await add.getInstruments();
            }),
        getSchools: publicProcedure
            .query(async () => {
                return await add.getSchools();
            }),
            addStudentSemester: publicProcedure
            .input(z.object({
                studentId: z.number(),
                schoolYear1: z.number(),
                schoolYear2: z.number(),
                semester: z.union([z.literal("spring"), z.literal("autumn")]),
                grade: z.number(),
                schoolId: z.number()
            }))
            .mutation(async ({ input }) => {
                return await manage.addStudentSemester(input.studentId, input.schoolYear1, input.schoolYear2, input.semester, input.grade, input.schoolId);
            }),
        editSemester: publicProcedure
            .input(z.object({
                id: z.number(),
                schoolYear1: z.number(),
                schoolYear2: z.number(),
                semester: z.union([z.literal("spring"), z.literal("autumn")]),
                grade: z.number(),
                schoolId: z.number()
            }))
            .mutation(async ({ input }) => {
                return await manage.editSemester(input.id, input.schoolYear1, input.schoolYear2, input.semester, input.grade, input.schoolId);
            }),
        deleteSemester: publicProcedure
            .input(z.object({
                id: z.number()
            }))
            .mutation(async ({ input }) => {
                return await manage.deleteSemester(input.id);
            }),
    });
}