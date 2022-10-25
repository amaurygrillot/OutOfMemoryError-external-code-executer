#!/bin/bash
ts=$(date +%s%N) ; $@ ; tt=$($(date +%s%N) - $ts) ; echo "Temps d'exécution : "; echo "$tt /1000000000" | bc -l; echo " secondes"

