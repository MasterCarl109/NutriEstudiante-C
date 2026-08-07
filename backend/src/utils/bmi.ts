export interface BmiClassification {
  id: "underweight" | "normal" | "overweight" | "obesity";
  label: string;
  min: number;
  max: number | null;
}

export const BMI_CLASSIFICATIONS: BmiClassification[] = [
  { id: "underweight", label: "Bajo peso", min: 0, max: 18.5 },
  { id: "normal", label: "Peso normal", min: 18.5, max: 25 },
  { id: "overweight", label: "Sobrepeso", min: 25, max: 30 },
  { id: "obesity", label: "Obesidad", min: 30, max: null },
];

export function calculateBMI(weightKg: number, heightM: number): number {
  return weightKg / (heightM * heightM);
}

export function classifyBMI(bmi: number): BmiClassification {
  return (
    BMI_CLASSIFICATIONS.find((c) => c.max === null || bmi < c.max) ??
    BMI_CLASSIFICATIONS[0]
  );
}
