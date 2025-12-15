export interface IResponse<T> {
  currentPage: number;
  pageSize: number;
  statusCode: number;
  to: number;
  totalElements: number;
  totalPages: number;
  message: {
    uz: string;
    en: string;
    ru: string;
  };
  data: T[];
}

export interface TeacherList {
  createdAt: string;
  avatarUrl: string;
  groups: {
    createdAt: string;
    id: string;
    isActive: boolean;
    isDeleted: boolean;
    lessonTime: string;
    name: string;
    teacherId: string;
    updatedAt: string;
  }[];
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  name: string;
  password: string;
  role: string;
  specifications: {
    category: string;
    id: string;
    name: string;
  }[];
  updatedAt: string;
  username: string;
}

export interface TeacherField {
  username: string;
  password?: string;
  specification:string[];
  name: string;
}

export interface TeacherDetailT {
  statusCode: number;
  message: {
    uz: string;
    en: string;
    ru: string;
  };
  data: {
    createdAt: string;
    avatarUrl: string;
    groups: {
      createdAt: string;
      id: string;
      isActive: boolean;
      isDeleted: boolean;
      lessonTime: string;
      name: string;
      teacherId: string;
      updatedAt: string;
    }[];
    id: string;
    isActive: boolean;
    isDeleted: boolean;
    name: string;
    password: string;
    role: string;
    specifications: {
      category: string;
      id: string;
      name: string;
    }[];
    updatedAt: string;
    username: string;
  };
}

export interface Specifications {
  data: {
    category: string;
    id: string;
    name: string;
  }[];
}
