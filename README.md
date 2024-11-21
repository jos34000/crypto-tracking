# Crypto Tracking Application

This is a **Crypto Tracking** application built with [Next.js](https://nextjs.org) that allows users to track cryptocurrency prices and transactions. The application fetches data from the Binance API and provides insights into various cryptocurrencies.

## Features

- Fetches real-time cryptocurrency data from Binance.
- Displays daily statistics for different cryptocurrencies.
- Allows users to view transaction history and details.
- Utilizes Prisma for database management with SQLite.
- Responsive design using Tailwind CSS for a modern user interface.

## Getting Started

To get started with the application, follow these steps:

### Prerequisites

Make sure you have the following installed:

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jos34000/crypto-tracking.git
   cd crypto-tracking
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the database:

   - Ensure you have a SQLite database file named `bdd.db` in the `prisma` directory.

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## API Endpoints

The application provides the following API endpoints:

- **GET /api/higherPrice**: Fetches the highest price of a specified cryptocurrency on a given date.
- **GET /api/lowerPrice**: Fetches the lowest price of a specified cryptocurrency on a given date.
- **GET /api/test**: A test endpoint to verify logging functionality.

## Technologies Used

- **Next.js**: Framework for building server-rendered React applications.
- **React**: JavaScript library for building user interfaces.
- **Prisma**: ORM for database management.
- **SQLite**: Lightweight database for storing application data.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Binance API**: External API for fetching cryptocurrency data.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.
