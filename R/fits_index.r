#' fits_index
#'
#' Calculate Fighter Index of Thermal Stress FITS
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage (%).
#' @param wind numeric Windspeed in meters per second.
#' @param pair numeric Air pressure in hPa.
#' @return 
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  fits_index , Fighter Index of Thermal Stress
#' @references Nunneley SH, Stribley F, 1979, Fighter index of thermal stress FITS  guidance for hot-weather aircraft operations.Aviat Space Environ Med 50, 639 42.
#' @export
#'
#'
#'
#'

fits_index=function(t,rh,wind=0.2,pair=1010) {
                        
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("pair", as.array(pair))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=fits_index(t[i],rh[i],wind[0],pair[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



