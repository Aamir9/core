import { ProductSerial } from "@shared/service-proxies/service-proxies";

export class ProductViewModel  {
    id: number;
    productNumber: string | undefined;
    name: string | undefined;
    description: string | undefined;
    productGroupNumber: number;
    salesPrice: number;
    costPrice: number;
    unit: number;
    barcode: string | undefined;
    access: string | undefined;
    recprice: string | undefined;
    category: string | undefined;
    location: string | undefined;
    grossWeight: string | undefined;
    volume: string | undefined;
    productDiscountGroup: string | undefined;
    minStock: number;
    minOrder: number;
    recCostPrice: number;
    creatorUserId: number | undefined;
    creationTime: Date;
    inStock: number;
    base64Picture: string | undefined;
    quantityToBeAddInCart: number;
    serials:ProductSerial[]=[];
}
