import { Component } from './base/components';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IProduct } from '../types/index';

interface IModalData {
	content: HTMLElement;
	product?: IProduct;
}

export class Modal extends Component<IModalData> {
	protected container: HTMLElement;
	protected events: IEvents;
	private _closeButton: HTMLButtonElement;
	private _content: HTMLElement;
	private _addToBasketButton: HTMLButtonElement;

	constructor(container: HTMLElement | string) {
		super(container as HTMLElement);

		// Инициализируем кнопку закрытия модального окна.
		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

		// Инициализируем содержимое модального окна.
		this._content = ensureElement<HTMLElement>('.modal__content', this.container);

		// Инициализируем кнопку добавления товара в корзину.
		this._addToBasketButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

		this.init();
	}

	// Метод init инициализирует модальное окно.
	protected init() {
		// Добавляем обработчик события клика на кнопку закрытия.
		this._closeButton.addEventListener('click', () => this.close());

		// Получаем целевой элемент события.
		this.container.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;

			// Если целевой элемент не является кнопкой добавления в корзину и не является потомком содержимого, закрываем модальное окно.
			if (
				target !== this._addToBasketButton &&
				!this._content.contains(target)
			) {
				this.close();
			}
		});
	}

	// Метод open открывает модальное окно.
	open(data?: IModalData) {
		// Добавляем класс modal--open для открытия модального окна.
		this.container.classList.add('modal--open');

		// Вызываем событие modal:open.
		this.events.emit('modal:open');

		// Если переданы данные, отрисовываем их в модальном окне.
		if (data) {
			this.render(data);
		}
	}

	// Метод close закрывает модальное окно.
	close() {
		this.container.classList.remove('modal--open'); // Удаляем класс modal--open для закрытия модального окна.

		this._content.innerHTML = ''; // Очищаем содержимое модального окна.

		this.events.emit('modal:close'); // Вызываем событие modal:close.
	}

	render(data: IModalData): HTMLElement {
		// Метод render отрисовывает данные в модальном окне.
		this._content.appendChild(data.content);
		// Добавляем содержимое в модальное окно.
		return this.container;
		// Возвращаем контейнер модального окна.
	}
}
