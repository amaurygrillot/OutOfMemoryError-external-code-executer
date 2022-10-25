#!/bin/bash
ts=$(date +%s%N);
$@ ;
tt=$((($(date +%s%N) - $ts)/1000000)) | bc -l;
echo "Temps d'exécution : $tt secondes";
