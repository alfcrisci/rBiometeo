# R package rBiometeo 0.21 version

R package for various biometeorological functions.

Install the latest version of this package by entering the following in R:
```R
# install.packages("devtools")
library(devtools)

devtools::install_github("alfcrisci/rBiometeo")


```

On Ubuntu 20.04 see comments concerning linux dependency problem
https://github.com/ropensci/geojsonio/issues/65

and 

```bash
sudo add-apt-repository ppa:cran/v8
sudo apt update
sudo apt install libnode-dev
sudo apt purge libv8-3.14.5
# reinstall V8
R -e 'install.packages("V8")'


```
