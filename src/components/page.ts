import {Component} from "./base/components";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

// Интерфейс для страницы
interface IPage {
    counter: number; // Счетчик товаров в корзине
    catalog: HTMLElement[]; // Список элементов каталога
    locked: boolean; // Флаг блокировки страницы
}

// Класс страницы
export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    // Конструктор
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        // Добавляем обработчик события клика по корзине
        this._basket.addEventListener('click', () => {
            this.events.emit('bids:open');
        });
    }

    // Сеттер для счетчика
    set counter(value: number) {
        // Устанавливаем текст счетчика
        this.setText(this._counter, String(value));
    }

    // Сеттер для каталога
    set catalog(items: HTMLElement[]) {
        // Заменяем содержимое каталога новыми элементами
        this._catalog.replaceChildren(...items);
    }

    // Сеттер для блокировки
    set locked(value: boolean) {
        // Если страница заблокирована, добавляем класс блокировки
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } 
        // Иначе удаляем класс блокировки
        else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}