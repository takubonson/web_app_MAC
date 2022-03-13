import pandas as pd
from datetime import datetime


def merge_csv(targets):

    li = []

    for filename in targets:
        df = pd.read_csv(filename, index_col=None, header=0,
                         parse_dates=True, infer_datetime_format=True)
        li.append(df)

    frame = pd.merge(li[0], li[1], on="timeline", how="outer").fillna(0)
    frame["timeline"] = pd.to_datetime(frame["timeline"]).dt.to_period('M')
    # print(frame["timeline"])
    sorted_frame = frame.sort_values(
        by="timeline")
    sorted_frame.to_csv('merged_csv.csv', index=False)


merge_csv(["./Sony.csv", "./Recruit.csv"])
