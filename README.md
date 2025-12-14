## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

## Steps to follow

# 1 Install libraries

`npm install -g pnpm@latest`

# 2 Install app dependencies

`pnpm i`

# 3 Start the dev server

`pnpm dev`

## Reference Links

https://www.tarascodes.com/nextjs-fluentui-setup
https://nextjs.org/learn/dashboard-app/fetching-data

https://youtu.be/ijx0Uqlo3NA

# Samples
NotebookLM.GOogle.coom

#Folder names
1. uploaded_files - User Uploaded file from client. File get saved in this folder. This is raw file not processed by AI engine.
2. summarized_files - 
3. parsed_files - These are list of files where AI engine parsed files processed by AI Engine.
4. edited_files - These are list of files where used edit
5. bm25_

# Deploying the docker image to Google cloud
docker tag biz2brick-nextjs gcr.io/bizbricksclient/biz2brick-nextjs:latest

docker push gcr.io/bizbricksclient/biz2brick-nextjs:latest

gcloud run deploy biz2brick-nextjs 
  --image gcr.io/bizbricksclient/biz2brick-nextjs:latest 
  --platform managed 
  --region us-central1 
  --allow-unauthenticated 
  --port 3000


https://biz2brick-nextjs-79518260312.us-central1.run.app



To deploy your Docker container to Google Cloud Platform (GCP), follow these steps:

1. Authenticate and set up gcloud:
   - Install the Google Cloud SDK: https://cloud.google.com/sdk/docs/install
   - In PowerShell, run:
     ```
     gcloud auth login
     gcloud config set project bizbricksclient
     ```

2. Build your Docker image (if not already built):
   ```
   docker build -t biz2brick-nextjs .
   ```

3. Tag your image for Google Container Registry (GCR) or Artifact Registry:
   ```
   docker tag biz2brick-nextjs gcr.io/bizbricksclient/biz2brick-nextjs:latest
   ```

4. Authenticate Docker to GCP:
   ```
   gcloud auth configure-docker
   ```

5. Push your image to GCR:
   ```
   docker push gcr.io/bizbricksclient/biz2brick-nextjs:latest
   ```

6. Deploy to Cloud Run (recommended for web apps):
   ```
   gcloud run deploy biz2brick-nextjs \
     --image gcr.io/bizbricksclient/biz2brick-nextjs:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 3000
   ```

Replace YOUR_PROJECT_ID and YOUR_REGION with your actual GCP project ID and region (e.g., us-central1).

Let me know if you want step-by-step help for any of these steps!Replace YOUR_PROJECT_ID and YOUR_REGION with your actual GCP project ID and region (e.g., us-central1).

Let me know if you want step-by-step help for any of these steps!


## Running application locally

` flutter run -d chrome --web-port 3001 `


Test change