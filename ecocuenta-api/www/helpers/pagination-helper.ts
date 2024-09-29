import to from "await-to-js";
import { FindOptions, Model, ModelStatic } from "sequelize/types";
import { IPaginator } from "../models/interfaces/Ipaginator.interface";

export default class PaginationHelper<T extends Model> {
    private model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    /**
     * Build a generic constructor for the pagination of model
     * @param options 
     * @param paginador 
     * @param optionsForCalculateTotal 
     * @param raw 
     * @param nest 
     * @returns 
     */
    async PaginateModel(options: FindOptions, paginador: IPaginator, optionsForCalculateTotal?: FindOptions, raw: boolean = false, nest: boolean = false) {
        const currentPage: number = !paginador.page || paginador.page == 0 ? 1 : Number.parseInt(paginador.page.toString()) + 1;
        let limitTo: number | undefined = undefined;
        let offset = undefined;
        let totalRecords = 0;

        if (paginador.size) {
            limitTo = !paginador.size ? undefined : paginador.size;
            offset = !limitTo ? undefined : (currentPage - 1) * limitTo;
        }

        let ordenarConsulta: [[string, string]] | undefined;
        if (paginador.sort && paginador.order) {
            ordenarConsulta = [[paginador.sort, paginador.order]];
        }

        try {
            const [errorTotal, resultsTotal] = await to(this.model.findAll<T>({ ...options }));

            if (errorTotal && !resultsTotal) {
                throw errorTotal;
            }

            if (resultsTotal && resultsTotal.length) {
                totalRecords = resultsTotal.length;
            }

            const [error, results] = await to(
                this.model.findAll<T>({
                    ...options,
                    offset,
                    limit: limitTo,
                    order: ordenarConsulta,
                    raw,
                    nest,
                })
            );

            if (error) {
                throw error;
            }

            const lastPage = !limitTo ? 0 : totalRecords > 0 ? Math.ceil(totalRecords / limitTo) : 0;
            const hasMorePages = currentPage < lastPage;

            return { lastPage, totalRecords, currentPage, hasMorePages, data: results };
        } catch (error) {
            console.log('Unexpected error', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unexpected error');
            }
        }
    }

    /**
     * Update data paginator
     * @param pagination 
     * @param paginatedData 
     * @returns 
     */
    UpdatePaginatorData(pagination: IPaginator,
        paginatedData: { lastPage: number, totalRecords: number, currentPage: number, hasMorePages: boolean, data: T[] | undefined }) {
        pagination.length = paginatedData.totalRecords;
        pagination.lastPage = Math.max(Math.ceil(pagination.length / pagination.size), 1);
        pagination.startIndex = pagination.page * pagination.size;
        pagination.endIndex = (Math.min((pagination.size * (pagination.page + 1)), pagination.length)) - 1;
        pagination.totalRecords = paginatedData.totalRecords;
    }
}