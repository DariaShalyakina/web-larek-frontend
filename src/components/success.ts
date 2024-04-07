import { Component } from './base/components';

interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
	id: string;
	total: number;
}

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(
		container: HTMLElement,
		actions?: ISuccessActions
	) {
		super(container);

		this._button = container.querySelector(`.order-success__close`);
		this._total = container.querySelector(`.order-success__description`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			}
		}
	}

	// Установка значения описания успешного действия
	set total(total: string) {
		this.setText(this._total, total);
	  }
	}