# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from app.main import app  # Adjust this import based on where your FastAPI app is initialized

@pytest.fixture(scope="module")
def client():
    """
    A pytest fixture that provides a transactional TestClient for sending requests to the FastAPI application.
    """
    # Using a context manager ensures any startup/shutdown events in main.py run
    with TestClient(app) as test_client:
        yield test_client