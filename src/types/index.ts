 import { Product } from '../components/appState';

//Продукт
export interface IProduct {
	id: string;
	title: string;
	description?: string;
	image?: string;
	category: string;
	price: number | null;
}

// Заказ товара
export interface IOrder {
	payment: string;
    address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Ответ API
export interface ApiResponse {
	items: IProduct[];
}

// Информация о состоянии приложения
export interface IAppState {
    basket: Product[]; // товары в корзине
    catalog: Product[]; // список всех товаров
    order: IOrder; // информация о заказе
}
