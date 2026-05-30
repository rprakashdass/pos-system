export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
}
