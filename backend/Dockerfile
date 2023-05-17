FROM python:3.7-slim

EXPOSE 5000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /app/
RUN pip3 install -r /app/requirements.txt
COPY /dmu-datastore/ /app
COPY entrypoint.sh /app
WORKDIR /app

RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]