import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { authService } from '../../shared/services/auth.service';

export class RegisterViewModel extends Observable {
    private _name: string = '';
    private _email: string = '';
    private _username: string = '';
    private _password: string = '';
    private _isLoading: boolean = false;

    constructor() {
        super();
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        if (this._name !== value) {
            this._name = value;
            this.notifyPropertyChange('name', value);
        }
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        if (this._username !== value) {
            this._username = value;
            this.notifyPropertyChange('username', value);
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    onRegister() {
        if (!this.validateInput()) {
            return;
        }

        this.isLoading = true;

        const success = authService.register({
            username: this.username,
            password: this.password,
            name: this.name,
            email: this.email
        });

        if (success) {
            alert('Registration successful! Please login.');
            Frame.topmost().goBack();
        } else {
            alert('Username already exists. Please choose a different username.');
        }

        this.isLoading = false;
    }

    onBackToLogin() {
        Frame.topmost().goBack();
    }

    private validateInput(): boolean {
        if (!this.username || !this.password || !this.name || !this.email) {
            alert('Please fill in all fields');
            return false;
        }

        if (this.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return false;
        }

        if (!this.validateEmail(this.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        return true;
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}