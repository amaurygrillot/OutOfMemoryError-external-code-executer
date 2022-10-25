#!/bin/bash
ts=$(date +%s%N);
$@;
tt=$(($(date +%s%N) - $ts));
printf "Temps exécution : %.5f secondes" "$(echo "scale=5; $tt / 1000000000" | bc -l)";
