import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder, IOrderResult } from '../types';

export interface IAppAPI {
	getProductList: () => Promise<IProduct[]>;
	postOrderProduct: (order: IOrder) => Promise<IOrderResult>;
}

export class AppAPI extends Api implements IAppAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product/').then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		});
	}

	postOrderProduct(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
