import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { authService } from '../../shared/services/auth.service';

export class LoginViewModel extends Observable {
    private _username: string = '';
    private _password: string = '';
    private _isLoading: boolean = false;

    constructor() {
        super();
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

    onLogin() {
        if (!this.username || !this.password) {
            alert('Please enter both username and password');
            return;
        }

        this.isLoading = true;

        if (authService.login(this.username, this.password)) {
            Frame.topmost().navigate({
                moduleName: 'views/home/home-page',
                clearHistory: true
            });
        } else {
            alert('Invalid username or password');
        }

        this.isLoading = false;
    }

    onRegister() {
        Frame.topmost().navigate('views/register/register-page');
    }
}