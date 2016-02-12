export class User {
	token: string;
	constructor(token?: string) {
		this.token = token;
	}
	isAuthenticated() {
		return !!this.token;
	}
} 