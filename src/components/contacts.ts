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
        // Находим элемент с именем "phone" в контейнере и устанавливаем ему значение
 (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
 
    // Сеттер для установки значения email
    set email(value: string) {
        // Находим элемент с именем "email" в контейнере и устанавливаем ему значение
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}