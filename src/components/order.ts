import { Form } from './form';
import { IOrderForm } from '../types/index';
import { IEvents } from './base/events';

export class Order extends Form<IOrderForm> { 
	protected _payment: 'online' | 'cash' | null = null;

	constructor(container: HTMLFormElement, events: IEvents) { 
		super(container, events); // Вызов конструктора родительского класса с передачей контейнера и событий

		this.bindEvents(); // Вызов метода bindEvents для привязки событий
	}

    // метод для привязки событий к кнопкам
	protected bindEvents() { 
		// Привязка события клика к кнопке оплаты онлайн
		const onlineButton = this.container.querySelector(
			'button[name="card"]'
		) as HTMLButtonElement;
		if (onlineButton) {
			onlineButton.addEventListener('click', () => {
				this.payment = 'online';
				this.updatePaymentButtons();
			});
		}

		// Привязка события клика к кнопке оплаты наличными
		const cashButton = this.container.querySelector(
			'button[name="cash"]'
		) as HTMLButtonElement;
		if (cashButton) {
			cashButton.addEventListener('click', () => {
				this.payment = 'cash';
				this.updatePaymentButtons();
			});
		}

		// Привязка события клика к кнопке "Далее"
		const nextButton = this.container.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		if (nextButton) {
			nextButton.addEventListener('click', () => {
				this.handleNextButtonClick();
			});
		}
	}

    // метод для обновления стилей кнопок оплаты
	protected updatePaymentButtons() { 
		const onlineButton = this.container.querySelector('button[name="card"]');
		const cashButton = this.container.querySelector('button[name="cash"]');

		onlineButton?.classList.remove('button_alt-active');
		cashButton?.classList.remove('button_alt-active');

		if (this._payment === 'online') {
			onlineButton?.classList.add('button_alt-active');
		} else if (this._payment === 'cash') {
			cashButton?.classList.add('button_alt-active');
		}
	}

    // метод для обработки нажатия на кнопку "Далее"
	protected handleNextButtonClick() {
		const addressInput = this.container.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;
		const nextButton = this.container.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		if (addressInput && this._payment) {
			this.events.emit('contact:open');
		}
	}

    // Геттер и Сеттер для получения и установки значения оплаты
	get payment(): 'online' | 'cash' | null { 
		return this._payment;
	}

	set payment(value: 'online' | 'cash' | null) {
		this._payment = value;
		this.events.emit('payment:changed', { field: 'payment', value });
	}

    // Геттер и Сеттер для получения и установки значения адреса
	get address(): string { 
		return (this.container.elements.namedItem('address') as HTMLInputElement)
			.value;
	}

	set address(value: string) { 
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
