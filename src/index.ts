import './scss/styles.scss';

import { AppAPI } from './components/appApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';

import { Page } from './components/page';
import { IProduct, IOrderForm } from './types';
import { AppState, Product } from './components/appState';
import { ProductCard } from './components/productCard';
import { Modal } from './components/modal';
import { Basket, ProductInBasket } from './components/basket';
import { OrderForm } from './components/order';
import { ContactsForm } from './components/contacts';
import { Success } from './components/success';

// Создаем экземпляр класса EventEmitter для обработки событий
const events = new EventEmitter();

// Создаем экземпляр класса AppAPI для работы с API
const api = new AppAPI(CDN_URL, API_URL);

// Создаем экземпляр класса AppState для управления состоянием приложения
const appData = new AppState({}, events);

// Получаем шаблоны из HTML-документа
const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const productPrewiewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const productbasketModal = ensureElement<HTMLTemplateElement>('#card-basket');

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contact = new ContactsForm(cloneTemplate(contactsTemplate), events);

//запрос к серверу для получения карточек
api
	.getProductList()
	.then((catalog) => appData.setProductList(catalog))
	.catch((err) => {
		console.error(err);
	});

// изменения списка продуктов
events.on('items:changed', () => {
	page.render();
	page.catalog = appData.catalog.map((item) => {
		const card = new ProductCard(cloneTemplate(productCatalogTemplate), {
			onClick: () => {
				events.emit('preview:changed', item);
			},
		});
		card.setCategory(item.category);
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Обработчик события изменения текущего товара
events.on('preview:changed', (data: IProduct) => {
	const preview = new ProductCard(cloneTemplate(productPrewiewTemplate), {
	  onClick: () => {
		if (!appData.isProductInBasket(data)) {
		  appData.addProductToBasket(data as Product);
		  preview.buttonText = 'Уже в корзине';
		  modal.close();
		} 
  
		//обновляем счетчик
		events.emit('basket:update');
		page.counter = appData.basket.length;
	  },
	});
  
	// данные в карточке превью
	preview.image = data.image;
	preview.title = data.title;
	preview.price = data.price;
	preview.setCategory(data.category);
	preview.description = data.description; // описание, если оно есть
	preview.buttonText = appData.isProductInBasket(data)? 'Уже в корзине' : 'В корзину'

	if (!data.price) {
		preview.buttonText = 'Не купить';
	}
  
	// отображаем превью
	modal.content = preview.render();
	modal.open();
  });


// удаление карточки из корзины
events.on('basket:remove', (item: Product) => {
	appData.removeProductFromBasket(item);
	events.emit('basket:changed');
	events.emit('counter:changed');
});

// счетчик
events.on('counter:changed', () => {
	page.counter = appData.basket.length;
});

// Открытие корзины
events.on('basket:open', () => {
	return modal.render({
		content: basket.render({}),
	});
});

// Отображение элементов в корзине
events.on('basket:changed', () => {
	const basketItems = appData.basket.map((item, index) => {
		// Создаем карточку товара в корзине
		const productItem = new ProductInBasket(cloneTemplate(productbasketModal), {
			onClick: () => events.emit('basket:remove', item), // Добавляем обработчик события удаления товара
		});

		// Отрисовываем карточку товара и возвращаем ее HTML-представление
		return productItem.render({
			title: item.title,
			price: item.price,
			index: index + 1, // Устанавливаем индекс товара в корзине
		});
	});

	// Получаем итоговую сумму корзины
	const total = appData.getBasketTotal();

	// Обновляем содержимое корзины
	basket.render({
		items: basketItems,
		total: total || 0, // Если итоговая сумма равна 0, отображаем 0
	});

	// Обновляем состояние кнопки оформления заказа
	basket.selected = basketItems.map((item) => item.title);
});

// открываем форму способа оплаты и адреса
events.on('order:open', () => {
	appData.validateOrder();
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

// открываем форму контактных данных
events.on('order:submit', () => {
	appData.order.total = appData.getBasketTotal();
	appData.order.items = appData.basket
		.filter((item) => item.price !== null && item.price !== 0)
		.map((item) => item.id);
	modal.render({
		content: contact.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// изменения ошибок формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !address && !payment;
	contact.valid = !email && !phone;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contact.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// изменения способа оплаты
events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.validateOrder();
});

// изменения адреса доставки
events.on('address:change', (item: HTMLInputElement) => {
	appData.order.address = item.value;
	appData.validateOrder();
});

// изменения поля формы заказа
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// изменения поля формы контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// оформление заказа и модальное окно об успехе
events.on('contacts:submit', async () => {
	try {
		const res = await api.postOrderProduct(appData.order);

		const success = new Success(cloneTemplate(successTemplate), {
			onClick: () => {
				modal.close();
				appData.clearBasket();
				page.counter = 0;
			},
		});

		modal.render({
			content: success.render({
				total: Number(res.total),
			}),
		});
	} catch (error) {
		console.error(error);
	}
});

// блокировка и разблокировка прокрутки страницы
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
