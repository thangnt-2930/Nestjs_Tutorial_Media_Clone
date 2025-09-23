export const VALIDATION = {
  PASSWORD: {
    MIN: 6,
    MAX: 18,
    MAX_ENTITY: 255,
  },
  NAME: {
    MIN: 8,
    MAX: 32,
    MAX_ENTITY: 100,
  },
  EMAIL: {
    MIN: 13,
    MAX: 50,
    MAX_ENTITY: 100,
  },
} as const;
