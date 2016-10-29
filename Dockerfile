FROM node:6

ENV AWESOME 1

# Global install yarn package manager
RUN apt-key adv --keyserver pgp.mit.edu --recv D101F7899D41F3C3
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn && apt-get clean

RUN mkdir /code
WORKDIR /code
# Add everything except what’s in .dockerignore
ADD ./ ./

RUN yarn install
RUN ls -la ./
RUN echo "Node.js version $(node -v)"
RUN echo "NPM version $(npm -v)"
