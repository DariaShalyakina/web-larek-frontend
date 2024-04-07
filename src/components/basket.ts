import { Component } from './base/components';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';
import { IProductInBasket } from '../types';

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
		this._total = this.container.querySelector('.basket__price');
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

	// Сеттер для установки итоговой суммы корзины
	set total(total: number) {
		if (this._total) {
			this.setText(this._total, `${total} синапсов`);
		}
	}
}

interface IProductBasketActions {
	onClick: (event: MouseEvent) => void;
}

export class ProductInBasket extends Component<IProductInBasket> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IProductBasketActions) {
		super(container);
		this._title = container.querySelector(`.card__title`);
		this._index = container.querySelector(`.basket__item-index`);
		this._price = container.querySelector(`.card__price`);
		this._button = container.querySelector(`.card__button`);

		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set price(value: number) {
		this.setText(this._price, value + ' синапсов');
	}
}
