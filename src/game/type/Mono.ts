import { Dimensions } from "@/util";

export interface Mono {
    destructor(): void;
    loop(deltaInSeconds: number): void;
    resize(dimensions: Dimensions): void;
}
