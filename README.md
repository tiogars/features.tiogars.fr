# features.tiogars.fr

My features website built with React + TypeScript + Vite and deployed to GitHub Pages.

## Features

- **Progressive Web App (PWA)**: Install the app on your device for a native-like experience
- **Web Share Target API**: Share GitHub repository links directly to the app from GitHub Copilot or other apps
- **Automatic Repository Creation**: Shared GitHub URLs are automatically parsed and added to your repository list
- **Offline Support**: Service worker enables offline functionality
- **Feature Management**: Create, edit, and organize feature requests with tags
- **Repository Management**: Manage multiple GitHub repositories
- **Create GitHub Issues**: Convert features into GitHub issues

## PWA Installation

When you visit the app in a compatible browser (Chrome, Edge, Safari, etc.), you'll see an install prompt. Click "Install" to add the app to your home screen or app drawer.

### Using Web Share Target

Once installed, you can share GitHub repository links to the app:

1. From GitHub Copilot or any other app, share a repository link
2. Select "Features Manager" as the share target
3. The repository will be automatically added to your list

Supported URL formats:
- `https://github.com/owner/repo`
- `https://github.com/owner/repo.git`
- `github.com/owner/repo`
- Repository URLs with additional paths (e.g., `/issues`, `/pull/123`)

## Development

Install dependencies:
```bash
pnpm install
```

Start the development server:
```bash
pnpm dev
```

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch via GitHub Actions.
