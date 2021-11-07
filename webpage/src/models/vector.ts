import { ThrowStmt } from "@angular/compiler";
import { Subject } from "rxjs";

export interface Vector {
    vector: number[];

    from(v: number[]): Vector;
    copy(): Vector;
    add(v: Vector): Vector;
}

export class RegisteredVector implements Vector {
    yes: number = 0;
    no: number = 0;
    total: number = 0;
    
    constructor(yes?: number, no?: number, total?: number) {
        this.yes = yes || 0;
        this.no = no || 0;
        this.total = total || 0;
    }

    from(v: number[]): RegisteredVector {
        this.yes = v[0];
        this.no = v[1];
        this.total = v[2];
        return this;
    }

    count(isComing: boolean | null): RegisteredVector {
        if (isComing) {
            this.yes++;
        } else if (isComing === false) {
            this.no++;
        }

        this.total++;

        return this;
    }

    copy(): RegisteredVector {
        return new RegisteredVector(this.yes, this.no, this.total);
    }

    add(b: RegisteredVector): RegisteredVector {
        const newVec = new RegisteredVector(this.yes + b.yes, this.no + b.no, this.total + b.total);
        return newVec;
    }

    reset() {
        this.yes = 0;
        this.no = 0;
        this.total = 0;
    }

    get vector() {
        return [this.yes, this.no, this.total];
    }
}

export class AllergiesVector implements Vector {
    vector: number[] = [];

    constructor(len = 1) {
        if (len == 0) {
            throw Error("Allergies error has invalid length");
        }
        this.vector = Array<number>(len).fill(0);
    }

    from(arr: number[]): AllergiesVector {
        this.vector = [...arr];
        return this;
    }

    add(b: AllergiesVector): AllergiesVector {
        if (b.vector.length !== this.vector.length) {
            throw Error("array cant be added");
        }
        this.vector = this.vector.map((v, i) => v + b.vector[i]);
        return this;
    }

    copy(): AllergiesVector {
        return new AllergiesVector().from([...this.vector]);
    }

    reset() {
        this.vector = Array<number>(this.vector.length).fill(0);
    }
}