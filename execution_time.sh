#!/bin/bash
ts=$(date +%s%N);
$@ ;
bc -l;
tt=$((($(date +%s%N) - $ts)/1000000));
echo "Temps d'exécution : $tt secondes";
quit;
