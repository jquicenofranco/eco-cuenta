import { HttpResponse } from "../helpers/http.response.helper";
import { IAnswer } from "../models/interfaces";
import { Request, Response } from "express";
import Answer from "../models/answer.entity";

export class AnswerController {
    private readonly LOW_THRESHOLD = 24;  // 12 preguntas * peso promedio de 2
    private readonly HIGH_THRESHOLD = 36; // 12 preguntas * peso promedio de 3

    constructor(
        private readonly _httpResponse: HttpResponse = new HttpResponse(),
    ) { }

    public async SaveAnswer(req: Request, res: Response) {
        try {
            const answer: IAnswer = req.body;
            const newAnswer = await Answer.create({ ...answer });
            const weight = newAnswer.answerSelected.reduce((sum, item) => sum + item.weight, 0);
            const suggestions = this.provideDetailedFeedback(weight);
            this._httpResponse.Created(res, suggestions);
        } catch (error) {
            return this._httpResponse.Error(res, error);
        }
    }

    private evaluateImpact(totalWeight: number): { level: string; recommendations: string[] } {
        let level: string;
        let recommendations: string[];

        if (totalWeight <= this.LOW_THRESHOLD) {
            level = "bajo";
            recommendations = [
                "Continúa con tus excelentes hábitos ecológicos.",
                "Comparte tus prácticas con amigos y familiares para inspirarlos.",
                "Considera involucrarte en iniciativas comunitarias de sostenibilidad.",
                "Explora nuevas tecnologías eco-amigables para tu hogar."
            ];
        } else if (totalWeight <= this.HIGH_THRESHOLD) {
            level = "medio";
            recommendations = [
                "Revisa tu consumo de energía y considera cambiar a electrodomésticos más eficientes.",
                "Implementa un sistema de reciclaje más riguroso en tu hogar.",
                "Reduce el tiempo de tus duchas y el uso de agua caliente.",
                "Utiliza más el transporte público o medios de transporte no motorizados.",
                "Mejora el aislamiento térmico de tu hogar para reducir el uso de calefacción/aire acondicionado."
            ];
        } else {
            level = "alto";
            recommendations = [
                "Realiza una auditoría energética en tu hogar para identificar áreas de mejora.",
                "Cambia urgentemente a bombillas LED y electrodomésticos de alta eficiencia energética.",
                "Instala sistemas de ahorro de agua en grifos, duchas e inodoros.",
                "Considera la instalación de paneles solares o otras fuentes de energía renovable.",
                "Minimiza el uso de plásticos de un solo uso y prioriza productos reutilizables.",
                "Educa a todos los miembros de tu hogar sobre la importancia de reducir el consumo de recursos."
            ];
        }

        return { level, recommendations };
    }

    private provideDetailedFeedback(totalWeight: number): { level: string, recommendations: string } {
        const { level, recommendations } = this.evaluateImpact(totalWeight);

        let feedback = `Tu impacto ecológico es de nivel ${level}.\n\n`;
        feedback += "Recomendaciones personalizadas:\n";
        recommendations.forEach((recommendation, index) => {
            feedback += `${index + 1}. ${recommendation}\n`;
        });
        return { level, recommendations: feedback };
    }
}