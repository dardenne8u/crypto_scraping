from .consumer import BaseConsumer
import pandas as pd
import re


class CoinMarketCapConsumer(BaseConsumer):
    def set_from_array(self, array):
        if len(array) < 5:
            raise Exception("Pas assez de valeur")
        try:
            self.name = str(array["Name"])
            self.price = float(array["Price"])
            self.hourly_variance = float(array["1h %"])
            self.daily_variance = float(array["24h %"])
            self.weekly_variance = float(array["7d %"])
        except:
            print("Erreur de convertion")
            print(array)

    
    def clean_datas(self, datas):
        df = pd.DataFrame(datas["dataBody"], columns=datas["dataHeader"])
        df = df.drop(columns=["#", "Last 7 Days"])
        df["Name"] = df["Name"].map(lambda x: x[:-len("Buy")])
        df = df.fillna("")
        df["Price"] = df["Price"].map(lambda x: x.replace("$", ""))
        df["Price"] = df["Price"].map(lambda x: x.replace(",", ""))
        df["1h %"] = df["1h %"].map(lambda x: x.replace("%", ""))
        df["1h %"] = df["1h %"].map(lambda x: x.replace(",", ""))
        df["24h %"] = df["24h %"].map(lambda x: x.replace("%", ""))
        df["24h %"] = df["24h %"].map(lambda x: x.replace(",", ""))
        df["7d %"] = df["7d %"].map(lambda x: x.replace("%", ""))
        df["7d %"] = df["7d %"].map(lambda x: x.replace(",", ""))
        tmp = df["Circulating Supply"].map(lambda x: re.search(r"[A-Z]+", x))
        df["abr"] = tmp.map(lambda x: x.group()[1::] if x is not None else "")
        return df

        