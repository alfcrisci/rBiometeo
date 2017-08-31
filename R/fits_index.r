#' fits_index
#'
#' Calculate Fighter Index of Thermal Stress 
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @return 
#'

#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  fits_index , Fighter Index of Thermal Stress
#' @references Nunneley SH, Stribley F,1979, Fighter index of thermal stress FITS: guidance for hot-weather aircraft operations.Aviat Space Environ Med 50, 639–42.
#' @export
#'
#'
#'
#'

fits_index=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=fits_index(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



