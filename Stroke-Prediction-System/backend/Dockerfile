FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Apply numpy patch during build
RUN python -c "import numpy as np; import sys; setattr(np, '_core', sys.modules['numpy.core']); print('Numpy patch applied during build')"

EXPOSE 7860

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]