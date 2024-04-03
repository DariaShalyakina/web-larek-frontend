import { Component } from './base/components';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	// Конструктор, принимающий контейнер и объект с колбэк функциями
	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__total');
		this._button = this.container.querySelector('.basket__button');

		// добавляем обработчик события клика на кнопку оформления заказа
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open'); // Отправляем событие открытия формы заказа
			});
		}

		// Инициализируем массив товаров пустым
		this.items = [];
	}

	// Сеттер для установки списка товаров в корзине
	set items(items: HTMLElement[]) {
		if (items.length) {
			// Если товаров есть, обновляем список товаров в корзине
			this._list.replaceChildren(...items);
		} else {
			// Если корзина пуста, отображаем сообщение
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	// Сеттер для установки состояния кнопки оформления заказа
	set selected(items: string[]) {
		if (items.length) {
			// Если в корзине есть товары, разблокируем кнопку оформления заказа
			this.setDisabled(this._button, false);
		} else {
			// Если корзина пуста, блокируем кнопку оформления заказа
			this.setDisabled(this._button, true);
		}
	}
}
