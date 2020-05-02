#!/bin/bash

set -e

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
CURRENT_VERSION=$(awk -F': ' '/"version"/{print$2}' package.json | tr -d "\"" | tr -d ",")
NEW_VERSION=$("$CURRENT_DIR/get_build_version.sh")

>&2 echo "Current version: $CURRENT_VERSION"

if [ "$CURRENT_VERSION" != "$NEW_VERSION" ]; then
  echo "Replacing package.json with version $NEW_VERSION"

  STRING_TO_REPLACE="\"version\": \"$CURRENT_VERSION\""
  NEW_STRING="\"version\": \"$NEW_VERSION\""

  sed "s/$STRING_TO_REPLACE/$NEW_STRING/g" package.json > new_package.json

  rm package.json
  mv new_package.json package.json
else
  >&2 echo "Not bumping version, keeping version $CURRENT_VERSION"
  exit 0
fi

exit 0