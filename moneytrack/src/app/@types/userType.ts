
export type UserType = {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
};

export type ResponseUserType = {
    id: number;
    name: string;
    username: string;
    email: string;
    valorGasto: number;
}

export type PasswordType = {
    password: string
}

export type LoginType = {
    username: string;
    password: string;
}

