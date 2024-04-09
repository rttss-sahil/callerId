export interface IUser {
    id?: string;
    name: string;
    email?: string;
    phone_number: string;
    password_hash: string;
}

export default class User implements IUser {
    id?: string;
    name: string;
    email?: string;
    phone_number: string;
    password_hash: string;

    constructor(userData?: IUser) {
        if (userData) {
            this.id = userData.id;
            this.name = userData.name;
            this.email = userData.email;
            this.phone_number = userData.phone_number;
            this.password_hash = userData.password_hash;
        }
    }

    fromJson(json: any) {
        this.id = json['id'];
        this.name = json['name'];
        this.email = json['email'];
        this.phone_number = json['phone_number'];
        this.password_hash = json['password_hash'];
        return this;
    }
}