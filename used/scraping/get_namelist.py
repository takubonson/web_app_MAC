import requests
from bs4 import BeautifulSoup

symbol_list = []
for i in range(1, 4):
    page = requests.get(
        "https://companiesmarketcap.com/japan/largest-companies-in-japan-by-market-cap/?page=" + str(i))
    soup = BeautifulSoup(page.content, "html.parser")
    symbols = list(map(lambda x: x.text, soup.find_all(class_="company-name")))
    symbols = list(map(lambda x:x.rstrip(),symbols))
    symbol_list += symbols

print(symbol_list)
print(len(symbol_list))

write_option = False
if write_option:
    f = open("company_namelist.txt",mode= "w")
    for symbol_string in symbol_list:
        f.write(symbol_string + '\n')
    f.close()
#i have to fix error for write_option