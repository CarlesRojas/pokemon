import Vector2 from "@/game/type/Vector2";

export interface Area {
    start: Vector2;
    end: Vector2;
}

export interface RenderArea {
    updateRenderArea(area: Area): void;
}
