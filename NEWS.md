# rBiometeo 0.4.1 (2026-11-23)

* Updated author e-mail addresses to the `@cnr.it` domain (Alfonso Crisci, Marco Morabito) and added
  the e-mail address of Alessandro Messeri.

# rBiometeo 0.4 (2026-11-23)

## Licence

* The package and `inst/js/biometeo.js` are now released under the GNU GPL (>= 3), with the agreement of
  all authors (Alfonso Crisci, Marco Morabito, Alessandro Messeri). Third-party code in `biometeo.js`:
  pnorm/qnorm (S. Dorai-Raj, GPL >= 2), PET_Hoppe (PALM-4U / DWD, GPL >= 3), PET_Walther and SET_ASHRAE
  (pythermalcomfort, MIT).

## New functions

* `PET_Hoppe()`, `PET_Walther()`, `SET_ASHRAE()`, `ET_Missenard()`, `CET()`, `perceived_temperature()`.
* Classes and Italian/English labels: `net_class()`, `net_class_text()`, `utci_class_text()`,
  `utci_class7_text()`, `windchill_class_text()`, `sharlau_class()`, `humidex_class()`,
  `humidex_class_text()`, `heatindex_class()`, `heatindex_class_text()`, `pet_class()`, `pet_class_text()`,
  `pmv_class()`, `pmv_class_text()`, `discomfort_index_class()`, `discomfort_index_class_text()`,
  `thi_class()`, `thi_class_text()`, `thom_class()`, `thom_class_text()`, `thi_kibler_class()`,
  `thi_kibler_class_text()`, `heat_risk_text()`.

## Changed results

* `THI()`: now Thom's discomfort index in the Giles et al. (1990) form, in degC. The previous formula
  decreased with humidity. For cattle use `THI_kibler()`.
* `mdi_index()`: coefficients of Moran et al. (1998), 0.75 Tw + 0.38 Ta.
* `frostime()`: wind in m/s is converted to km/h as required by the equation (shorter frostbite times).
* `mrt_globe()`: convection coefficient as the larger of forced and natural convection (ISO 7726);
  `diam` is in meters (default 0.05, 0.15 for `mrt_thorsson()`).
* `windchill_cla()`: classes on the rounded wind chill, as in the ECCC table.
* `utci_class()`, `utci_class7()`: NA (instead of the hottest class) when UTCI is out of range.
* `sharlau_index_state()`: the "Unpleasant" class is now assigned; new `lang` argument.
* `perceived_temperature`, `spvol`, `rad_direct_tilted`, `heatindex` (RH < 13 percent), `reducewind`,
  `ta_comfort`, `wbdt`, `clomax_7730`/`clomin_7730` defaults: bugs fixed in the JavaScript library.

## Fixed R wrappers (they stopped with an error)

* `HSI_index()`, `PVS()`, `knots2fts()`, `knots2ms()`, `RT()` (now calls `recovery_time`), `dayname_IT()`,
  `radtheoricR()`, `radtodeg()`, `viscosity()`, `wbgt_stull()`, `wetbulb()`, `wetbulb_stull()`,
  `hi_index()` and `twetbulb_j()` (functions restored in `biometeo.js`).

## Removed

* `pierceSET` (JavaScript only): replaced by `SET_ASHRAE()`.
