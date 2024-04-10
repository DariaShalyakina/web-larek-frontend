import { IEvents } from './base/events';
import { Form } from './form';

interface IContactsForm {
	email: string;
	phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
	protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
       
		// Найти инпуты и сохранить их для дальнейшего использования
        this.emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
        this.phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
    }

    // Сеттер для установки значения телефона
    set phone(value: string) {
        this.phoneInput.value = value;
        this.onInputChange('phone', value);
    }

    // Сеттер для установки значения email
    set email(value: string) {
        this.emailInput.value = value;
        this.onInputChange('email', value);
    }
}
