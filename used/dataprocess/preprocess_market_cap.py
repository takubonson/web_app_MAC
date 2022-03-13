#coding: utf-8
import pandas as pd
import glob
import csv
import json
codelist = []
category_orig = {'7203.T': '輸送用機器', '6861.T': '電気機器', '6758.T': '電気機器', '6098.T': 'サービス業', '9432.T': 'IT', '8035.T': '電気機器', '9434.T': 'IT', '8306.T': '銀行業', '4063.T': '化学', '6594.T': '電気機器', '6367.T': '機械', '9433.T': 'IT', '9983.T': '小売業', '6902.T': '輸送用機器', '7741.T': '精密機器', '6501.T': '電気機器', '7974.T': 'その他製品', '4519.T': '医薬品', '4661.T': 'サービス業', '6981.T': '電気機器', '7267.T': '輸送用機器', '4689.T': 'IT', '8316.T': '銀行業', '8001.T': '卸売業', '6273.T': '機械', '4568.T': '医薬品', '4502.T': '医薬品', '6954.T': '電気機器', '3382.T': '小売業', '8031.T': '卸売業', '8766.T': '保険業', '2914.T': '食料品', '6702.T': '電気機器', '8411.T': '銀行業', '4543.T': '精密機器', '7182.T': '銀行業', '5108.T': 'ゴム製品', '4901.T': '化学', '9613.T': 'IT', '6178.T': 'サービス業', '4503.T': '医薬品', '7733.T': '精密機器', '6503.T': '電気機器', '9022.T': '陸運業', '6326.T': '機械', '6869.T': '電気機器', '4612.T': '化学', '7309.T': '輸送用機器', '4307.T': 'IT', '4452.T': '化学', '6752.T': '電気機器', '8113.T': '化学', '6201.T': '輸送用機器', '6723.T': '電気機器', '6920.T': '電気機器', '7751.T': '電気機器', '4911.T': '化学', '8591.T': 'その他金融業', '9020.T': '陸運業', '6301.T': '機械', '6971.T': '電気機器', '8750.T': '保険業', '8267.T': '小売業', '4507.T': '医薬品', '6645.T': '電気機器', '4578.T': '医薬品', '7269.T': '輸送用機器', '1925.T': '建設業', '7201.T': '輸送用機器', '9843.T': '小売業', '8053.T': '卸売業', '3659.T': 'IT', '7832.T': 'その他製品', '6502.T': '電気機器', '6857.T': '電気機器', '4523.T': '医薬品', '8725.T': '保険業', '4684.T': 'IT', '2802.T': '食料品', '8002.T': '卸売業', '4755.T': 'サービス業', '4151.T': '医薬品', '6762.T': '電気機器', '8015.T': '卸売業', '2801.T': '食料品', '8630.T': '保険業', '9735.T': 'サービス業', '5401.T': '金属', '9143.T': '陸運業', '8421.T': 'その他金融業', '7270.T': '輸送用機器', '1928.T': '建設業', '2503.T': '食料品', '8604.T': '証券、商品先物取引業', '3407.T': '化学', '6701.T': '電気機器', '6506.T': '電気機器', '8309.T': '銀行業', '1605.T': '金属', '5020.T': '石油・石炭製品', '4528.T': '医薬品', '9101.T': '海運業', '6586.T': '機械', '6479.T': '電気機器', '4716.T': 'IT', '2587.T': '食料品', '8697.T': 'その他金融業', '6988.T': '化学', '5201.T': 'ガラス・土石製品', '9021.T': '陸運業', '6383.T': '機械', '4188.T': '化学', '6146.T': '機械', '5802.T': '金属', '8951.T': '不動産業', '7259.T': '輸送用機器', '3769.T': 'IT', '3064.T': '小売業', '9202.T': '空運業', '4324.T': 'サービス業', '7202.T': '輸送用機器', '3402.T': 'その他製品', '6965.T': '電気機器', '7532.T': '小売業', '4385.T': 'IT', '8308.T': '銀行業', '6963.T': '電気機器', '3092.T': '小売業', '7272.T': '輸送用機器', '7951.T': 'その他製品', '4751.T': 'サービス業', '4768.T': 'IT', '2269.T': '食料品', '8601.T': '証券、商品先物取引業', '3283.T': 'その他金融業', '4062.T': '電気機器', '9201.T': '空運業', '9005.T': '陸運業', '4021.T': '化学', '9503.T': '電気・ガス業', '4704.T': 'IT', '5332.T': 'ガラス・土石製品', '9104.T': '海運業', '2267.T': '食料品', '8952.T': '不動産業', '5486.T': '金属', '4739.T': 'IT', '7011.T': '機械', '9502.T': '電気・ガス業', '3038.T': '卸売業', '1878.T': '建設業', '5019.T': '石油・石炭製品', '4005.T': '化学', '9531.T': '電気・ガス業', '4204.T': '化学', '3281.T': 'その他金融業', '3626.T': 'IT', '2897.T': '食料品', '3003.T': '不動産業', '9435.T': 'IT', '9042.T': '陸運業', '3141.T': '小売業', '4922.T': '化学', '6753.T': '電気機器', '9007.T': '陸運業', '8795.T': '保険業', '9532.T': '電気・ガス業', '3462.T': 'その他金融業', '3291.T': '不動産業', '7912.T': 'その他製品', '9684.T': 'IT', '7181.T': '保険業', '6305.T': '機械', '4967.T': '化学', '9719.T': 'IT', '3349.T': '小売業', '7747.T': '精密機器', '8439.T': 'その他金融業', '4613.T': '化学', '2702.T': '小売業', '1812.T': '建設業', '9107.T': '海運業', '1802.T': '建設業', '9041.T': '陸運業', '7911.T': 'その他製品', '9697.T': 'IT', '9062.T': '陸運業', '3391.T': '小売業', '7261.T': '輸送用機器', '2651.T': '小売業', '4536.T': '医薬品', '4516.T': '医薬品', '9001.T': '陸運業', '4506.T': '医薬品', '8572.T': 'その他金融業', '8331.T': '銀行業', '2002.T': '食料品', '2875.T': '食料品', '7564.T': '小売業', '9706.T': '不動産業', '2331.T': 'サービス業', '4912.T': '化学', '7731.T': '精密機器', '6324.T': '機械', '4581.T': '医薬品', '9506.T': '電気・ガス業', '6952.T': '電気機器', '4587.T': '医薬品', '9048.T': '陸運業', '9533.T': '電気・ガス業', '3292.T': 'その他金融業', '5105.T': 'ゴム製品', '7956.T': 'その他製品', '5301.T': 'ガラス・土石製品', '1860.T': '建設業', '3694.T': 'IT', '3817.T': 'IT', '5982.T': '金属', '1301.T': '水産・農林業'}
category_new = {'7203.T': '機械系', '6861.T': '機械系', '6758.T': '機械系', '6098.T': 'サービス業', '9432.T': 'IT', '8035.T': '機械系', '9434.T': 'IT', '8306.T': '金融・保険', '4063.T': '化学・石油・石炭', '6594.T': '機械系', '6367.T': '機械系', '9433.T': 'IT', '9983.T': '卸売・小売・食料', '6902.T': '機械系', '7741.T': '機械系', '6501.T': '機械系', '7974.T': 'その他', '4519.T': '医薬品', '4661.T': 'サービス業', '6981.T': '機械系', '7267.T': '機械系', '4689.T': 'IT', '8316.T': '金融・保険', '8001.T': '卸売・小売・食料', '6273.T': '機械系', '4568.T': '医薬品', '4502.T': '医薬品', '6954.T': '機械系', '3382.T': '卸売・小売・食料', '8031.T': '卸売・小売・食料', '8766.T': '金融・保険', '2914.T': '卸売・小売・食料', '6702.T': '機械系', '8411.T': '金融・保険', '4543.T': '機械系', '7182.T': '金融・保険', '5108.T': 'その他', '4901.T': '化学・石油・石炭', '9613.T': 'IT', '6178.T': 'サービス業', '4503.T': '医薬品', '7733.T': '機械系', '6503.T': '機械系', '9022.T': '運輸', '6326.T': '機械系', '6869.T': '機械系', '4612.T': '化学・石油・石炭', '7309.T': '機械系', '4307.T': 'IT', '4452.T': '化学・石油・石炭', '6752.T': '機械系', '8113.T': '化学・石油・石炭', '6201.T': '機械系', '6723.T': '機械系', '6920.T': '機械系', '7751.T': '機械系', '4911.T': '化学・石油・石炭', '8591.T': '金融・保険', '9020.T': '運輸', '6301.T': '機械系', '6971.T': '機械系', '8750.T': '金融・保険', '8267.T': '卸売・小売・食料', '4507.T': '医薬品', '6645.T': '機械系', '4578.T': '医薬品', '7269.T': '機械系', '1925.T': '建設・不動産', '7201.T': '機械系', '9843.T': '卸売・小売・食料', '8053.T': '卸売・小売・食料', '3659.T': 'IT', '7832.T': 'その他', '6502.T': '機械系', '6857.T': '機械系', '4523.T': '医薬品', '8725.T': '金融・保険', '4684.T': 'IT', '2802.T': '卸売・小売・食料', '8002.T': '卸売・小売・食料', '4755.T': 'サービス業', '4151.T': '医薬品', '6762.T': '機械系', '8015.T': '卸売・小売・食料', '2801.T': '卸売・小売・食料', '8630.T': '金融・保険', '9735.T': 'サービス業', '5401.T': 'その他', '9143.T': '運輸', '8421.T': '金融・保険', '7270.T': '機械系', '1928.T': '建設・不動産', '2503.T': '卸売・小売・食料', '8604.T': '金融・保険', '3407.T': '化学・石油・石炭', '6701.T': '機械系', '6506.T': '機械系', '8309.T': '金融・保険', '1605.T': 'その他', '5020.T': '化学・石油・石炭', '4528.T': '医薬品', '9101.T': '運輸', '6586.T': '機械系', '6479.T': '機械系', '4716.T': 'IT', '2587.T': '卸売・小売・食料', '8697.T': '金融・保険', '6988.T': '化学・石油・石炭', '5201.T': 'その他', '9021.T': '運輸', '6383.T': '機械系', '4188.T': '化学・石油・石炭', '6146.T': '機械系', '5802.T': 'その他', '8951.T': '建設・不動産', '7259.T': '機械系', '3769.T': 'IT', '3064.T': '卸売・小売・食料', '9202.T': '運輸', '4324.T': 'サービス業', '7202.T': '機械系', '3402.T': 'その他', '6965.T': '機械系', '7532.T': '卸売・小売・食料', '4385.T': 'IT', '8308.T': '金融・保険', '6963.T': '機械系', '3092.T': '卸売・小売・食料', '7272.T': '機械系', '7951.T': 'その他', '4751.T': 'サービス業', '4768.T': 'IT', '2269.T': '卸売・小売・食料', '8601.T': '金融・保険', '3283.T': '金融・保険', '4062.T': '機械系', '9201.T': '運輸', '9005.T': '運輸', '4021.T': '化学・石油・石炭', '9503.T': 'その他', '4704.T': 'IT', '5332.T': 'その他', '9104.T': '運輸', '2267.T': '卸売・小売・食料', '8952.T': '建設・不動産', '5486.T': 'その他', '4739.T': 'IT', '7011.T': '機械系', '9502.T': 'その他', '3038.T': '卸売・小売・食料', '1878.T': '建設・不動産', '5019.T': '化学・石油・石炭', '4005.T': '化学・石油・石炭', '9531.T': 'その他', '4204.T': '化学・石油・石炭', '3281.T': '金融・保険', '3626.T': 'IT', '2897.T': '卸売・小売・食料', '3003.T': '建設・不動産', '9435.T': 'IT', '9042.T': '運輸', '3141.T': '卸売・小売・食料', '4922.T': '化学・石油・石炭', '6753.T': '機械系', '9007.T': '運輸', '8795.T': '金融・保険', '9532.T': 'その他', '3462.T': '金融・保険', '3291.T': '建設・不動産', '7912.T': 'その他', '9684.T': 'IT', '7181.T': '金融・保険', '6305.T': '機械系', '4967.T': '化学・石油・石炭', '9719.T': 'IT', '3349.T': '卸売・小売・食料', '7747.T': '機械系', '8439.T': '金融・保険', '4613.T': '化学・石油・石炭', '2702.T': '卸売・小売・食料', '1812.T': '建設・不動産', '9107.T': '運輸', '1802.T': '建設・不動産', '9041.T': '運輸', '7911.T': 'その他', '9697.T': 'IT', '9062.T': '運輸', '3391.T': '卸売・小売・食料', '7261.T': '機械系', '2651.T': '卸売・小売・食料', '4536.T': '医薬品', '4516.T': '医薬品', '9001.T': '運輸', '4506.T': '医薬品', '8572.T': '金融・保険', '8331.T': '金融・保険', '2002.T': '卸売・小売・食料', '2875.T': '卸売・小売・食料', '7564.T': '卸売・小売・食料', '9706.T': '建設・不動産', '2331.T': 'サービス業', '4912.T': '化学・石油・石炭', '7731.T': '機械系', '6324.T': '機械系', '4581.T': '医薬品', '9506.T': 'その他', '6952.T': '機械系', '4587.T': '医薬品', '9048.T': '運輸', '9533.T': 'その他', '3292.T': '金融・保険', '5105.T': 'その他', '7956.T': 'その他', '5301.T': 'その他', '1860.T': '建設・不動産', '3694.T': 'IT', '3817.T': 'IT', '5982.T': 'その他', '1301.T': 'その他'}

