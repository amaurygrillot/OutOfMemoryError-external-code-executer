#!/bin/bash
ts=$(date +%s%N) ; $@ ; scale=9; tt=$((($(date +%s%N) - $ts)/1000000000)) | bc ; echo "Temps d'exécution : $tt secondes"
scale=10;
