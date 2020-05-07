#!/bin/bash

set -e

CURRENT_VERSION=$(awk -F': ' '/"version"/{print$2}' package.json | tr -d "\"" | tr -d ",")
NEW_VERSION="$CURRENT_VERSION"
LAST_COMMIT_TYPE=$(git log --oneline -1 --pretty=%B | awk -F'[]#[]' '{print $2}')

if [ -n "$LAST_COMMIT_TYPE" ]; then
  SEMVER_RELEASE_LEVEL=""
  if [[ "$LAST_COMMIT_TYPE" == *"finish"* ]]; then
    SEMVER_RELEASE_LEVEL="minor"
  fi
  if [[ "$LAST_COMMIT_TYPE" == *"fix"* ]]; then
    SEMVER_RELEASE_LEVEL="patch"
  fi

  if [ -n "$SEMVER_RELEASE_LEVEL" ]; then
    rm -rf /tmp/semver
    git clone https://github.com/fsaintjacques/semver-tool /tmp/semver &> /dev/null
    NEW_VERSION=$(/tmp/semver/src/semver bump $SEMVER_RELEASE_LEVEL "$CURRENT_VERSION")
  fi
fi

echo "$NEW_VERSION"