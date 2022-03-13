import requests
from bs4 import BeautifulSoup
import re

import pandas as pd
import time
import csv

# データを書き込むかどうか
change_flg = True

# rootpage of openwork
root_url = "https://profile.yahoo.co.jp/fundamental/"

# csvから会社名のリストを作成
with open("./company_code_list/japanese_company_list.txt") as f:
    company_list = f.readlines()
print(company_list[0])

with open("yahoofinance_data.csv", "w") as f:
    # 抽出するデータのカテゴリー
    category = ["会社名", "設立年月日", "上場年月日", "従業員数(単独)","従業員数(連結)", "平均年齢", "平均年収"]
    
    writer = csv.writer(f)
    if change_flg:
        writer.writerow(category)
    
    # count 
    count = 0
    for i in range(count,len(company_list)):
        company_num = company_list[i].replace(".T", "").replace("\n","")
        
        load_url = root_url + company_num
        
        # >>> beautifulsoupを使って抽出 >>>
        dummy_user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93'
        html = requests.get(load_url, headers={"User-Agent":dummy_user_agent})
        soup = BeautifulSoup(html.content, "html.parser")
        
        company_name = soup.find("strong").text
        print(company_name)
        
        if company_name == "企業情報ページが見つかりません":
            writer.writerow([company_num,"","","","","",""])
            continue
        
        company_info = soup.find_all("table")[-2]
        
        
        # theadの解析
        r = []  # 保存先の行
        trs = company_info.find_all('tr')  # trタグ
        
        for tr in trs:
            tds = tr.find_all("td")
            for i in range(len(tds)//2):
                r.append([ tds[2*i].text, tds[2*i+1].text ])
        
        row_csv = ["" for _ in range(len(category))]
        
        row_csv[0] = company_name
        row_csv[1] = r[-9][1]
        row_csv[2] = r[-7][1]
        row_csv[3] = r[-4][1]
        row_csv[4] = r[-3][1]
        row_csv[5] = r[-2][1]
        row_csv[6] = r[-1][1]
            
        if change_flg:
            writer.writerow(row_csv)
        count += 1
        print(str(count) + " companies were finished.")