import { FindOptions, Model, ModelStatic, Transaction } from "sequelize";
import PaginationHelper from "../helpers/pagination-helper";
import { IPaginator } from "../models/interfaces";

export class BaseService {

    /**
     * Get generic list of model
     * @param paginatorHelper 
     * @param options 
     * @param pagination 
     * @returns 
     */
    public async GetListModelAsync<T extends Model>(paginatorHelper: PaginationHelper<T>, options: FindOptions, pagination: IPaginator): Promise<T[] | undefined> {
        try {
            const modelFiltered = await paginatorHelper.PaginateModel(options, pagination, {});

            if (!modelFiltered || !modelFiltered.data) {
                throw new Error("No se encontraron registros");
            }

            let records: T[] = modelFiltered.data;
            paginatorHelper.UpdatePaginatorData(pagination, modelFiltered);

            return records;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                console.log('Unexpected error', error);
                throw new Error('Unexpected error');
            }
        }
    }

    /**
     * Add data into database on generic form
     * @param model 
     * @param dataToAdd 
     * @returns 
     */
    public async AddModelAsync<T extends Model>(
        model: ModelStatic<T>,
        dataToAdd: any,
        transaction?: Transaction | null
    ): Promise<T> {
        try {
            const primaryKey = model.primaryKeyAttribute;

            if (!dataToAdd) {
                throw new Error("Datos vacios");
            }

            dataToAdd[primaryKey] = null;

            if (transaction) {
                return await model.create(dataToAdd, { transaction });
            } else {
                return await model.create(dataToAdd);
            }
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
     * Update generic data model
     * @param modelToUpdate 
     */
    public async UpdateModelAsync<T extends Model>(
        model: ModelStatic<T>,
        dataToUpdate: any,
        transaction?: Transaction | null
    ): Promise<T> {
        try {
            const primaryKey = model.primaryKeyAttribute;

            if (!dataToUpdate || !dataToUpdate[primaryKey]) {
                throw new Error("No existe el registro consultado");
            }

            let currentElement = await model.findByPk(dataToUpdate[primaryKey]);

            if (!currentElement) {
                throw new Error("No existe el registro consultado");
            }

            if (transaction) {
                return currentElement.update(dataToUpdate as T, { transaction });
            } else {
                return currentElement.update(dataToUpdate as T);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                console.log('Unexpected error', error);
                throw new Error('Unexpected error');
            }
        }
    }

    public async GetModelByIdAsync<T extends Model>(model: ModelStatic<T>, id_model: number): Promise<T> {
        try {
            const primaryKey = model.primaryKeyAttribute;

            if (typeof id_model !== 'number' && isNaN(id_model) && id_model === 0) {
                throw new Error("Identificador invalido");
            }

            const modelById = await model.findByPk(id_model);

            if (!modelById) {
                throw new Error("No se encontró el registro");
            }

            return modelById;
        } catch (error) {
            console.log('Unexpected error', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unexpected error');
            }
        }
    }

    public async GetModelByOptions<T extends Model>(
        model: ModelStatic<T>,
        findOptions: FindOptions
    ): Promise<T[] | undefined> {
        try {
            return await model.findAll(findOptions);
        } catch (error) {
            console.log('Unexpected error', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unexpected error');
            }
        }
    }
}