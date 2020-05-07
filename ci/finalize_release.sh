#!/bin/bash

set -e

COMMIT=$1
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
VERSION=$("$CURRENT_DIR/get_build_version.sh")
REPO="tarbadev/remote-mower"
GITHUB="https://api.github.com"

function gh_curl() {
  curl -H "Authorization: token $GH_TOKEN" \
    -H "Accept: application/vnd.github.v3.raw" \
    "$@"
}

release_id=$(gh_curl -s $GITHUB/repos/$REPO/releases | jq ". | map(select(.name == \"$VERSION\"))[0].id")

if [ "$release_id" = "null" ]; then
  echo >&2 "ERROR: release not found for version $VERSION"
  exit 1
fi

echo "Publishing Release ID $release_id"

gh_curl --request PATCH \
  -s "$GITHUB/repos/$REPO/releases/$release_id" \
  --data "{\"draft\":false,\"target_commitish\":\"$COMMIT\"}" >/dev/null

CHANGES=$(git status --short)
if [ -n "$CHANGES" ]; then
  git config --global user.email "tarbadev+ci-system@gmail.com"
  git config --global user.name "CI System"
  git add package.json
  git commit -m "Bump version in package.json to $VERSION"
  git push origin head
fi

exit 0
