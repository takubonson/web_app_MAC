import requests
from bs4 import BeautifulSoup
import re

from selenium import webdriver
import pandas as pd
import time
import csv

# データを書き込むかどうか
change_flg = False

# rootpage of openwork
root_url = "https://www.vorkers.com/"

# starting chrome driver
driver = webdriver.Chrome("./chromedriver")

# csvから会社名のリストを作成
basic_info = pd.read_csv("./basic_info.csv")
print(basic_info.head())
print(basic_info["提出者名"].values)
company_list = basic_info["提出者名"].values

with open("companyreview.csv", "a") as f:
    # 抽出するデータのカテゴリー
    writer = csv.writer(f)
    category = ["企業名", "残業時間", "有休消化率", "待遇面の満足度", "社員の士気", "風通しの良さ", "社員の相互尊重", "20代成長環境", "人材の長期育成", "法令遵守意識", "人事評価の適正感"]
    # writer.writerow(category)
    
    # count 
    count = 169
    for i in range(count,len(company_list)):
        # >>> seleniumで会社名からその会社のページへ >>>
        driver.get(root_url)
        
        search_bar = driver.find_element_by_name("src_str")
        time.sleep(4)
        search_bar.send_keys(company_list[i])
        search_bar.submit()
        time.sleep(10)
        try:
            load_url = driver.find_element_by_xpath('//*[@id="contentsBody"]/section/ul/li[1]/div[1]/div[1]/h3/a').get_attribute('href')
        except:
            data = ["None" for i in range(len(category))]
            continue
        # <<< selenium <<<

        # >>> beautifulsoupを使って抽出 >>>
        dummy_user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93'
        html = requests.get(load_url, headers={"User-Agent":dummy_user_agent})
        soup = BeautifulSoup(html.content, "html.parser")


        # 会社名を抽出
        name = soup.find(id="mainTitle").find("a").text
        print("name is ", name)

        data = [name]
        for element in soup.find(class_="averageScore").find_all("dl"):
            print(element.text)
            num = re.findall(r"\d+\.\d+", element.text)
            if len(num) == 0:
                num.append("None")
            data.append(num[0])
        print(data)
        
        if change_flg:
            writer.writerow(data)
        count += 1
        print(str(count) + " companies were finished.")

        time.sleep(10)
