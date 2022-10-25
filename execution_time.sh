#!/bin/bash
ts=$(date +%s%N);
$@;
tt=$(($(date +%s%N) - ts));
echo "$tt";