def merge_and_preprocess_csv(data_directory):
    targets = glob.glob(data_directory)
    li = []
    for filename in targets:
        codelist.append(filename.split("/")[2][:-4])
        df = pd.read_csv(filename, index_col=None, header=0,
                         parse_dates=True, infer_datetime_format=True,encoding='utf-8')
        li.append(df)
    # for m in range(len(li)):
    #     print(str(m) + "/" + str(len(li)))
    #     fr = li[m]
    #     for j in range(len(fr)):
    #         fr.iloc[j][1] = operate_number(fr.iloc[j][1])
    frame = li[0]
    for i in range(1, len(li)):
        print(str(i) + "/" + str(len(li)))
        frame = pd.merge(frame, li[i], on="timeline", how="outer").fillna("0")
    frame["timeline"] = pd.to_datetime(frame["timeline"]).dt.to_period('M')
    sorted_frame = frame.sort_values(
        by="timeline")

    sorted_frame.to_csv("preprocessed_merged.csv", index=False,encoding='utf-8')

    df = pd.read_csv("preprocessed_merged.csv",encoding='utf-8')
    columns = df.columns.values[1:]
    finished = 0
    total = len(columns)
    for column in columns:
        print(str(finished) + "/" + str(total))
        finished += 1
        previous = "0"
        for i in range(len(df[column])):
            if (df[column][i] == "0"):
                df[column][i] = previous
            previous = df[column][i]

    df = df.rename(columns={"timeline": "company_name"}).T
    df.to_csv("preprocessed_merged.csv", index=True, header=False,encoding='utf-8')
    print(df)
    #print(codelist)


