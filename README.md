# Tap to Grow - Farcaster Mini App

A tree-growing game built as a Farcaster mini app with Node.js backend and MongoDB.

## Features

- 🌳 Tree growing game with levels and upgrades
- 👛 Wallet connection (MetaMask, Bitget, Farcaster)
- 💾 Auto-save game progress
- 🏆 Leaderboard system
- 🎁 Daily rewards
- 🔄 Prestige system

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Blockchain**: Wagmi + Farcaster Frame SDK
- **Deployment**: Vercel (Frontend + Serverless API)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd tap-to-grow-full
npm install
```

### 2. Set up MongoDB Atlas (Required for Backend)

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project

2. **Create Database Cluster**:
   - Click "Build a Database" → "M0 Cluster" (Free tier)
   - Choose your cloud provider and region
   - Create cluster (takes 1-3 minutes)

3. **Set up Database Access**:
   - Go to "Database Access" → "Add New Database User"
   - Create user with read/write permissions
   - Note down username and password

4. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Add `0.0.0.0/0` for global access (or your Vercel IP)

5. **Get Connection String**:
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>` in the string

### 3. Environment Variables

**Local Development** (`.env` in root):
```env
VITE_API_URL=http://localhost:5000
```

**Production** (Vercel Environment Variables):
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `VITE_API_URL`: Your Vercel deployment URL

### 4. Local Development

#### Start Backend (Local - Optional)
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:5000`

#### Start Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### 5. Vercel Deployment Options

#### **Option A: Deploy Everything Together (Recommended)**
Deploys both frontend and backend as serverless functions:
```bash
vercel
```

#### **Option B: Deploy Backend Separately**
If you want to deploy only the backend:
```bash
cd backend
npx vercel --prod
```

### 6. Configure Environment Variables

#### **Method 1: Vercel CLI (Recommended)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "Yes" for all questions
   - Your app will be deployed!

#### **Method 2: GitHub Integration**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect your settings

#### **Method 3: Vercel Dashboard**

1. **Manual Upload**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → "Import Git Repository"
   - Or drag & drop your project folder

### 6. Configure Environment Variables in Vercel

1. **Go to Vercel Dashboard**:
   - Navigate to your project
   - Go to "Settings" → "Environment Variables"

2. **Add Variables**:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/tap-to-grow?retryWrites=true&w=majority
   VITE_API_URL = https://your-app-name.vercel.app
   ```

3. **Redeploy** (important!):
   ```bash
   vercel --prod
   ```
   Or trigger redeploy in Vercel dashboard

### 7. Update Farcaster Configuration

After deployment, update these files with your Vercel URL:

**`public/.well-known/farcaster.json`**:
```json
{
  "miniapp": {
    "homeUrl": "https://your-app.vercel.app",
    "imageUrl": "https://your-app.vercel.app/tree.png"
  }
}
```

**`public/.well-known/miniapp.json`**:
```json
{
  "miniapp": {
    "homeUrl": "https://your-app.vercel.app",
    "imageUrl": "https://your-app.vercel.app/tree.png"
  }
}
```

### 8. Verify Deployment

1. **Check API Endpoints**:
   - `https://your-app.vercel.app/api/users/test-wallet`
   - `https://your-app.vercel.app/api/leaderboard`

2. **Test Frontend**:
   - Visit `https://your-app.vercel.app`
   - Try connecting a wallet
   - Check if data saves/loads

### 9. Troubleshooting

#### **API Not Working**:
- Check Vercel function logs
- Verify MongoDB connection string
- Ensure environment variables are set

#### **Wallet Connection Issues**:
- Check browser console for errors
- Verify wallet is installed
- Test with MetaMask first

#### **Database Connection**:
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Test with MongoDB Compass

### 10. Production Optimizations

#### **Database Indexing** (MongoDB Atlas):
```javascript
// Add indexes for better performance
db.users.createIndex({ wallet: 1 }, { unique: true });
db.users.createIndex({ xp: -1 });
```

#### **Environment Variables**:
- Use production MongoDB cluster
- Set up proper CORS policies
- Configure rate limiting if needed

### 11. Monitoring & Maintenance

#### **Vercel Analytics**:
- Monitor API usage
- Track error rates
- Analyze performance

#### **Database Monitoring**:
- Set up MongoDB Atlas alerts
- Monitor connection limits
- Track query performance

### 🎉 **Your App is Live!**

After successful deployment:
- ✅ **Frontend**: `https://your-app.vercel.app`
- ✅ **Backend API**: `https://your-app.vercel.app/api/*`
- ✅ **Database**: MongoDB Atlas
- ✅ **Farcaster Ready**: Mini-app configured

**Your Tap to Grow game is now live and ready for players! 🌟**

## API Endpoints

- `GET /api/users/[wallet]` - Get or create user profile
- `PUT /api/users/[wallet]` - Update user profile
- `GET /api/leaderboard` - Get top players

## Farcaster Integration

The app is configured as a Farcaster mini app with:
- Frame SDK integration
- Wallet connection support
- Mini app manifest files

## Game Mechanics

- **Tapping**: Click to grow your tree and earn XP
- **Upgrades**: Buy tap power and auto-grow upgrades
- **Levels**: Progress through tree evolution stages
- **Daily Rewards**: Claim daily bonuses
- **Prestige**: Reset for permanent bonuses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT License