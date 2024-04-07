import { Component } from './base/components';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IProduct } from '../types/index';

interface IModalData {
	content: HTMLElement;
	product?: IProduct;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement; 
	protected _content: HTMLElement;
	protected _addToBasketButton: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// Инициализируем ссылки на элементы модального окна
		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		// Добавляем обработчик события клика на кнопку закрытия
		this._closeButton.addEventListener('click', this.close.bind(this));

		// Добавляем обработчик события клика на содержимое модального окна (чтобы предотвратить закрытие при клике внутри него)
		this.container.addEventListener('click', this.close.bind(this));

		// Добавляем обработчик события `stopPropagation()` на содержимое модального окна
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	// Сеттер для содержимого модального окна
	set content(value: HTMLElement) {
		this._content.replaceChildren(value); // Заменяем содержимое модального окна новым значением
	}

	// Метод открытия модального окна
	open() {
		this.container.classList.add('modal_active'); // Добавляем класс "modal_active" для открытия модального окна
		this.events.emit('modal:open'); // Вызываем событие "modal:open"
	}

	// Метод закрытия модального окна
	close() {
		this.container.classList.remove('modal_active'); // Удаляем класс "modal_active" для закрытия модального окна
		this.content = null; // Очищаем содержимое модального окна
		this.events.emit('modal:close'); // Вызываем событие "modal:close"
	}

	// Метод рендеринга данных в модальном окне
	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}