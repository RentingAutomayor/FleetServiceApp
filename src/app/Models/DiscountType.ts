export class DiscountType {
    public id: number;
    public name: string;
    public state: boolean;
    public registrationDate: Date;
}

export enum DiscountTypes{
    PORCENTAJE_POR__TOTAL_MANTENIMIENTO = 1,
	VALOR_FIJO_POR_TOTAL_MANTENIMIENTO = 2,
	PORCENTAJE_POR_REPUESTOS = 3,
	VALOR_FIJO_POR_REPUESTOS = 4
}
