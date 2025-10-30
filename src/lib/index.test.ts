import { expect, test } from 'bun:test';
import { Modifier } from '.';

test('modifier', () => {
    let score = 0;

    expect(new Modifier((x) => x + 20).apply(score)).toBe(20);
    expect(new Modifier((x) => x - 10).apply(score)).toBe(-10);
    expect(new Modifier((x) => x * 1.5).wrap(new Modifier((x) => x + 20)).apply(score)).toBe(30);
});

import { enumKeys } from './utils';
test('enum', () => {
    enum E1 {
        X = "A",
        Y = 1,
        Z
    }

    enum E2 {
        X,
        Y,
        Z,
    }

    enum E3 {
        X = "A",
        Y = "B",
        Z = "C",
    }
    console.log(E2.X);
    console.log(E2[0]);
    console.log(E3.X);

    console.log("E1 keys:", Object.keys(E1));
    console.log("E2 keys:", Object.keys(E2));
    console.log("E3 keys:", Object.keys(E3));

    console.log("E1 values:", Object.values(E1));
    console.log("E2 values:", Object.values(E2));
    console.log("E3 values:", Object.values(E3));

    console.log(enumKeys(E1));
    console.log(enumKeys(E2));
    console.log(enumKeys(E3));
})

test('object keys', () => {
    const obj = {
        [0]: {
            [0]: 1,
            [2]: 1,
        },
    }
    console.log(Object.keys(obj));
    console.log(Object.keys(obj[0]));
})