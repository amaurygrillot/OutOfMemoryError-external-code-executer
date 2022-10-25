#!/bin/bash
ts=$(date +%s%N);
$@;
tt=$(($(date +%s%N) - $ts));
printf "Temps d'exécution : %.3f secondes" "$(echo "scale=3; $tt / 1000000000" | bc -l)";
