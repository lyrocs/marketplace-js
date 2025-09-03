# Marketplace JS

A modern, full-stack marketplace application built with AdonisJS, Vue 3, and TypeScript. This application provides a robust platform for creating and managing an online marketplace with features like product listings, user authentication, and more.

## 🖥️ Demo

Try the live demo: [https://marketplace.lyrocs.ovh/](https://marketplace.lyrocs.ovh/)

## 🚀 Features

- **Modern Stack**: Built with AdonisJS 6, Vue 3, and TypeScript
- **Authentication & Authorization**: Secure user authentication and role-based access control
- **Real-time Updates**: Interactive UI with real-time features
- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Full TypeScript support throughout the application
- **Modern UI**: Built with Radix Vue and Tailwind CSS

## 🛠️ Tech Stack

- **Backend**: AdonisJS 6 (Node.js)
- **Frontend**: Vue 3 with Inertia.js
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS with Radix Vue components
- **Authentication**: AdonisJS Auth
- **Form Handling**: Vee-Validate
- **Icons**: Lucide Icons
- **State Management**: Vue Composition API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- pnpm 8+

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lyrocs/marketplace-js.git
   cd marketplace-js
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy the environment file and update the variables:

   ```bash
   cp .env.example .env
   ```

4. Generate an app key:

   ```bash
   node ace generate:key
   ```

5. Run database migrations:

   ```bash
   node ace migration:run
   ```

6. Start the development server:

   ```bash
   pnpm dev
   ```

7. Open your browser and visit: [http://localhost:3333](http://localhost:3333)

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

## 🧹 Linting

```bash
# Run ESLint
pnpm lint

# Fix linting issues
pnpm lint --fix

# Format code
pnpm format
```

## 📦 Production Build

To create a production build:

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [AdonisJS](https://adonisjs.com/)
- [Vue.js](https://vuejs.org/)
- [Inertia.js](https://inertiajs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
