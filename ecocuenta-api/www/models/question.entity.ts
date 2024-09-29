import { IAnswerQ, IQuestion } from "./interfaces";
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/data.source";

class Question extends Model<IQuestion> implements IQuestion {
    public id!: number;
    public question!: string;
    public answers!: IAnswerQ[];
}

Question.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    answers: {
        type: DataTypes.JSONB, // Tipo JSONB que soporta Postgres
        allowNull: false
    }
}, {
    sequelize,
    freezeTableName: true,
    modelName: 'Question',
    tableName: 'questions', // Especificamos el nombre de la tabla si difiere del nombre del modelo
    timestamps: false // Si no tienes columnas createdAt/updatedAt, desactiva timestamps
});

export default Question;