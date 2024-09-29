import { IAnswer } from "./interfaces";
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/data.source";

class Answer extends Model<IAnswer> implements IAnswer {
    public id!: number;
    public userName!: string;
    public userEmail!: string;
    public question!: string;
    public answer!: string;
    public weight!: number;
}

Answer.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    freezeTableName: true,
    modelName: 'Answer',
    tableName: 'answers', // Especificamos el nombre de la tabla si difiere del nombre del modelo
    timestamps: false // Si no tienes columnas createdAt/updatedAt, desactiva timestamps
});

export default Answer;