import pandas as pd
import sys
import datetime
from yahoo_finance_api2 import share
from yahoo_finance_api2.exceptions import YahooFinanceError
import os 
import time

f = open("company_list.txt")

for line in f.readlines():
    time.sleep(20)
    corpo = line.rstrip()
    #corpo = "5108.T" 
    my_share = share.Share(corpo)
    symbol_data = None
    
    try:
        symbol_data = my_share.get_historical(
            share.PERIOD_TYPE_YEAR, 50,
            share.FREQUENCY_TYPE_MONTH, 1)
    except YahooFinanceError as e:
        print(e.message)
        sys.exit(1)
    
    #print(symbol_data)

    df = pd.DataFrame(symbol_data)
    df["datetime"] = pd.to_datetime(df.timestamp, unit="ms")
    df["datetime_JST"] = df["datetime"] + datetime.timedelta(hours=9)
    print(df.head(70))
    df.to_csv("StockData/"+corpo+".csv")