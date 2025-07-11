#!/bin/sh

PROJECT_ROOT=$(cd "$(dirname "$0")" && pwd)
cd "${PROJECT_ROOT}"

# Installing hooks
cp hooks/* .git/hooks
