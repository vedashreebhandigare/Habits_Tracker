# Habit Tracker - Analytics-Driven Web App

A powerful habit and hobby tracking web application that replaces motivation with data-driven accountability through comprehensive analytics.

## Features

### 🎯 Core Functionality
- **Habit Management**: Add, edit, delete, and archive habits with custom icons and categories
- **Daily Tracker**: Spreadsheet-style checkbox grid for tracking daily habits
- **Real-time Progress**: Instant visual feedback on your progress

### 📊 Analytics Dashboard
- **Overall Progress**: View your completion percentage with color-coded indicators
- **Weekly Performance**: Bar charts showing daily habit completion rates
- **Monthly Analytics**: Detailed breakdown of habits completed vs. missed
- **Yearly Statistics**: Comprehensive yearly overview with monthly trends
- **Habit Rankings**: See which habits you're most consistent with

### ⚡ Key Features
- Streak tracking for each habit
- Weekly and monthly summaries
- Best/worst month highlights
- Habit-wise yearly performance
- Responsive design for all devices
- Data persistence using localStorage

## Tech Stack

- **Frontend**: React 18 with Vite
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Styling**: Custom CSS with clean, minimal design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd habit-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and deploy

### Deploy to Netlify
1. Push your code to GitHub
2. Connect your repository on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

### Deploy to GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```
3. Update vite.config.js with base path
4. Run: `npm run deploy`

## Usage

### Adding Habits
1. Navigate to "Manage Habits"
2. Click "Add New Habit"
3. Enter habit name, select category, and choose an icon
4. Click "Create Habit"

### Tracking Daily
1. Go to "Daily Tracker"
2. Click checkboxes to mark habits as complete for each day
3. Navigate between months using arrow buttons
4. View weekly summaries at the bottom

### Viewing Analytics
1. Click "Analytics" to see yearly overview
2. Review monthly progress chart
3. Check habit-wise performance
4. Identify best and worst months

## Data Storage

All data is stored locally in your browser using localStorage. Your data persists across sessions but is device-specific.

## Future Enhancements

- Backend integration for cross-device sync
- User authentication
- Habit reminders and notifications
- Export data to CSV
- Dark mode
- Habit templates
- AI-powered insights
- Public/private sharing

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for better habits and data-driven self-improvement
