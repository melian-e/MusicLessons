import { prisma } from "../common/prisma/prismaClient";

module AdminRequests {
    export async function addHistory(accountId: number, date: Date) {
        await prisma.student.create({
            data: {
                dateBirth: date,
                email: "e.e@e.e",
                firstName: "e",
                lastName: "e",
                phone: "e",
                parent1Email: "e.e@e.e",
                parent1Phone: "e",
                parent2Email: "e.e@e.e",
                parent2Phone: "e",
                allowPhoto: true,
                studentSemester: {
                    create: {
                        grade: 1,
                        semester: "spring",
                        schoolYear1: 2021,
                        schoolYear2: 2022,
                        school: {
                            connect: {
                                name: "test"
                            }
                        },

                    }
                },
                Queue: {
                    create: {
                        appliedInstrument: {
                            connect: {
                                name: "test"
                            }
                        },
                        createdAt: new Date(),
                    }
                },
                updatedAt: new Date(),
            }
        })
    }
}
export default AdminRequests;