FROM python:3.7-slim

EXPOSE 5000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

COPY /dmu-datastore/ /app
WORKDIR /app

RUN pip3 install -r requirements.txt