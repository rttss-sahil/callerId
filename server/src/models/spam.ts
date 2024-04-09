export interface ISpam {
    id?: string;
    phone_number: string;
    marked_by_user_id: string;
}

export default class Spam implements ISpam {
    id?: string;
    phone_number: string;
    marked_by_user_id: string;

    constructor(spamData? :ISpam) {
        if (spamData && spamData.phone_number) {
            this.id = spamData.id;
            this.phone_number = spamData.phone_number;
            this.marked_by_user_id = spamData.marked_by_user_id;
        }
    }

    fromJson(json: any) {
        this.id = json['id'];
        this.phone_number = json['phone_number'];
        this.marked_by_user_id = json['marked_by_user_id'];
        return this;
    }
}