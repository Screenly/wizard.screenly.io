#!/bin/bash

SCRIPTDIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

rsync -aP \
  "${SCRIPTDIR}/../" \
  --exclude 'bin' \
  --exclude '.git' \
  --exclude '.arc*' \
  --delete \
  deployer@us.hosting.wireload.net:/www/wizard.screenly.io/
