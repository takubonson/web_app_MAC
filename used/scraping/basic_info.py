import pandas as pd
import time

df = pd.read_excel('corpinfo.xlsx',index_col = 0)

codelist = ['7203.T', '6861.T', '6758.T', '6098.T', '9432.T', '8035.T', '9434.T', '8306.T', '4063.T', '6594.T', '6367.T', '9433.T', '9983.T', '6902.T', '7741.T', '6501.T', '7974.T', '4519.T', '4661.T', '6981.T', '7267.T', '4689.T', '8316.T', '8001.T', '6273.T', '4568.T', '4502.T', '6954.T', '3382.T', '8031.T', '8766.T', '2914.T', '6702.T', '8411.T', '4543.T', '7182.T', '5108.T', '4901.T', '9613.T', '6178.T', '4503.T', '7733.T', '6503.T', '9022.T', '6326.T', '6869.T', '4612.T', '7309.T', '4307.T', '4452.T', '6752.T', '8113.T', '6201.T', '6723.T', '6920.T', '7751.T', '4911.T', '8591.T', '9020.T', '6301.T', '6971.T', '8750.T', '8267.T', '4507.T', '6645.T', '4578.T', '7269.T', '1925.T', '7201.T', '9843.T', '8053.T', '3659.T', '7832.T', '6502.T', '6857.T', '4523.T', '8725.T', '4684.T', '2802.T', '8002.T', '4755.T', '4151.T', '6762.T', '8015.T', '2801.T', '8630.T', '9735.T', '5401.T', '9143.T', '8421.T', '7270.T', '1928.T', '2503.T', '8604.T', '3407.T', '6701.T', '6506.T', '8309.T', '1605.T', '5020.T', '4528.T', '9101.T', '6586.T', '6479.T', '4716.T', '2587.T', '8697.T', '6988.T', '5201.T', '9021.T', '6383.T', '4188.T', '6146.T', '5802.T', '8951.T', '7259.T', '3769.T', '3064.T', '9202.T', '4324.T', '7202.T', '3402.T', '6965.T', '7532.T', '4385.T', '8308.T', '6963.T', '3092.T', '7272.T', '7951.T', '4751.T', '4768.T', '2269.T', '8601.T', '3283.T', '4062.T', '9201.T', '9005.T', '4021.T', '9503.T', '4704.T', '5332.T', '9104.T', '2267.T', '8952.T', '5486.T', '4739.T', '7011.T', '9502.T', '3038.T', '1878.T', '5019.T', '4005.T', '9531.T', '4204.T', '3281.T', '3626.T', '2897.T', '3003.T', '9435.T', '9042.T', '3141.T', '4922.T', '6753.T', '9007.T', '8795.T', '9532.T', '3462.T', '3291.T', '7912.T', '9684.T', '7181.T', '6305.T', '4967.T', '9719.T', '3349.T', '7747.T', '8439.T', '4613.T', '2702.T', '1812.T', '9107.T', '1802.T', '9041.T', '7911.T', '9697.T', '9062.T', '3391.T', '7261.T', '2651.T', '4536.T', '4516.T', '9001.T', '4506.T', '8572.T', '8331.T', '2002.T', '2875.T', '7564.T', '9706.T', '2331.T', '4912.T', '7731.T', '6324.T', '4581.T', '9506.T', '6952.T', '4587.T', '9048.T', '9533.T', '3292.T', '5105.T', '7956.T', '5301.T', '1860.T', '3694.T', '3817.T', '5982.T', '1301.T']
#codelist = ['TM', 'KYCCF', 'SONY', 'RCRRF', 'NPPXF', 'TOELF', 'SFTBF', 'MUFG', 'SHECF', 'NNDNF', 'DKILY', 'KDDIF', 'FRCOF', 'HYB.F', 'DNZOF', 'HTHIF', 'NTDOF', '4519.T', 'OLL.F', 'MRAAF', 'HMC', '4689.T', 'SMFG', 'ITOCF', 'SMECF', 'DSKYF', 'TAK', 'FANUF', 'SVNDF', '8031.T', 'JAPAF', 'MH6.F', 'FJTSY', 'MFG', '4543.T', '7182.T', '5108.T', '4901.T', '9613.T', '6178.T', 'ALPMF', '7733.T', 'MIELF', '9022.T', '6326.T', '6869.T', '4612.T', '7309.T', '4307.T', 'KAO.F', '6752.T', '8113.T', '6201.T', '6723.T', '6920.T', 'CAJ', '4911.T', 'IX', '9020.T', '6301.T', '6971.T', '8750.T', '8267.T', '4507.T', '6645.T', '4578.T', '7269.T', '1925.T', '7201.T', '9843.T', '8053.T', '3659.T', '7832.T', '6502.T', '6857.T', '4523.T', '8725.T', '4684.T', '2802.T', '8002.T', '4755.T', '4151.T', '6762.T', '8015.T', '2801.T', '8630.T', '9735.T', '5401.T', '9143.T', '8421.T', '7270.T', '1928.T', '2503.T', 'NMR', '3407.T', '6701.T', '6506.T', '8309.T', '1605.T', '5020.T', '4528.T', '9101.T', '6586.T', '6479.T', '4716.T', '2587.T', '8697.T', '6988.T', '5201.T', '9021.T', '6383.T', '4188.T', '6146.T', '5802.T', '8951.T', '7259.T', '3769.T', '3064.T', '9202.T', '4324.T', '7202.T', '3402.T', '6965.T', '7532.T', '4385.T', '8308.T', '6963.T', '3092.T', '7272.T', '7951.T', '4751.T', '4768.T', '2269.T', '8601.T', '3283.T', '4062.T', '9201.T', '9005.T', '4021.T', '9503.T', '4704.T', '5332.T', '9104.T', '2267.T', '8952.T', '5486.T', '4739.T', '7011.T', '9502.T', '3038.T', '1878.T', '5019.T', '4005.T', '9531.T', '4204.T', '3281.T', '3626.T', '2897.T', '3003.T', '9435.T', '9042.T', '3141.T', '4922.T', '6753.T', '9007.T', '8795.T', '9532.T', '3462.T', '3291.T', '7912.T', '9684.T', '7181.T', '4967.T', '6305.T', '9719.T', '3349.T', '7747.T', '8439.T', '4613.T', '2702.T', '1812.T', '9107.T', '1802.T', '9041.T', '7911.T', '9697.T', '9062.T', '3391.T', '7261.T', '2651.T', '4536.T', '4516.T', '9001.T', '4506.T', '8572.T', 'CHBAY', '2002.T', '2875.T', '7564.T', '9706.T', '2331.T', '4912.T', 'NINOY', '6324.T', '4581.T', '9506.T', 'CSIOY', '4587.T', '9048.T', '9533.T', '3292.T', '5105.T', '7956.T', '5301.T', '1860.T', '3694.T', '3817.T', '5982.T', '1301.T']

