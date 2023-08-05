import { prisma } from "../../common/prisma/prismaClient";

module manageRequests {
    export async function getStudents(filter = "") {
        return await prisma.student.findMany({
            where: {
                OR: [
                    {
                        firstName: {
                            contains: filter
                        }
                    },
                    {
                        lastName: {
                            contains: filter
                        }
                    },
                    {
                        email: {
                            contains: filter
                        }
                    }
                ]
            },
            include: {
                studentSemester: {
                    include: {
                        school: true,
                    },
                    orderBy: [{
                        schoolYear1: 'desc'
                    },
                    {
                        semester: 'asc'
                    }]
                },
                Queue: {
                    include: {
                        appliedInstrument: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                studentInstruments: {
                    include: {
                        instrument: true,
                    },
                    orderBy: {
                        startDate: 'desc'
                    }
                },
                ensembles: true,
                lessons: true,
            }
        })
    }
    export async function getInstruments() {
        return await prisma.instrument.findMany();
    }
    export async function getSchools() {
        return await prisma.school.findMany();
    }

    export async function addStudentSemester(studentId: number, schoolYear1: number, schoolYear2: number, semester: "spring" | "autumn", grade: number, schoolId: number) {
        return await prisma.student.update({
            where: {
                id: studentId
            },
            data: {
                studentSemester: {
                    create: {
                        schoolYear1: schoolYear1,
                        schoolYear2: schoolYear2,
                        semester: semester,
                        grade: grade,
                        schoolId: schoolId
                    }
                }
            },
            select: {
                studentSemester: {
                    include: {
                        school: true,
                    },
                    orderBy: [{
                        schoolYear1: 'desc'
                    },
                    {
                        semester: 'asc'
                    }]
                }
            }
        })
    }

    export async function editSemester(id: number, schoolYear1: number, schoolYear2: number, semester: "spring" | "autumn", grade: number, schoolId: number) {
        return await prisma.studentSemester.update({
            where: {
                id: id
            },
            data: {
                schoolYear1: schoolYear1,
                schoolYear2: schoolYear2,
                semester: semester,
                grade: grade,
                schoolId: schoolId
            },
            include: {
                school: true,
            },
        })
    }

    export async function deleteSemester(id: number) {
        return await prisma.studentSemester.delete({
            where: {
                id: id
            }
        })
    }
}
export default manageRequests;