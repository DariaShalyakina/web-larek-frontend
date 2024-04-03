import { Component } from './base/components';
import { CDN_URL } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { IProduct } from '../types/index';

interface IProductCardActions {
	onClick: (event: MouseEvent) => void;
}

export class ProductCard extends Component<IProduct> {
	// Ссылки на внутренние элементы карточки
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	// Конструктор принимает родительский контейнер
	// и объект с колбэк функциями
	constructor(container: HTMLElement, actions?: IProductCardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
		this._button = container.querySelector(`.card__button`);
		this._description = container.querySelector(`.card__text`);
		this._category = container.querySelector(`.card__category`);
		this._price = container.querySelector(`.$card__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// cеттер и геттер для айди
	set id(value: string) {
		this.container.dataset.id = value;
	}
	get id(): string {
		return this.container.dataset.id || '';
	}

	// сеттер и гетер для названия
	set title(value: string) {
		this._title.textContent = value;
	}
	get title(): string {
		return this._title.textContent || '';
	}

	//сеттер картинки
	set image(value: string) {
		this._image.src = CDN_URL + value;
	}

	// сеттер цены
	set price(value: number | null) {
		this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
		if (this._button && !value) {
			this._button.disabled = true;
		}
	}

	// сеттер категории
	set category(value: string) {
		this._category.textContent = value;
	}
}
