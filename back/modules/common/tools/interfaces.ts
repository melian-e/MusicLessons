export interface dataMap {
    [key: string]: string | number | boolean | Date | dataMap | null;
}

export interface dataAddStudent extends dataMap {
    firstName: string,
    lastName: string,
    dateBirth: Date,
    email: string,
    phone: string,
    allowPhoto: false,
    parent1: { parentPhone: string, parentEmail: string },
    parent2: { parentPhone: string, parentEmail: string },
    studentSemester: {
      schoolYear1: number,
      schoolYear2: number,
      semester: 'autumn',
      grade: number,
      schoolId: number
    },
    queue: {
      createdAt: Date,
      accepted: boolean,
      acceptedAt: Date | null,
      appliedInstrumentId: number
    }
  }
  