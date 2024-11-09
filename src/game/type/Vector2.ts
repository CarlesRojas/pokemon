export default class Vector2 {
    public static add(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    public static sub(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    public static mul(a: Vector2, b: number): Vector2 {
        return new Vector2(a.x * b, a.y * b);
    }

    public static dot(a: Vector2, b: Vector2): number {
        return a.x * b.x + a.y * b.y;
    }

    public static invert(a: Vector2): Vector2 {
        return new Vector2(-a.x, -a.y);
    }

    public static fromCoords(coords: string): Vector2 {
        const [x, y] = coords.split("-");
        return new Vector2(parseInt(x), parseInt(y));
    }

    public static direction(from: Vector2, to: Vector2): Vector2 {
        const direction = new Vector2(to.x - from.x, to.y - from.y);
        return direction.normalized;
    }

    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public get magnitude(): number {
        return Math.sqrt(this.sqrMagnitude);
    }

    public get sqrMagnitude(): number {
        return this.x * this.x + this.y * this.y;
    }

    public get normalized(): Vector2 {
        const v = new Vector2(this.x, this.y);
        const len = this.magnitude;
        if (len > 0) {
            v.x /= len;
            v.y /= len;
        }
        return v;
    }

    public get inverted(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    public get rounded(): Vector2 {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }

    public toCoords(): string {
        return `${this.x}-${this.y}`;
    }

    public toString(digits: number = 2): string {
        return `${this.x.toLocaleString("en", { maximumFractionDigits: digits })} ${this.y.toLocaleString("en", { maximumFractionDigits: digits })}`;
    }

    public equals(v: Vector2): boolean {
        return this.x === v.x && this.y === v.y;
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}
