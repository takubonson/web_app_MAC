import requests
from bs4 import BeautifulSoup

symbol_list = []
logo_list = []
for i in range(1, 4):
    page = requests.get(
        "https://companiesmarketcap.com/japan/largest-companies-in-japan-by-market-cap/?page=" + str(i))
    soup = BeautifulSoup(page.content, "html.parser")
    symbols = list(map(lambda x: x.text, soup.find_all(class_="company-code")))
    logos = list(map(lambda x: x.attrs["src"], soup.find_all(class_="company-logo")))
    symbol_list += symbols
    logo_list += logos

print(symbol_list)
print(len(symbol_list))
print(logo_list)
print(len(logo_list))

write_option = True
home_path = "https://companiesmarketcap.com/"
if write_option:
    for index,logo_src in enumerate(logo_list):
        re = requests.get(home_path + logo_src)
        f = open("images/logos/"+ symbol_list[index]+".webp", mode="wb")
        f.write(re.content)
        f.close()
