import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 주어진 범위 내의 랜덤 숫자를 생성합니다.
 * @param min 최소값 (포함)
 * @param max 최대값 (포함)
 * @returns min과 max 사이의 랜덤 정수
 */
export function getRandomNumber(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 주어진 범위 내에서 지정된 개수만큼의 유니크한 랜덤 숫자 배열을 생성합니다.
 * @param min 최소값 (포함)
 * @param max 최대값 (포함)
 * @param count 생성할 숫자의 개수
 * @returns 유니크한 랜덤 숫자 배열
 */
export function getUniqueRandomNumbers(
  min: number,
  max: number,
  count: number,
): number[] {
  // 요청한 개수가 가능한 범위를 초과하는 경우 에러
  if (count > max - min + 1) {
    throw new Error(
      "Cannot generate more unique numbers than the range allows",
    );
  }

  const numbers = new Set<number>();

  while (numbers.size < count) {
    numbers.add(getRandomNumber(min, max));
  }

  return Array.from(numbers);
}

/**
 * 배열을 무작위로 섞습니다.
 * @param array 섞을 배열
 * @returns 섞인 새로운 배열
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
