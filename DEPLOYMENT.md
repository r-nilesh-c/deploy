# Deployment Guide

This guide covers various deployment options for the Quiz Competition Web Application.

## 🚀 Quick Deployment Options

### 1. Heroku (Recommended for beginners)

#### Prerequisites
- Heroku account
- Heroku CLI installed
- MongoDB Atlas account (free tier available)

#### Steps

1. **Prepare for deployment**
   ```bash
   # Create a Procfile in the root directory
   echo "web: cd backend && npm start" > Procfile
   
   # Update backend package.json start script
   # Make sure it's: "start": "node server.js"
   ```

2. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas account
   - Create a new cluster (free tier)
   - Get your connection string
   - Whitelist all IP addresses (0.0.0.0/0) for development

3. **Deploy to Heroku**
   ```bash
   # Login to Heroku
   heroku login
   
   # Create a new Heroku app
   heroku create your-quiz-app-name
   
   # Set environment variables
   heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
   heroku config:set NODE_ENV=production
   
   # Deploy
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   
   # Seed the database
   heroku run cd backend && node seedData.js
   ```

4. **Build and serve frontend**
   ```bash
   # In your backend/server.js, add static file serving
   # Add this after your routes:
   
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../frontend/build')));
     
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
     });
   }
   ```

### 2. Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`
4. Deploy

#### Backend on Railway
1. Connect your GitHub repository to Railway
2. Set start command: `cd backend && npm start`
3. Add environment variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`
   - `PORT` (Railway will set this automatically)
4. Deploy

### 3. DigitalOcean Droplet

#### Prerequisites
- DigitalOcean account
- Basic Linux knowledge

#### Steps

1. **Create and setup droplet**
   ```bash
   # Create Ubuntu 20.04 droplet
   # SSH into your droplet
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Deploy your application**
   ```bash
   # Clone your repository
   git clone your-repository-url
   cd quiz-competition-app
   
   # Install dependencies
   cd backend && npm install
   cd ../frontend && npm install && npm run build
   
   # Seed database
   cd ../backend && node seedData.js
   
   # Start with PM2
   pm2 start server.js --name "quiz-backend"
   pm2 startup
   pm2 save
   ```

3. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/quiz-app
   server {
       listen 80;
       server_name your-domain.com;
       
       # Serve frontend
       location / {
           root /path/to/your/app/frontend/build;
           try_files $uri $uri/ /index.html;
       }
       
       # Proxy API requests to backend
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable the site
   sudo ln -s /etc/nginx/sites-available/quiz-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### 4. AWS (Advanced)

#### Using AWS Elastic Beanstalk

1. **Prepare application**
   ```bash
   # Create .ebextensions/nodecommand.config
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: "cd backend && npm start"
   ```

2. **Deploy**
   ```bash
   # Install EB CLI
   pip install awsebcli
   
   # Initialize and deploy
   eb init
   eb create production
   eb deploy
   ```

#### Using AWS EC2 + RDS + S3

1. **Set up EC2 instance** (similar to DigitalOcean)
2. **Set up RDS for MongoDB** (or use MongoDB Atlas)
3. **Use S3 for static file serving**
4. **Configure CloudFront for CDN**

## 🔧 Production Configuration

### Environment Variables

```bash
# Backend (.env)
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri

# Frontend (.env.production)
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### Security Considerations

1. **CORS Configuration**
   ```javascript
   // In backend/server.js
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? ['https://your-frontend-domain.com'] 
       : 'http://localhost:3000',
     credentials: true
   }));
   ```

2. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```
   
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api', limiter);
   ```

3. **Helmet for Security Headers**
   ```bash
   npm install helmet
   ```
   
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

### Performance Optimization

1. **Enable Gzip Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Database Indexing**
   ```javascript
   // In your MongoDB
   db.questions.createIndex({ category: 1 });
   db.results.createIndex({ finalScore: -1, createdAt: -1 });
   ```

3. **Caching**
   ```javascript
   // Cache questions for 1 hour
   const NodeCache = require('node-cache');
   const cache = new NodeCache({ stdTTL: 3600 });
   ```

## 🔍 Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring**
   ```bash
   pm2 monit
   pm2 logs
   ```

2. **Application Logs**
   ```javascript
   // Use winston for logging
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

### Database Monitoring

1. **MongoDB Atlas Monitoring** (if using Atlas)
2. **Custom health checks**
   ```javascript
   // Add to your routes
   app.get('/api/health', async (req, res) => {
     try {
       await mongoose.connection.db.admin().ping();
       res.json({ status: 'healthy', database: 'connected' });
     } catch (error) {
       res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
     }
   });
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors

2. **Database Connection Issues**
   - Verify MongoDB URI
   - Check network connectivity
   - Ensure database is running

3. **CORS Errors**
   - Update CORS configuration
   - Check frontend API URL configuration

4. **Performance Issues**
   - Enable compression
   - Optimize database queries
   - Use CDN for static assets

### Debugging Commands

```bash
# Check application logs
pm2 logs quiz-backend

# Check system resources
htop
df -h

# Check network connectivity
curl -I http://localhost:5000/api/health

# Check database connection
mongo your-mongodb-uri --eval "db.adminCommand('ping')"
```

## 📊 Scaling Considerations

### Horizontal Scaling

1. **Load Balancer** (Nginx, AWS ALB)
2. **Multiple Backend Instances**
3. **Database Clustering**
4. **CDN for Static Assets**

### Vertical Scaling

1. **Increase server resources**
2. **Optimize database queries**
3. **Implement caching strategies**

## 🔐 SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📝 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database seeded with questions
- [ ] CORS properly configured
- [ ] SSL certificate installed
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
- [ ] Performance optimization applied
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Health checks working

---

Choose the deployment method that best fits your needs and technical expertise. For beginners, Heroku is recommended, while DigitalOcean or AWS provide more control for advanced users.