# Tap to Grow Backend

Express.js API server for the Tap to Grow game, deployed on Vercel.

## 🚀 Quick Deploy to Vercel

### Prerequisites
- MongoDB Atlas account and connection string
- Vercel account

### Deploy Steps

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/tap-to-grow?retryWrites=true&w=majority
   ```

5. **Your API will be live at**: `https://your-backend.vercel.app`

## 📡 API Endpoints

### Users
- `GET /api/users/:wallet` - Get user profile
- `PUT /api/users/:wallet` - Update/create user profile

### Leaderboard
- `GET /api/leaderboard` - Get top 10 players

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

## 📁 Project Structure

```
backend/
├── server.js          # Main Express server
├── vercel.json        # Vercel deployment config
├── package.json       # Dependencies and scripts
├── models/
│   └── User.js        # MongoDB user schema
├── routes/
│   ├── users.js       # User API routes
│   └── games.js       # Game API routes
└── README.md          # This file
```

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `PORT` | Server port (optional) | `5000` |

## 🔍 Testing API

```bash
# Test user endpoint
curl https://your-backend.vercel.app/api/users/0x123...

# Test leaderboard
curl https://your-backend.vercel.app/api/leaderboard
```

## 🚨 Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**:
   - Check connection string format
   - Verify IP whitelist in MongoDB Atlas
   - Ensure database user has read/write permissions

2. **Vercel Deployment Failed**:
   - Check Vercel function logs
   - Verify Node.js version (>=18)
   - Ensure all dependencies are in package.json

3. **CORS Issues**:
   - CORS is enabled for all origins in production
   - Check browser console for CORS errors

## 📊 Monitoring

- **Vercel Dashboard**: View function logs and performance
- **MongoDB Atlas**: Monitor database usage and connections
- **API Response Times**: Check with browser dev tools

## 🔒 Security

- Environment variables for sensitive data
- Input validation on all endpoints
- CORS configured for web app access
- MongoDB connection with authentication

---

**Ready to deploy? Just run `npx vercel --prod` in this folder!** 🚀</content>
</xai:function_call"> 

<xai:function_call name="apply_diff">
<parameter name="path">backend/.gitignore