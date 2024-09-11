FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

COPY ./requirements.txt /tmp

RUN pip install --no-cache-dir --upgrade -r /tmp/requirements.txt

WORKDIR /app

COPY . .

EXPOSE 5000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]