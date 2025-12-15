// types/index.ts

export interface Student {
  id?: string;
  name: string;
  grade: string | null;
  behavior: string | null;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  durationInMonths: number;
  teacherId: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GroupDetails {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  durationInMonths: number;
  students: Student[];
  teacher: Teacher;
}

export interface IResponse<T> {
  statusCode: number;
  message: {
    uz: string;
    en: string;
    ru: string;
  };
  data: T[];
}

export interface GroupStudentsResponse {
  statusCode: number;
  message: {
    uz: string;
    en: string;
    ru: string;
  };
  data: GroupDetails;
}

export interface Teacher {
  id: string;
  name: string;
  username: string;
  role: "TEACHER" | "ADMIN";
  avatarUrl: string | null;
  url: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  groups: Group[];
  specifications: Specification[];
}

export interface Specification {
  id: string;
  category: string;
  name: string;
}


export interface TeacherDetails {
  id: string;
  name: string;
  username: string;
  role: string;
  avatarUrl: string | null;
  url: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  groups: Array<{
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    durationInMonths: number;
    teacherId: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }>;
  specifications: Array<{
    id: string;
    category: string;
    name: string;
  }>;
}

export interface TeacherDetailsResponse {
  statusCode: number;
  message: {
    uz: string;
    en: string;
    ru: string;
  };
  data: TeacherDetails;
}