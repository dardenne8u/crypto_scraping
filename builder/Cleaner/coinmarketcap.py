from .consumer import BaseConsumer
import pandas as pd


class CoinMarketCapConsumer(BaseConsumer):
    def set_from_array(self, array):
        self.name = str(array[2])
        self.price = float(array[3])
        self.hourly_variance = float(array[4])
        self.daily_variance = float(array[5])
        self.weekly_variance = float(array[6])

    def clean_datas(self, datas):
        pass