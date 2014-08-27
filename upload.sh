#!/bin/sh
set -e
. ./config.sh
# FOLDERS and VAULT should be set now

FILEBASE=`date +"%Y_%m_%d.%H_%M"`
TARBASE="${FILEBASE}.tar.bz2"

for FOLDER in $FOLDERS; do
    PREFIX=`basename "${FOLDER}"`
    TARFILE="${PREFIX}_${TARBASE}"
    # yup, this doesn't work with spaces-in-the-name-files
    FILES=`find ${FOLDER} -type f -mmin +1 -exec echo '{}' \;`
    if [ -n "$FILES" ]; then
	echo Creating ${TARFILE}
	tar -zcf ${TARFILE} ${FILES}
	echo Uploading $TARFILE
	python glacier-cli/glacier.py archive upload ${VAULT} ${TARFILE}
	rm -f ${FILES}
	rm ${TARFILE}
	echo ${FOLDER} done
    else
	echo ${FOLDER} is empty
    fi
done
