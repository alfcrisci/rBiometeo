# R package rBiometeo 0.4 version

[![DOI](https://zenodo.org/badge/65311485.svg)](https://zenodo.org/badge/latestdoi/65311485)

R package for various biometeorological functions.

## News in version 0.4

The JavaScript library `inst/js/biometeo.js` has been revised (readable code, bibliography for every
function, bug fixes) and the package is now released under the **GNU GPL (>= 3)**.

New functions:

* `PET_Hoppe()` (original VDI 3787 routine) and `PET_Walther()` (Walther & Goestchel 2018)
* `SET_ASHRAE()` (ASHRAE 55-2023 two-node model)
* `ET_Missenard()`, `CET()`, `perceived_temperature()`
* class functions with Italian/English labels: `net_class()`, `utci_class_text()`, `utci_class7_text()`,
  `windchill_class_text()`, `sharlau_class()`, `humidex_class()`, `heatindex_class()`, `pet_class()`,
  `pmv_class()`, `discomfort_index_class()`, `thi_class()`, `thom_class()`, `thi_kibler_class()`,
  `heat_risk_text()` (each `*_class_text()` has a `lang = "it"`/`"en"` argument)

Changed results: `THI()` (now Thom/Giles discomfort index in degC), `mdi_index()`, `frostime()`,
`mrt_globe()`, `windchill_cla()`, `utci_class()`/`utci_class7()` for out-of-range UTCI,
`sharlau_index_state()`. See `NEWS.md` for details.

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
