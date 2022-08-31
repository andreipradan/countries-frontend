FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1

COPY requirements.txt /requirements/

RUN apt update && apt-get install -y gcc  # for psutil in django-heartbeat

RUN pip install -U pip
RUN pip install --no-cache-dir -r /requirements/requirements.txt && rm -rf /requirements/

COPY backend /app/
WORKDIR /app
CMD exec gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --chdir=/app
