#!/bin/bash
ts=$(date +%s%N) ; $@ ; tt=$((($(date +%s%N) - $ts)/1000)) ; echo "Temps d'exécution: $tt secondes"
