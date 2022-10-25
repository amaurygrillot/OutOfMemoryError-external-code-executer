#!/bin/bash
ts=$(date +%s%N);
$@;
tt=$(($(date +%s%N) - $ts));
printf 'Temps exécution : %.3f secondes' "$(echo "scale=3; $tt / 1000000" | bc -l)";
