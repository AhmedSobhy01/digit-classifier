FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

COPY ./requirements.txt /tmp

RUN apt-get update -y

RUN pip install --no-cache-dir --upgrade -r /tmp/requirements.txt

WORKDIR /app

COPY ./server .

EXPOSE 5000

WORKDIR /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]