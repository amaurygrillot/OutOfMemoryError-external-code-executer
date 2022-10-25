#!/bin/bash
ts=$(date +%s%N);
$@;
tt=$(($(date +%s%N) - $ts));
printf "Temps exécution : %.15f secondes" "$(echo "scale=15; $tt / 1000000000" | bc -l)";
