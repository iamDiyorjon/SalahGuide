# SalahGuide (Namoz App)

A React-based web application that provides prayer guidance for Muslims who join congregational prayers (Namaz) late. The app calculates remaining rakats and provides step-by-step instructions for completing the prayer correctly.

## Features

- **Multi-Prayer Support**: Covers all five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
- **Late Joining Calculator**: Determines how many rakats you've completed with the Imam
- **Position Tracking**: Accounts for whether you joined before or after Ruku
- **Detailed Instructions**: Provides specific guidance for Qirat (recitation) and Tashahhud timing
- **Responsive Design**: Works on desktop and mobile devices
- **Uzbek Language Interface**: Fully localized in Uzbek

## Prayer Types Supported

- **Bomdod** (Fajr) - 2 rakats
- **Peshin** (Dhuhr) - 4 rakats  
- **Asr** (Afternoon) - 4 rakats
- **Shom** (Maghrib) - 3 rakats
- **Xufton** (Isha) - 4 rakats

## How It Works

1. Select the prayer you're joining
2. Choose which rakat the congregation is currently on
3. Specify whether you joined before or after Ruku
4. Get personalized instructions for completing your remaining rakats

## Technology Stack

- **React 19.1.0** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS 3.4.17** - Styling and responsive design
- **Vite 6.3.5** - Build tool and development server

## Installation

```bash
# Clone the repository
git clone https://github.com/iamDiyorjon/SalahGuide.git
cd SalahGuide

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. Open the application in your web browser
2. Select the prayer type you're joining
3. Choose the rakat number when you joined
4. Select your joining position (before or after Ruku)
5. Click "Yoriqnomani Korsatish" to get your guidance
6. Follow the step-by-step instructions for remaining rakats

## Prayer Calculation Logic

The app uses Islamic jurisprudence rules to calculate:
- How many rakats you completed with the Imam
- Which rakats require Fatiha + Surah vs. Fatiha only
- When to sit for Tashahhud
- Proper completion sequence for missed rakats

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgments

- Built to help Muslims maintain proper prayer practices
- Follows traditional Islamic prayer guidelines
- Designed with accessibility and ease of use in mind
