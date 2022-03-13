import pandas as pd

df = pd.read_csv('chartmode_data.csv',encoding = 'utf-8')

codelist = df['株式コード'].tolist()
category_orig_list = df['提出者業種'].tolist()
category_new_list = df['業種'].tolist()

code_to_orig = {}
code_to_new = {}
for i in range(len(codelist)):
    code_to_orig[codelist[i]] = category_orig_list[i]
    code_to_new[codelist[i]] = category_new_list[i]

print(code_to_new)