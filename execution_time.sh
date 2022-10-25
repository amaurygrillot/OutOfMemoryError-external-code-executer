#!/bin/bash
ts=$(date +%s%N);
$@;
tt=$(($(date +%s%N) - $ts));
echo "Temps d'exécution : "
echo "scale  = 6; $tt / 1000000 millisecondes" | bc -l;
