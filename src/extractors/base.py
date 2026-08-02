from abc import ABC, abstractmethod
from pathlib import Path

from src.models import ExpenseData


class BaseExtractor(ABC):

    @abstractmethod
    def extract(self, image_path: Path) -> ExpenseData:
        """Extract structured expense data from an image."""
        pass