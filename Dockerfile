FROM node:22.18-alpine AS build
WORKDIR /build
COPY .env package*.json postcss.config.mjs tsconfig.json ./
COPY src ./src

RUN npm i
RUN npm run build

RUN ls -la /build

EXPOSE 3000

CMD ["npm", "run", "start"]

#FROM build AS app
#WORKDIR /app

#COPY --from=build ./build/.next/standalone /app

#RUN ls -la

#EXPOSE 3000

#CMD ["npm", "run", "start"]