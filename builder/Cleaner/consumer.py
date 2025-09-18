from abc import abstractmethod
from dataclasses import dataclass, field
import json
import time

@dataclass
class BaseConsumer:
    name: str = field(init=False)
    price: float = field(init=False)
    hourly_variance: float = field(init=False)
    daily_variance: float = field(init=False)
    weekly_variance: float = field(init=False)


    def set_from_array(self, array):
        if len(array) < 5:
            raise Exception("Pas assez de valeur")
        self.name = str(array[0])
        self.price = float(array[1])
        self.hourly_variance = float(array[2])
        self.daily_variance = float(array[3])
        self.weekly_variance = float(array[4])

    @abstractmethod
    def clean_data(self, array):
        pass

    def dumps(self):
        try:
            objet = {
                "schema": {
                    "type": "struct",
                    "fields": [
                        {"type": "string", "field": "name"},
                        {"type": "float", "field": "price"},
                        {"type": "float", "field": "hourly_variance"},
                        {"type": "float", "field": "daily_variance"},
                        {"type": "float", "field": "weekly_variance"},
                        {"type": "int64", "field": "date"}
                    ],
                    "optional": False,
                    "name": "Crypto"
                },
                "payload": {
                    "name": self.name,
                    "price": self.price,
                    "hourly_variance": self.hourly_variance,
                    "daily_variance": self.daily_variance,
                    "weekly_variance": self.weekly_variance,
                    "date":  int(time.time())
                }
            }
            return json.dumps(objet).encode("UTF-8")
        except:
            return None
        