# Examen Civique

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)

Free web application to practice for the French civic exam, mandatory since January 2026 for naturalization and resident card applications.

Available at https://reussirmonexamencivique.fr/

## Features

- **Exam mode**: Full simulation with 40 questions in 45 minutes
- **Study mode**: Browse the 259 official questions by category
- **Progress tracking**: Quiz history and statistics by topic
- **100% free**: No registration required
- **Offline**: Works without internet after first load

## Exam Format (2026 Reform)

| Aspect | Details |
|--------|---------|
| Questions | 40 (28 knowledge + 12 situational) |
| Format | MCQ - 4 choices, 1 correct answer |
| Duration | 45 minutes maximum |
| Passing score | 32/40 (80%) |

## Technologies

- [Nuxt 4](https://nuxt.com/) - Vue.js framework with static site generation (SSG)
- [Vue 3](https://vuejs.org/) - Reactive JavaScript framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Static typing
- [Vitest](https://vitest.dev/) - Unit testing

## Installation

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:3000

## Available Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run generate  # Static site generation (SSG)
npm run preview   # Preview the build
npm run test      # Tests in watch mode
npm run test:run  # Tests in CI mode
npm run lint      # ESLint check
npm run lint:fix  # ESLint auto-fix
npm run format    # Prettier formatting
```

## Project Structure

```
reussirmonexamencivique.fr/
├── app/
│   ├── components/     # Vue components
│   │   ├── quiz/       # Quiz components
│   │   ├── results/    # Results display
│   │   └── ui/         # Base components
│   ├── composables/    # Reusable logic
│   ├── layouts/        # Application layouts
│   └── pages/          # Pages (automatic routing)
├── data/
│   └── questions.json  # 259 official questions
├── locales/
│   └── fr.json         # French translations
├── types/
│   └── index.ts        # TypeScript interfaces
└── tests/              # Unit tests
```

## Contributing

Contributions are welcome.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## References

- [Service-Public.fr - Nouvel examen civique](https://www.service-public.fr/particuliers/actualites/A18713)
- [Formation Civique Officielle](https://formation-civique.interieur.gouv.fr/)
- [Légifrance - Arrêté du 10 octobre 2025](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052381620)
