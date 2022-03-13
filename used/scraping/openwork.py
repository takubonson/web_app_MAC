import requests
from bs4 import BeautifulSoup
import re

load_url = "https://www.vorkers.com/company.php?m_id=a0910000000FrTr"
dummy_user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93'
html = requests.get(load_url, headers={"User-Agent":dummy_user_agent})
soup = BeautifulSoup(html.content, "html.parser")

# 抽出するデータのカテゴリー
category = ["残業時間", "有休消化率", "待遇面の満足度", "社員の士気", "風通しの良さ", "社員の相互尊重", "20代成長環境", "人材の長期育成", "法令遵守意識", "人事評価の適正感"]

# 会社名を抽出
name = soup.find(id="mainTitle").find("a").text
print("name is ", name)

data = []
for element in soup.find(class_="averageScore").find_all("dl"):
    num = re.findall(r"\d+\.\d+", element.text)
    data.append(num[0])
    print(element.text,num)