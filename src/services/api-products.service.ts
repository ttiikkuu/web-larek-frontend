import { Api } from "../components/base/api";
import { ApiListResponse, Product } from "../types";
import { API_URL } from "../utils/constants";

export class ApiProductsService extends Api {
    constructor() {
        super(API_URL);
    }

    getAll() {
        return this.get<ApiListResponse<Product[]>>('/product')
            .then(responseList => responseList.items);
    }

    getById(id: string) {

    }
}

