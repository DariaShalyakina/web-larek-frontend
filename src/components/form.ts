import { Component } from './base/components';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

// Интерфейс описывает форму.
interface IForm {
	valid: boolean;
	errors: string[]; 
}

// Класс-компонент для формы.
export class Form<T> extends Component<IForm> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(
		protected container: HTMLFormElement,
		protected events: IEvents
	) {
		super(container);

		// Ищем кнопку отправки формы.
		this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
		// Ищем блок с ошибками.
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		// При изменении полей формы вызываем обработчик.
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T; // Название поля.
			const value = target.value; // Значение поля.
			this.onInputChange(field, value);
		});

		// При отправке формы вызываем обработчик.
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	// Обработчик изменения полей формы.
	protected onInputChange(field: keyof T, value: string) {
		// Вызываем событие изменения поля формы.
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value, 
		});
	}

	// Установка свойства valid.
	set valid(value: boolean) {
		this._submit.disabled = !value; // Отключение кнопки отправки, если форма невалидна.
	}

	// Установка свойства errors.
	set errors(value: string) {
		this._errors.textContent = value; // Отображение ошибок в блоке.
	}

	// Отрисовка формы.
	render(state: Partial<T> & IForm): HTMLFormElement {
		const { valid, errors, ...inputs } = state; // Разбор состояния.
		super.render({ valid, errors }); // Отрисовка общих свойств.
		Object.assign(this, inputs); // Установка значений полей.
		return this.container; // Возвращаем контейнер формы.
	}
}
