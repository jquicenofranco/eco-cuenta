import { IAnswer, IAnswerSelected } from "./interfaces";
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/data.source";

class Answer extends Model<IAnswer> implements IAnswer {
    public id!: number;
    public userName!: string;
    public userEmail!: string;
    public answerSelected!: IAnswerSelected[];
}

Answer.init({
    id: {
        type: DataTypes.INTEGER,
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
    answerSelected: {
        type: DataTypes.JSONB,
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