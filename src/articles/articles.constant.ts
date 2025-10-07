export const VALIDATION = {
  TITLE: {
    MIN: 10,
    MAX: 100,
    MAX_ENTITY: 255,
  },
  DESCRIPTION: {
    MIN: 10,
    MAX: 100,
    MAX_ENTITY: 255,
  },
  BODY: {
    MIN: 10,
    MAX: 255,
    MAX_ENTITY: 500,
  },
} as const;
