import { User } from '../models/user.model';

class AuthService {
    private users: User[] = [];
    private currentUser: User | null = null;

    register(user: User): boolean {
        if (this.users.some(u => u.username === user.username)) {
            return false;
        }
        this.users.push(user);
        return true;
    }

    login(username: string, password: string): boolean {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            return true;
        }
        return false;
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
    }
}

export const authService = new AuthService();