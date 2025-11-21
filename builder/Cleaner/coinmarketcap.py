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
        df = df.fillna("")
        df["Price"] = df["Price"].map(lambda x: x.replace("$", ""))
        df["Price"] = df["Price"].map(lambda x: x.replace(",", ""))
        df["1h %"] = df["1h %"].map(lambda x: x.replace("%", ""))
        df["1h %"] = df["1h %"].map(lambda x: x.replace(",", ""))
        df[["nombre", "direction"]] = df["1h %"].str.split("|", expand=True)
        df["nombre"] = df["nombre"].astype(float)
        df["1h %"] = df["nombre"] * df["direction"].map({"UP": 1, "DOWN": -1})
        
        df["24h %"] = df["24h %"].map(lambda x: x.replace("%", ""))
        df["24h %"] = df["24h %"].map(lambda x: x.replace(",", ""))
        df[["nombre", "direction"]] = df["24h %"].str.split("|", expand=True)
        df["nombre"] = df["nombre"].astype(float)
        df["24h %"] = df["nombre"] * df["direction"].map({"UP": 1, "DOWN": -1})
        

        df["7d %"] = df["7d %"].map(lambda x: x.replace("%", ""))
        df["7d %"] = df["7d %"].map(lambda x: x.replace(",", ""))
        df[["nombre", "direction"]] = df["7d %"].str.split("|", expand=True)
        df["nombre"] = df["nombre"].astype(float)
        df["7d %"] = df["nombre"] * df["direction"].map({"UP": 1, "DOWN": -1})
        return df

        