def csv2json(csvFilePath, jsonFilePath):

    # create a dictionary
    data = []
    # print("started")
    df = pd.read_csv(csvFilePath, index_col=None, header=0,
                     parse_dates=True, infer_datetime_format=True,encoding='utf-8')
    for i in range(len(df)):
        print(str(i) + "/" + str(len(df)))
        dict = {}
        value_list = []

        # z = list(zip(list(df.columns), list(df.iloc[i])))
        # value_list = list(map(lambda x: list(x), z))[1:]

        for j in range(1, len(df.iloc[i])):
            # print("     " + str(j) + "/" + str(len(df.iloc[i])))
            date = df.columns[j]
            value = df.iloc[i][j]
            value = operate_number(value)
            value_list.append([date, value])

        dict["company_name"] = df.iloc[i][0]
        dict["company_code"] = codelist[i]
        dict["category_original"] = category_orig[codelist[i]]
        dict["category_new"] = category_new[codelist[i]]
        dict["value"] = value_list
        data.append(dict)
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4,ensure_ascii=False))


def operate_number(num_string):
    #print(num_string)
    if (num_string == "0"):
        return num_string

    output = ""
    i = 1
    while num_string[i] != "B":
        if num_string[i] == "M":
            output = float(output)
            output /= 1000
            output = str(output)
            return output
        output += num_string[i]
        i += 1
        if (i == 10):
            break
    return output


merge_and_preprocess_csv("../../../marketcap_processed")
csv2json("preprocessed_merged.csv", "finished.json")