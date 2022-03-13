import requests
from bs4 import BeautifulSoup
import csv


symbol_list = []
for i in range(1, 4):
    page = requests.get(
        "https://companiesmarketcap.com/japan/largest-companies-in-japan-by-market-cap/?page=" + str(i))
    soup = BeautifulSoup(page.content, "html.parser")
    symbols = list(map(lambda x: x.text, soup.find_all(class_="company-code")))
    symbol_list += symbols

with open("company_code.csv", "w") as f:
    writer = csv.writer(f)
    for symbol in symbol_list:
        writer.writerow([symbol])
