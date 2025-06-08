// Centralized Theme System for TempoDay
export const sectionThemes = {
  tasks: {
    primary: 'blue',
    colors: {
      icon: 'text-blue-500',
      button: {
        solid: 'bg-blue-500 text-white hover:bg-blue-600',
        dashed:
          'text-blue-600 border-blue-300 hover:border-blue-500 hover:text-blue-700',
      },
      focus: 'focus:ring-blue-500',
      accent: 'text-blue-600',
    },
  },
  notes: {
    primary: 'purple',
    colors: {
      icon: 'text-purple-500',
      button: {
        solid: 'bg-purple-500 text-white hover:bg-purple-600',
        dashed:
          'text-purple-600 border-purple-300 hover:border-purple-500 hover:text-purple-700',
      },
      focus: 'focus:ring-purple-500',
      accent: 'text-purple-600',
    },
  },
  financials: {
    primary: 'green',
    colors: {
      icon: 'text-green-500',
      button: {
        solid: 'bg-green-500 text-white hover:bg-green-600',
        dashed:
          'text-green-600 border-green-300 hover:border-green-500 hover:text-green-700',
      },
      focus: 'focus:ring-green-500',
      accent: 'text-green-600',
    },
  },
} as const;

export type SectionTheme = keyof typeof sectionThemes;
