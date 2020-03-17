#!/bin/ksh

LOC="charts/"
MSK="7501-197*"
FILE=$LOC$MSK
#echo $FILE

for F in $FILE
do
  #echo $F
  #gawk -F , 'tolower($5) ~ /\yone|\ytwo|\ythree|\yfour/' $F
  gawk -F , 'tolower($6) ~ /\yone|\ytwo|\ythree|\yfour|\yfive|\ysix|\yseven|\yeight|\ynine\yten/' $F
done
