# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

TaxEase is a React-based tax calculation and investment planning web application. It helps users calculate their income tax under different regimes, visualize their financial breakdown, and explore tax-saving investment options.

## Commands

### Development
```bash
npm run dev
```
Starts the Vite development server with HMR (Hot Module Replacement).

### Build
```bash
npm run build
```
Creates an optimized production build using Rolldown-Vite.

### Lint
```bash
npm run lint
```
Runs ESLint on the codebase to check for code quality issues.

### Preview
```bash
npm run preview
```
Preview the production build locally.

## Architecture

### Build System
- **Vite/Rolldown**: Uses `rolldown-vite@7.1.14` (Rust-based bundler) for faster builds
- **React Compiler**: Enabled via `babel-plugin-react-compiler` for automatic React optimizations
- **Tailwind CSS 4**: Modern CSS framework with custom configuration

### Key Libraries
- **React 19** with React Router DOM for routing
- **Framer Motion**: All animations and transitions
- **Recharts**: Data visualization (pie charts, bar charts, line charts)
- **Lucide React**: Icon library

### Application Structure

**Layout Pattern**: Fixed sidebar + main content area
- `App.jsx` sets up the Router with a fixed left sidebar (`.ml-64` margin) and renders page routes
- `Sidebar.jsx` is fixed at 256px width (`w-64`) on the left side
- `Header.jsx` sits at the top of the main content area
- Page components render in the main content area with padding

**Pages**:
- `/` - Dashboard: Tax calculator, income breakdown pie chart, investment recommendations, and key stats
- `/reports` - Reports: Historical tax data with bar/line charts and downloadable reports
- `/profile` - Profile: User profile page

**Component Categories**:
1. **Layout Components**: `Sidebar.jsx`, `Header.jsx`
2. **Feature Components**: `TaxCalculatorCard.jsx`, `PieSummary.jsx`, `InvestmentCard.jsx`
3. **Page Components**: `Dashboard.jsx`, `Reports.jsx`, `Profile.jsx`

### Styling System

**Global Styles** (`index.css`):
- `.glass-card`: Glassmorphism effect with blur, semi-transparent white background
- `.gradient-button`: Primary action button with indigo gradient
- Custom gradient background on body element

**Tailwind Configuration**:
- **Custom Colors**:
  - `primary`: Indigo palette (50-900)
  - `teal`: Teal palette for positive/savings indicators
- **Font**: Inter from Google Fonts

**Design Patterns**:
- Use `glass-card` for all card-based UI elements
- Use `gradient-button` for primary CTAs
- Framer Motion `motion` components wrap most elements for animations
- Color coding: Red for tax/expenses, Teal for savings/income, Primary (indigo) for neutral actions

### Tax Calculation Logic

Located in `TaxCalculatorCard.jsx`:
- **New Regime**: Progressive tax slabs (0% up to ₹3L, 5%, 10%, 15%, 20%, 30%)
- **Old Regime**: Simplified calculation (0% up to ₹2.5L, 5%, 20%, 30%)
- Both calculations are client-side only

### Data Flow

Currently, all data is **hardcoded** in components:
- Dashboard stats are static values
- Investment recommendations are defined in `Dashboard.jsx` as an array
- Monthly report data is defined in `Reports.jsx`
- No backend or state management library is used

### File Organization
```
src/
├── components/     # Reusable UI components
├── pages/          # Route-level page components
├── assets/         # Static assets (images, etc.)
├── App.jsx         # Root component with routing
├── main.jsx        # React app entry point
└── index.css       # Global styles
```

## ESLint Configuration

- Uses flat config format with `eslint/config`
- React Hooks plugin with recommended rules
- React Refresh plugin for Vite HMR
- Custom rule: `no-unused-vars` ignores uppercase/screaming snake case variables
- Ignores `dist/` directory

## Development Notes

- The React Compiler will impact dev & build performance but provides automatic optimizations
- All icons use Lucide React - maintain consistency by continuing to use this library
- Animations use Framer Motion with staggered delays for sequential element reveals
- When adding new routes, update both `App.jsx` routes and `Sidebar.jsx` navigation items
