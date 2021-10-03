import { Subject } from "rxjs";

export interface Vector {
    vector: Subject<number[]>;
    getVector(): number[];
}

export class RegisteredVector implements Vector {
    _yes: number = 0;
    _no: number = 0;
    _total: number = 0;
    vector = new Subject<number[]>();

    set yes(x: number) {
        this._yes = x;
        this.vector.next(this.getVector());
    }
    get yes(): number {
        return this._yes;
    }

    set no(x: number) {
        this._no = x;
        this.vector.next(this.getVector());
    }
    get no(): number {
        return this._no;
    }

    set total(x: number) {
        this._total = x;
        this.vector.next(this.getVector());
    }
    get total(): number {
        return this._total;
    }
    

    count(isComing: boolean | null) {
        if (isComing) {
            this.yes++;
        } else if (isComing === false) {
            this.no++;
        }

        this.total++;
    }

    add(b: RegisteredVector): RegisteredVector {
        const newVec = new RegisteredVector();
        newVec.yes = this.yes + b.yes;
        newVec.no = this.no + b.no;
        newVec.total = this.total + b.total;
        newVec.vector.next(newVec.getVector());
        return newVec;
    }

    reset() {
        this.yes = 0;
        this.no = 0;
        this.total = 0;
        this.vector.next(this.getVector());
    }

    getVector() {
        return [this._yes, this._no, this._total];
    }
}

export class AllergiesVector implements Vector {
    values: number[] = [];
    vector = new Subject<number[]>();

    constructor(len = 1) {
        if (len == 0) {
            throw Error("Allergies error has invalid length");
        }
        this.values = Array<number>(len).fill(0);
    }

    from(arr: number[]) {
        this.values = arr;
        this.vector.next(this.values);
        return this;
    }

    add(b: AllergiesVector) {
        if (b.values.length !== this.values.length) {
            throw Error("array cant be added");
        }
        this.values = this.values.map((v, i) => v + b.values[i]);
        this.vector.next(this.values);
    }

    reset() {
        this.values = Array<number>(this.values.length).fill(0);
        this.vector.next(this.values);
    }

    getVector() {
        return this.values;
    }
}