# Create image based on node image
FROM node:16-alpine as build

COPY webapp /app
# Set working directory
WORKDIR /app

# Add /app/node_modules/.bin to environment variables
ENV PATH /app/node_modules/.bin:$PATH

# Install all app dependencies
RUN npm install
RUN npm install react-scripts -g

# Build the app
# ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# Create image based on nginx and deploy our built React app
# FROM nginx:1.17-alpine

# Uncomment it once frontend added
# RUN mkdir -p "/app/"$DOMAIN_NAME
# COPY --from=build /app/build "/app/"$DOMAIN_NAME
# COPY --from=build /app/build /usr/share/nginx/html

# Dummy html file to test (TODO: Remove it once frontend added!)
# RUN touch /usr/share/nginx/html/index.html
# RUN echo "Hi, world" > /usr/share/nginx/html/index.html

# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]