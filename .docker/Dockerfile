FROM python:3.10-alpine

ENV PYTHONUNBUFFERED 1

RUN pip install poetry
RUN poetry install

COPY ./entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY . /app
WORKDIR /app
CMD ["/entrypoint"]
