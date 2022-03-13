import pandas as pd
import glob
import csv
import json


def merge_and_preprocess_csv(data_directory):
    targets = glob.glob(data_directory)
    li = []
    for filename in targets:
        df = pd.read_csv(filename, index_col=None, header=0,
                         parse_dates=True, infer_datetime_format=True)
        li.append(df)
    for m in range(len(li)):
        print(str(m) + "/" + str(len(li)))
        fr = li[m]
        for j in range(len(fr)):
            fr.iloc[j][1] = operate_number(fr.iloc[j][1])
    frame = li[0]
    for i in range(1, len(li)):
        print(str(i) + "/" + str(len(li)))
        frame = pd.merge(frame, li[i], on="timeline", how="outer").fillna("0")
    frame["timeline"] = pd.to_datetime(frame["timeline"]).dt.to_period('M')
    sorted_frame = frame.sort_values(
        by="timeline")

    sorted_frame.to_csv("preprocessed_merged.csv", index=False)

    df = pd.read_csv("preprocessed_merged.csv")
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
    df.to_csv("preprocessed_merged.csv", index=True, header=False)


def csv2json(csvFilePath, jsonFilePat †h):

    # create a dictionary
    data = []
    # print("started")
    df = pd.read_csv(csvFilePath, index_col=None, header=0,
                     parse_dates=True, infer_datetime_format=True)
    for i in range(len(df)):
        print(str(i) + "/" + str(len(df)))
        dict = {}
        value_list = []

        z = list(zip(list(df.columns), list(df.iloc[i])))
        value_list = list(map(lambda x: list(x), z))[1:]

        # for j in range(1, len(df.iloc[i])):
        #     # print("     " + str(j) + "/" + str(len(df.iloc[i])))
        #     date = df.columns[j]
        #     value = df.iloc[i][j]
        #     value_list.append([date, value])

        dict["company_name"] = df.iloc[i][0]
        dict["value"] = value_list
        data.append(dict)
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))


def operate_number(num_string):
    print(num_string)
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


merge_and_preprocess_csv("./data_test/*")
csv2json("preprocessed_merged.csv", "finished.json")
