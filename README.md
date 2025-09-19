 # Lingvist Backend

This is the backend for **Lingvist**, a platform that helps users learn English. The backend is built with **Express.js**, **TypeScript**, **Sequelize**, and a **serverless PostgreSQL database (Neon)**.

## Tech Stack
- **Node.js**
- **Express.js**
- **Sequelize**
- **PostgreSQL (Neon)**

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/lingvist-backend.git
cd lingvist-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root and add:
```
DATABASE_URL=postgres://your_username:your_password@your_neon_host:5432/your_database
PORT=3000
```
Replace the placeholders with actual values from your Neon database.

## Scripts
- **Start Development Server**: `npm run dev`
- **Start Production Server**: `npm start`

## Contributing
Feel free to submit pull requests or open issues to improve the backend!

## License
MIT License

