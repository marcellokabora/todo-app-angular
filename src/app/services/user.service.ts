import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/task.model';

const MOCK_USERS: User[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'AJ' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', avatar: 'BS' },
    { id: '3', name: 'Charlie Davis', email: 'charlie@example.com', avatar: 'CD' },
    { id: '4', name: 'Diana Chen', email: 'diana@example.com', avatar: 'DC' },
    { id: '5', name: 'Eve Martinez', email: 'eve@example.com', avatar: 'EM' },
    { id: '6', name: 'Frank Wilson', email: 'frank@example.com', avatar: 'FW' },
    { id: '7', name: 'Grace Lee', email: 'grace@example.com', avatar: 'GL' },
    { id: '8', name: 'Henry Brown', email: 'henry@example.com', avatar: 'HB' },
    { id: '9', name: 'Ivy Taylor', email: 'ivy@example.com', avatar: 'IT' },
    { id: '10', name: 'Jack Anderson', email: 'jack@example.com', avatar: 'JA' },
    { id: '11', name: 'Karen Thomas', email: 'karen@example.com', avatar: 'KT' },
    { id: '12', name: 'Leo Garcia', email: 'leo@example.com', avatar: 'LG' },
    { id: '13', name: 'Mia Robinson', email: 'mia@example.com', avatar: 'MR' },
    { id: '14', name: 'Noah Clark', email: 'noah@example.com', avatar: 'NC' },
    { id: '15', name: 'Olivia Wright', email: 'olivia@example.com', avatar: 'OW' },
    { id: '16', name: 'Marcello Kabora', email: 'marcellokabora@gmail.com', avatar: 'MK' },
];

const MOCK_PASSWORD = '1234';
const STORAGE_KEY = 'currentUserId';

@Injectable({ providedIn: 'root' })
export class UserService {
    readonly users = signal<User[]>(MOCK_USERS);
    readonly currentUser = signal<User | null>(this.#loadFromStorage());
    readonly isAuthenticated = computed(() => this.currentUser() !== null);

    readonly userNames = computed(() => this.users().map((u) => u.name));

    getUserByName(name: string): User | undefined {
        return this.users().find((u) => u.name === name);
    }

    searchUsers(query: string): User[] {
        if (!query) return this.users();
        const lower = query.toLowerCase();
        return this.users().filter(
            (u) => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower),
        );
    }

    login(email: string, password: string): boolean {
        if (password !== MOCK_PASSWORD) return false;
        const user = this.users().find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return false;
        this.currentUser.set(user);
        localStorage.setItem(STORAGE_KEY, user.id);
        return true;
    }

    logout(): void {
        this.currentUser.set(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    #loadFromStorage(): User | null {
        const id = localStorage.getItem(STORAGE_KEY);
        if (!id) return null;
        return MOCK_USERS.find((u) => u.id === id) ?? null;
    }
}
