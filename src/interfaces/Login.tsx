export interface AppUserLogin {
    email: string;
    password: string;
} 

export interface AppUserSignup {
    pseudo: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}