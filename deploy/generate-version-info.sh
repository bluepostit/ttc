#!/bin/bash

# Needs to be run in a git repository

VERSION_INFO_FILE_NAME=version-info.yaml

echo "> Generating version info YAML"
VERSION_STRING=`git rev-parse --short HEAD`
DATE_STRING=`date "+%d-%m-%Y @ %R UCT%z"`
echo -e "version: \"${VERSION_STRING}\" \ndate: \"${DATE_STRING}\"" > $VERSION_INFO_FILE_NAME
