Run these from the scripts directory

-- getCharts4.js --
This will download the charts from https://www.officialcharts.com/ for the number of weeks staring at the date specified
e.g. to download 100 charts staring 1st June 1990
$ getCharts4 1990-06-01 100

-- chartRollup.js --
Concat all the charts files downloaded by getCharts4 into a single file then roll up into files containing a 
single record for each unique title/artist

-- matchFinder.js --
This will search the rolled up files and match whole words in the title or artist.
e.g. to find matches for a grouping called birds in the charts for the year 1990
$ node test-code/matchFinder 100 "*1990*" birds
A list of matching entries will be put under ./matches/birds

-- getYTid.js --
Read the matched file and insert the yutube id for each title/artist

-- genClipData.js --
Read the .match files to generate the json q & a which will be used by the skill
Also create the clipIDs.json and upload to s3 bucket

-- clipper.js --
read matches.json to generate the clips and put them under /mnt/s3bucket 
================================================================================


mp3convert.js

regexes.js

clipinfo.csv

This is how the users dynamodb record will Look
clipIndexes = {
    numbers: indexOfNextClipToPlay,
    colors: indexOfNextClipToPlay,
    countries: indexOfNextClipToPlay,
}

sorting to get unique artist & title
awk -F "\"*,\"*" '{print $5 "^" $6 "~" $0}' matches/states/CALIFORNIA.match | sort --field-separator='~' -k1,1 -u

show highest position for each unique artist & title 
#awk -F "\"*,\"*" '{print $5 "^" $6 "~" $3 "~" substr($2,6,8)}' matches/states/CALIFORNIA.match | sort --field-separator='~' -k1,1 -k2,2n | sort --field-separator='~' -k1,1 -u
awk -F "\"*,\"*" '{print $5 "^" $6 "~" substr($2,6,8) "~" $3}' matches/numbers/SEVEN.match | sort --field-separator='~' -k1,1 -k3,3n | sort --field-separator='~' -k1,1 -u

show weeks on chart for each unique artist & title
#awk -F "\"*,\"*" '{print $5 "^" $6 "~" $NF}' matches/states/CALIFORNIA.match | sort --field-separator='~' -k1,1 -k2,2nr| sort --field-separator='~' -k1,1 -u
awk -F "\"*,\"*" '{print $5 "^" $6 "~" substr($2,6,8) "~" $9}' matches/numbers/SEVEN.match | sort --field-separator='~' -k1,1 -k3,3nr| sort --field-separator='~' -k1,1 -u | sed 's/\"//'

merge higest position and weeks on chart on same line
awk -F "\"*,\"*" '{print $5 "^" $6 "~" substr($2,6,8) "~" $3 "~"}' matches/numbers/SEVEN.match | sort --field-separator='~' -k1,1 -k3,3n | sort --field-separator='~' -k1,1 -u > /tmp/1
awk -F "\"*,\"*" '{print $5 "^" $6 "~" substr($2,6,8) "~" $9 "~"}' matches/numbers/SEVEN.match | sort --field-separator='~' -k1,1 -k3,3nr| sort --field-separator='~' -k1,1 -u | sed 's/\"//' > /tmp/2
paste /tmp/1 /tmp/2 | tr '^' '~' | awk -F~ '{print "\"" $1 "\",\"" $2 "\",\"" $4 "\",\"" $8 $NF}'


new method. Only need this single command to show highest position and weeks on chart in last 2 columns..
cat matches/numbers/EIGHT.match | awk -F "\"*,\"*" '{print $3 "," substr($9, 1, length($9)-2) "," $0}' | sort --field-separator=',' -k7,8 -k2,2nr | sort --field-separator=',' -k7,8 -u
// here is the escaped command for use by execSync in nodejs
cat matches/numbers/EIGHT.match | ' +
    'awk -F "\\"*,\\"*" \'{print $3 "," substr($9, 1, length($9)-2) "," $0}\' | ' +
    'sort --field-separator="," -k7,8 -k2,2nr | sort --field-separator="," -k7,8 -u | ' +
    'awk -v RS=\'\r\n\' -F "\\"*,\\"*" \'{print "\\"" $4 "\\",\\"" $7 "\\",\\"" $8 "\\",\\"" $9 "\\",\\"" $10 "\\",\\"" $11}\' | tee /tmp/8.csv' ;

// here is the command line version
cat matches/numbers/EIGHT.match | awk -F "\"*,\"*" '{print $3 "," substr($9, 1, length($9)-2) "," $0}' | sort --field-separator=',' -k7,8 -k2,2nr | sort --field-separator=',' -k7,8 -u | awk -F "\"*,\"*" '{print "\"" $4 "\",\"" $7 "\",\"" $8 "\",\"" $9 "\",\"" $10 "\",\"" $11 "\""}'

cat matches/numbers/EIGHT.match | 'awk -F "\\"*,\\"*" \'{print $3 "," substr($9, 1, length($9)-2) "," $0}\' | 'sort --field-separator="," -k7,8 -k2,2nr | sort --field-separator="," -k7,8 -u | 'awk -v RS=\'\r\n\' -F "\\"*,\\"*" \'{print "\\"" $4 "\\",\\"" $7 "\\",\\"" $8 "\\",\\"" $9 "\\",\\"" $10 "\\",\\"" $11}\'

=====================================================================================================================================
scenario 1 - more than one category matched in title AND artist e.g. 'MAMA TOLD ME NOT TO COME' by 'THREE DOG NIGHT' (mama,three,dog)
category	source	answer
relatives	title	mama
numbers		artist	three
animals		artist	dog


scenario 2 - more than one category matched in title OR artist e.g. 'YOUR SONG' by 'THREE DOG NIGHT' (three,dog)
category	source	answer
numbers		artist	three
animals		artist	dog


scenario 3 - matched word found in both title and artist (same category) e.g. 'GREEN MAN' by 'BLUE' (green,blue)
category	source	answer
colors		title	green
colors		artist	blue
	

possible solution:
Create a lookup file containg youtube id's for ALL grouped/sorted records in matches
getClipData can then use the title/artist to get the correct yutube id
create individual json files for each clip with the relevant qanda objects
at the end accumulate all the individual json clip files into one

=============================================================================
Group qa splits
awk -F: '{if(a[$1])a[$1]=a[$1]":"$2; else a[$1]=$2;}END{for (i in a)print i, a[i];}' OFS=, /tmp/t.txt

s3fs hs-music-links /mnt/s3bucket -o allow_other -o passwd_file=~/.passwd-s3fs
