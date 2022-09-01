FROM python:3.10-alpine

ENV PYTHONUNBUFFERED 1

COPY requirements.txt /requirements/

RUN pip install -U pip
RUN pip install --no-cache-dir -r /requirements/requirements.txt && rm -rf /requirements/

COPY backend /app/backend/
COPY /home/runner/work/country-guesser/country-guesser/.docker/build /app/frontend/build/
WORKDIR /app/backend

CMD exec gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --chdir=/app
