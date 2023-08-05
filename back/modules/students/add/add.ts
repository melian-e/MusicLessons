import addRequests from "./addRequests";

module add {
    export async function example(token: string, date: Date) {

    }

    export async function initialization() {
        const instruments = await addRequests.getInstrusments();
        const schools = await addRequests.getSchools();

        const data = {
            instruments: instruments,
            schools: schools,
        }

        return data;
    }

    export async function addStudent(data: { studentSemester: { schoolYear1: number; schoolYear2: number; semester: "spring" | "autumn"; grade: number; schoolId: number; }; firstName: string; lastName: string; dateBirth: Date; email: string; phone: string; allowPhoto: boolean; parent1: { parentPhone: string; parentEmail: string; }; parent2: { parentPhone: string; parentEmail: string; }; queue: { createdAt: Date; accepted: boolean; acceptedAt: Date | null; appliedInstrumentId: number; }; }) {
        console.log(data);

        const result = await addRequests.addStudent(data)

        if (data.queue.accepted && data.queue.acceptedAt) {
            addRequests.modifyQueueForApplied(data.queue.acceptedAt, result.Queue[0].id)
        }

        return "SUCCESS";
    }

    export async function addInstrument(name: string) {
        await addRequests.addInstrument(name)
        return "SUCCESS";
    }

    export async function addSchool(name: string, address: string) {
        await addRequests.addSchool(name, address)
        return "SUCCESS";
    }

    export async function getInstruments() {
        return await addRequests.getInstrusments();
    }

    export async function getSchools() {
        return await addRequests.getSchools();
    }
}

export default add;