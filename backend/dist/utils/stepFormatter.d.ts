import type { VisualizationStep } from "../models/stepSchema.js";
export declare function resetStepSequence(): void;
export declare function nextStepNumber(): number;
type StepInput = Partial<VisualizationStep> & Pick<VisualizationStep, "type"> & {
    step?: number;
};
export declare function makeStep(partial: StepInput): VisualizationStep;
export {};
//# sourceMappingURL=stepFormatter.d.ts.map