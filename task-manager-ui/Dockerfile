FROM node:22.19.0-alpine

WORKDIR /app

# Use Vite env vars (NOT REACT_APP)
ARG VITE_API_URL
ARG VITE_APP_URL

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_URL=${VITE_APP_URL}

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]