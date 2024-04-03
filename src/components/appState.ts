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

// Класс, описывающий состояние приложения
export class AppState extends Model<IAppState> {
	basket: Product[] = []; // Корзина с товарами
	catalog: Product[]; // Массив со всеми товарами

	// установка товаров в магазине
	setProductList(items: IProduct[]) {
		this.catalog = items.map((item) => new Product({ ...item }, this.events));
		this.emitChanges('items:changed', { store: this.catalog });
	}

	// Объект заказа клиента и объект с ошибками форм
	orderDetails: IOrder = {
		items: [],
		payment: '',
		total: null,
		address: '',
		email: '',
		phone: '',
	};

    formErrors: FormErrors = {};
	order: any;

	// Методы работы с корзиной

	// Добавление товара в корзину
	addProductToBasket(value: Product) {
		this.basket = [...this.basket, value];
	}

	// Удаление товара из корзины по его id
	removeProductFromBasket(id: string) {
		this.basket = this.basket.filter((item) => item.id !== id);
	}

	// Получение количества товаров в корзине
	getBasketCount() {
		return this.basket.length;
	}

	// Установка заказанных товаров
	setOrderedItems() {
		this.orderDetails.items = [...new Set(this.basket.map((item) => item.id))];
	}

	// Получение общей стоимости товаров в корзине
	getBasketTotal() {
		return this.basket.reduce((sum, next) => sum + next.price, 0);
	}

	// Установка значения поля заказа
	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
	}

    // валидация форм
    validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.orderDetails.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.orderDetails.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.orderDetails.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.orderDetails.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}