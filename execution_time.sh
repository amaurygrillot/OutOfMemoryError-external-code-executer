#!/bin/bash
ts=$(date +%s%N) ; $@ ; echo "Temps d'exécution : $(((($(date +%s%N) - $ts)/1000000000))) secondes" | bc -l
scale=10;
