#!/bin/bash
ts=$(date +%s%N);
$@ ;
tt=$($(date +%s%N) - $ts);
 echo 'scale  = 15; $tt / 1000000 ' | bc -l;
