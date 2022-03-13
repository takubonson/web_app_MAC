import csv
from os import write

f_txt = open("./japanese_company_list.txt", "r")
f_csv = open("./japanese_company_list.csv", "w")
codes = list(map(lambda s: str.rstrip(s), f_txt.readlines()))
writer = csv.writer(f_csv)
for code in codes:
    writer.writerow([code])