df['株式コード'] = df['証券コード'].apply(lambda x: str(x)[:-3] + ".T")

new_df = df[df['株式コード'].isin(codelist)]
new_df = new_df.reindex(columns = ['株式コード','上場区分','連結の有無','資本金','提出者名','所在地','提出者業種'])
print(new_df.head(10))
new_df = new_df.reset_index()
new_df = new_df.set_index('株式コード')
print(new_df)

import requests
from bs4 import BeautifulSoup
import time
import tqdm


URL = 'http://www.geocoding.jp/api/'


def coordinate(address):
    """
    addressに住所を指定すると緯度経度を返す。

    >>> coordinate('東京都文京区本郷7-3-1')
    ['35.712056', '139.762775']
    """
    payload = {'q': address}
    html = requests.get(URL, params=payload)
    soup = BeautifulSoup(html.content, "html.parser")
    if soup.find('error'):
        print("invalid: " + address)
        latitude = -1
        longitude = -1
        #raise ValueError(f"Invalid address submitted. {address}")
    else:
        latitude = soup.find('lat').string
        longitude = soup.find('lng').string
    return [latitude, longitude]

locations = new_df['所在地'].tolist()
latitudes = []
longitudes = []
time.sleep(5)
failed = []
failed_adress = []
for index,loc in enumerate(locations):
    latitude,longitude = coordinate(loc)
    while latitude == "0":
        time.sleep(5)
        latitude,longitude = coordinate(loc)
    
    if latitude ==-1:
        failed.append(index)
        failed_adress.append(loc)
    # if latitude =="0" or latitude ==-1:
    #     failed.append(index)
    #     failed_adress.append(loc)
    latitudes.append(latitude)
    longitudes.append(longitude)
    print(index,latitude,longitude)
    time.sleep(5)
new_df['緯度'] = latitudes
new_df['経度'] = longitudes
new_df.to_csv('basic_info_new.csv')
print(failed)
print(failed_adress)