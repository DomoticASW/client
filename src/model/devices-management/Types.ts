import type { Brand } from "@/utils"
import { Type } from "../Type"

export interface Color {
  readonly r: number
  readonly g: number
  readonly b: number
}
export function Color(r: number, g: number, b: number): Color {
  r = Math.max(0, r)
  r = Math.min(255, r)
  g = Math.max(0, g)
  g = Math.min(255, g)
  b = Math.max(0, b)
  b = Math.min(255, b)
  return { r, g, b }
}
export function isColor(obj: unknown): obj is Color {
  return obj != undefined && typeof obj == "object" &&
    "r" in obj && typeof obj.r == "number" &&
    "g" in obj && typeof obj.g == "number" &&
    "b" in obj && typeof obj.b == "number"
}

export type TypeConstraints<T> = Enum | IntRange | DoubleRange | None<T>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface TypeConstraint<T> {
  readonly type: Type;
}

export interface Enum extends Brand<TypeConstraint<string>, "Enum"> {
  readonly values: Set<string>;
}
class EnumImpl implements Enum {
  values: Set<string>;
  type: Type = Type.StringType;
  __brand: "Enum";

  constructor(values: Set<string>) {
    this.values = values
    this.__brand = "Enum"
  }
}
export function Enum(values: Set<string>): Enum {
  return new EnumImpl(values)
}

export interface IntRange extends Brand<TypeConstraint<number>, "IntRange"> {
  readonly min: number;
  readonly max: number;
}
class IntRangeImpl implements IntRange {
  min: number;
  max: number;
  type: Type = Type.IntType;
  __brand: "IntRange";

  constructor(min: number, max: number) {
    this.min = min
    this.max = max
    this.__brand = "IntRange"
  }

}
export function IntRange(min: number, max: number): IntRange {
  return new IntRangeImpl(min, max)
}

export interface DoubleRange extends Brand<TypeConstraint<number>, "DoubleRange"> {
  readonly min: number;
  readonly max: number;
}
class DoubleRangeImpl implements DoubleRange {
  min: number;
  max: number;
  type: Type = Type.DoubleType;
  __brand: "DoubleRange";

  constructor(min: number, max: number) {
    this.min = min
    this.max = max
    this.__brand = "DoubleRange"
  }

}
export function DoubleRange(min: number, max: number): DoubleRange {
  return new DoubleRangeImpl(min, max)
}

export type None<T> = Brand<TypeConstraint<T>, "None">
class NoneImpl<T> implements None<T> {
  __brand: "None";
  type: Type;
  constructor(type: Type) {
    this.type = type
    this.__brand = "None"
  }
}
export function NoneBoolean(): None<boolean> {
  return new NoneImpl(Type.BooleanType)
}
export function NoneInt(): None<number> {
  return new NoneImpl(Type.IntType)
}
export function NoneDouble(): None<number> {
  return new NoneImpl(Type.DoubleType)
}
export function NoneString(): None<string> {
  return new NoneImpl(Type.StringType)
}
export function NoneColor(): None<Color> {
  return new NoneImpl(Type.ColorType)
}
export function NoneVoid(): None<void> {
  return new NoneImpl(Type.VoidType)
}
