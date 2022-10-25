#!/bin/bash
ts=$(date +%s%N);
$@;
tt=$(($(date +%s%N) - $ts));
echo "Temps d'exécution : "
echo "scale  = 6; $tt / 1000000000; quit; secondes" | bc -l;
