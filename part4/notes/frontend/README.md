A react app notes app

To deploy updates:

1. Build frontend
npm run build

2. Copy the dist folder to backend
cp -r dist ../backend

3. Deploy to Fly.io
fly deploy