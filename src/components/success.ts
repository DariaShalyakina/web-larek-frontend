import { Component } from './base/components';

interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
	description: number;
}

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(
		container: HTMLElement,
		actions?: ISuccessActions
	) {
		super(container);

		this._button = container.querySelector(`.order-success__close`);
		this._description = container.querySelector(`.order-success__description`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	// Установка значения описания успешного действия
	set description(value: number) {
		// Установка текста описания
		this._description.textContent = `Списано ${value} синапсов`;
	}
}
