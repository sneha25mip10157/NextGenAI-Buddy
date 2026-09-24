FROM python:3.14-slim

WORKDIR /app
COPY . /app

RUN chmod +x /app/server.py && \
    python3 build_standalone.py && \
    python3 test_server.py && \
    python3 test_api_inprocess.py

EXPOSE 8000
ENV PORT=8000
ENV HOST=0.0.0.0

CMD ["python3", "server.py"]
