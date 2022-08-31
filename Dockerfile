FROM python:3.10-alpine

ENV PYTHONUNBUFFERED 1

COPY requirements.txt /requirements/

RUN pip install -U pip
RUN pip install --no-cache-dir -r /requirements/requirements.txt && rm -rf /requirements/


COPY ./entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY backend /app/
WORKDIR /app
CMD ["/entrypoint"]
