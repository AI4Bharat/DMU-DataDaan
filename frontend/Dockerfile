# # Create image based on node image
# FROM node:latest as build

# # Set working directory
# WORKDIR /app
# ADD . /app

# # Add /app/node_modules/.bin to environment variables
# ENV PATH /app/node_modules/.bin:$PATH

# # Install all app dependencies
# COPY package.json /app/package.json
# RUN npm install
# RUN npm install react-scripts -g

# # Build the app
# RUN npm run build

# Create image based on nginx and deploy our built React app
FROM nginx:1.17-alpine

# Uncomment it once frontend added
# COPY --from=build /app/build /usr/share/nginx/html

# Dummy html file to test (TODO: Remove it once frontend added!)
RUN touch /usr/share/nginx/html/index.html
RUN echo "Hi, world" > /usr/share/nginx/html/index.html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]