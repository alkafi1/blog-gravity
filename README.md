# Blog Gravity

A modern, full-stack blog platform built with Laravel 12, React 19, and Inertia.js. Features a modular architecture, role-based access control (RBAC), and a beautiful, responsive UI powered by Tailwind CSS v4.

## 🚀 Features

### Core Functionality
- **📊 Advanced DataTables**: Powerful table component with column alignment (left/center/right), dynamic column visibility toggling, and instant data refresh.
- **📝 Post Management**: Create, edit, publish, and delete blog posts with 5 different aesthetic layout options.
- **📂 Category System**: Organize posts with hierarchical categories.
- **👥 Enhanced User Profiles**: Complete user management including profile images, phone number support, and roles.
- **🔐 Role-Based Access Control**: Granular permissions system with fine-grained policies for every module.
- **📈 Dashboard**: Real-time statistics and analytics for platform health.

### Architecture & API
- **✨ Standardized Controllers**: All admin resources use a unified `AdminResourceController` for consistent CRUD behavior and authorization.
- **📦 API Resources**: Clean data transformation using Laravel API Resources for perfect frontend-backend synchronization.
- **🛡️ Module-Level Policies**: Dedicated policies per module ensuring strict data isolation and security.
- **🔗 Wayfinder Integration**: Automatically generated TypeScript types for routes, actions, and layouts for ultimate type-safety.

### Developer Experience
- **Modular Architecture**: Clean separation of concerns with Laravel modules for Users, Posts, Roles, and Categories.
- **Type Safety**: Full TypeScript support across the entire frontend.
- **Modern Tooling**: ESLint, Prettier, and Laravel Pint for high code quality.
- **Hot Module Replacement**: Fast development loops with Vite.
- **Testing Suite**: PestPHP for comprehensive unit and feature testing.

## 🛠️ Tech Stack

### Backend
- **[Laravel 12](https://laravel.com/)** - Modern PHP framework
- **[Laravel Fortify](https://laravel.com/docs/fortify)** - Authentication backend
- **[Inertia.js](https://inertiajs.com/)** - Server-side routing with SPA experience
- **PHP 8.2+** - Latest PHP features

### Frontend
- **[React 19](https://react.dev/)** - UI library with React Compiler
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Headless UI](https://headlessui.com/)** - Unstyled, accessible components

### Development Tools
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[PestPHP](https://pestphp.com/)** - Elegant testing framework
- **[Laravel Pint](https://laravel.com/docs/pint)** - PHP code style fixer
- **[ESLint](https://eslint.org/)** - JavaScript linter
- **[Prettier](https://prettier.io/)** - Code formatter

## 📋 Requirements

- **PHP**: 8.2 or higher
- **Composer**: Latest version
- **Node.js**: 18.x or higher
- **NPM**: 9.x or higher
- **Database**: MySQL, PostgreSQL, or SQLite

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/alkafi1/blog-gravity.git
cd blog-gravity
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database

Edit your `.env` file and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blog_gravity
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**For SQLite** (simpler option for development):

```env
DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite
```

### 5. Run Migrations

```bash
# Create database tables
php artisan migrate

# Seed the database (optional)
php artisan db:seed
```

### 6. Sync Roles and Permissions

```bash
# Initialize RBAC system
php artisan rbac:sync
```

### 7. Build Assets

```bash
# For development
npm run dev

# For production
npm run build
```

### 8. Start the Development Server

**Option 1: Using Laravel's built-in server**
```bash
php artisan serve
```

**Option 2: Using Composer script (recommended)**
```bash
composer run dev
```

This will start:
- Laravel development server (http://localhost:8000)
- Queue worker
- Log viewer (Pail)
- Vite dev server with HMR

### 9. Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

## 👤 Default User Accounts

After seeding, you can log in with:

**Super Admin:**
- Email: `admin@example.com`
- Password: `password`

## 🎯 Quick Start Commands

```bash
# Run all tests
composer test

# Run linter
composer lint

# Format code
npm run format

# Type check
npm run types

# Clear all caches
php artisan optimize:clear
```

## 📁 Project Structure

```
blog-gravity/
├── app/                    # Core application code
│   ├── Console/           # Artisan commands
│   ├── Http/              # Controllers, middleware
│   └── Models/            # Eloquent models
├── Modules/               # Modular features
│   ├── Auth/             # Authentication module
│   ├── Category/         # Category management
│   ├── Post/             # Post management
│   ├── Role/             # RBAC system
│   └── User/             # User management
├── config/               # Configuration files
│   └── rbac.php         # Role & permission config
├── database/            # Migrations and seeders
├── resources/           # Frontend resources
│   └── js/             # React components
│       ├── components/ # Reusable components
│       ├── layouts/    # Layout components
│       └── pages/      # Inertia pages
├── routes/             # Route definitions
└── tests/              # Test files
```

## 🔐 RBAC Configuration

Roles and permissions are centrally managed in `config/rbac.php`. The system includes:

### Default Roles
- **Super Admin**: Full system access (all permissions)
- **Admin**: User and content management
- **Editor**: Content management and publishing
- **Writer**: Create and manage own posts

### Permission Groups
- **Users**: view, create, update, delete
- **Categories**: view, create, update, delete
- **Posts**: view, create, update, update.all, delete, delete.all, publish
- **Roles**: view, create, update, delete

To modify roles or permissions, edit `config/rbac.php` and run:
```bash
php artisan rbac:sync
```

## 🧪 Testing

```bash
# Run all tests
composer test

# Run specific test file
php artisan test tests/Feature/DashboardTest.php

# Run with coverage
php artisan test --coverage
```

## 🚢 Deployment

### Build for Production

```bash
# Install production dependencies
composer install --optimize-autoloader --no-dev

# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Variables

Make sure to set these in production:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## 🙏 Acknowledgments

- Built with [Laravel](https://laravel.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

**Made with ❤️ using Laravel, React, and Inertia.js**
