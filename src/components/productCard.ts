import { Component } from './base/components';
import { ensureElement } from '../utils/utils';
import { IProduct } from '../types/index';

interface IProductCardActions {
	onClick: (event: MouseEvent, product: IProduct) => void;
	data?: IProduct;
}

export class ProductCard extends Component<IProduct> {
	// Ссылки на внутренние элементы карточки
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _data: IProduct;

	// Конструктор принимает родительский контейнер
	// и объект с колбэк функциями
	constructor(container: HTMLElement, actions?: IProductCardActions) {
		super(container);

		this._data = actions?.data || ({} as IProduct);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
		this._button = container.querySelector(`.card__button`);
		this._description = container.querySelector(`.card__text`);
		this._category = container.querySelector(`.card__category`);
		this._price = container.querySelector(`.card__price`);


		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', (event) => {
					actions.onClick(event, this._data);
				});
			} else {
				container.addEventListener('click', (event) => {
					actions.onClick(event, this._data);
				});
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
		this.setImage(this._image, value, this.title);
	}

	// сеттер цены
	set price(value: number | null) {
		this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
		if (this._button && !value) {
			this._button.disabled = true;
		}
	}

	// сеттер категории
	setCategory(value: string) {
		this.setText(this._category, value);
	}

	// Сеттер и геттер для описания (необязательный)
	set description(value: string | null) {
		if (value) {
			this.setText(this._description, value);
		} else {
			this._description?.remove();
		}
	}
	get description(): string | null {
		return this._description?.textContent || null;
	}

}
