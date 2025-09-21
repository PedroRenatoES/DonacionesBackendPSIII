FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

ENV NODE_ENV=production
# Ajusta si tu app usa otra variable de puerto
ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
