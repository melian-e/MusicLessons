import { prisma } from "../../common/prisma/prismaClient";

module addRequests {
    export async function addSchool(name: string, address: string) {
        await prisma.school.create({
            data: {
                name: name,
                address: address
            }
        })
    }

    export async function addInstrument(name: string) {
        await prisma.instrument.create({
            data: {
                name: name
            }
        })
    }
    export async function getInstrusments() {
        return await prisma.instrument.findMany({
            select: {
                id: true,
                name: true,
            }
        })
    }

    export async function getSchools() {
        return await prisma.school.findMany({
            select: {
                id: true,
                name: true,
            }
        })
    }

    export async function addStudent(data : { studentSemester: { schoolYear1: number; schoolYear2: number; semester: "spring" | "autumn"; grade: number; schoolId: number; }; firstName: string; lastName: string; dateBirth: Date; email: string; phone: string; allowPhoto: boolean; parent1: { parentPhone: string; parentEmail: string; }; parent2: { parentPhone: string; parentEmail: string; }; queue: { createdAt: Date; accepted: boolean; acceptedAt: Date | null; appliedInstrumentId: number; }; }) {
        return await prisma.student.create({
            data: {
                dateBirth: data.dateBirth,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                parent1Email: data.parent1.parentEmail,
                parent1Phone: data.parent1.parentPhone,
                parent2Email: data.parent2.parentEmail,
                parent2Phone: data.parent2.parentPhone,
                allowPhoto: data.allowPhoto,
                studentSemester: {
                    create: {
                        grade: data.studentSemester.grade,
                        semester: data.studentSemester.semester,
                        schoolYear1: data.studentSemester.schoolYear1,
                        schoolYear2: data.studentSemester.schoolYear2,
                        school: {
                            connect: {
                                id: data.studentSemester.schoolId
                            }
                        },

                    }
                },
                Queue: {
                    create: {
                        appliedInstrument: {
                            connect: {
                                id: data.queue.appliedInstrumentId
                            }
                        },
                        createdAt: data.queue.createdAt,
                    }
                },
                studentInstruments: {
                    create: {
                        instrument: {
                            connect: {
                                id: data.queue.appliedInstrumentId
                            }
                        }
                    }
                },
                updatedAt: new Date(),
            },
            select: {
                id: true,
                Queue: {
                    select: {
                        id: true,
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                }
            }
        })
    }

    export async function modifyQueueForApplied(acceptedAt: Date, id: number) {
        await prisma.queue.update({
            where: {
                id: id
            },
            data: {
                accepted: true,
                acceptedAt: acceptedAt
            }
        })
    }

}
export default addRequests;