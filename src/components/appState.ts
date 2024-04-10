import { IOrder, IProduct, IOrderForm } from '../types';
import { Model } from './base/model';
import { IAppState, FormErrors } from '../types';

export class Product extends Model<IProduct> {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: number | null;
}

export type CatalogChangeEvent = {
	catalog: Product[];
};

// Класс, описывающий состояние приложения
export class AppState extends Model<IAppState> {
	basket: Product[] = []; // Корзина с товарами
	catalog: Product[]; // Массив со всеми товарами

	// установка товаров в магазине
	setProductList(items: IProduct[]) {
		this.catalog = items.map((item) => new Product({ ...item }, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	// Объект заказа клиента и объект с ошибками форм
	order: IOrder = {
		items: [],
		payment: '',
		total: null,
		address: '',
		email: '',
		phone: '',
	};

	formErrors: FormErrors = {};

	// Методы работы с корзиной

	isProductInBasket(item: IProduct) {
		return this.basket.some(product => product.id === item.id);
	}

	// Добавление товара в корзину
	addProductToBasket(item: Product) {
		this.basket.push(item);
		this.emitChanges('basket:changed');
	}

	// Удаление товара из корзины по его id
	removeProductFromBasket(item: IProduct) {
		this.basket = this.basket.filter((el) => el.id != item.id);
		this.emitChanges('basket:changed');
	}

	// Получение количества товаров в корзине
	getBasketCount() {
		return this.basket.length;
	}

	// Установка заказанных товаров
	setOrderedItems() {
		this.order.items = [...new Set(this.basket.map((item) => item.id))];
	}

	// Получение общей стоимости товаров в корзине
	getBasketTotal() {
		return this.basket.reduce((sum, item) => sum + item.price, 0);
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('counter:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}

	// Установка значения поля заказа
	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
	
		if (this.validateOrder()) {
		  this.events.emit('order:ready', this.order);
		}
	  }
	
	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
