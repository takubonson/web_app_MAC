for i in {10..47}
do
    echo "${i}"
    unzip "../../../Downloads/N03-20210101_${i}_GML.zip" -d "../../../Downloads/."
    mv "../../../Downloads/N03-20210101_${i}_GML/N03-21_${i}_210101.geojson" "./data/."
    mv "./data/N03-21_${i}_210101.geojson" "./data/p${i}.geojson"
    geo2topo -q 1e6 "pref"="data/p${i}.geojson" > "data/p${i}.topojson"
    for comp in 0.25 0.10 0.01 0.001 0.0003
    do
        toposimplify -P ${comp} "data/p${i}.topojson" > "data/p${i}_${comp//"."/}.topojson"
    done
done

for i in {1..9}
do
    echo "${i}"
    unzip "../../../Downloads/N03-20210101_0${i}_GML.zip" -d "../../../Downloads/."
    mv "../../../Downloads/N03-20210101_0${i}_GML/N03-21_0${i}_210101.geojson" "./data/."
    mv "./data/N03-21_0${i}_210101.geojson" "./data/p${i}.geojson"
    geo2topo -q 1e6 "pref"="data/p${i}.geojson" > "data/p${i}.topojson"
    for comp in 0.25 0.10 0.01 0.001 0.0003
    do
        toposimplify -P ${comp} "data/p${i}.topojson" > "data/p${i}_${comp//"."/}.topojson"
    done
done