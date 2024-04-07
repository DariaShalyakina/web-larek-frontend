import { IEvents } from './base/events';
import { Form } from './form';

interface IContactsForm {
	email: string;
	phone: string;
}

export class Contacts extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	// Сеттер для установки значения телефона
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
		this.onInputChange('phone', value);
	}

	// Сеттер для установки значения email
	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
		this.onInputChange('email', value);
	}
}
