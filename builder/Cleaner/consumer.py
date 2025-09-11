from abc import abstractmethod
from dataclasses import dataclass, field

@dataclass
class BaseConsumer:
    name: str = field(init=False)
    price: float = field(init=False)
    hourly_variance: float = field(init=False)
    daily_variance: float = field(init=False)
    weekly_variance: float = field(init=False)

    @abstractmethod
    def set_from_array(self, array):
        pass

    @abstractmethod
    def clean_data(self, array):
        pass