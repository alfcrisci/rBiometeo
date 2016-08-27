#' twetbulb_s
#'
#' Estimate wet bulb temperature by using STULL's empirical equation.
#'
#' @param numeric t Air temperature in Celsius degrees. Valid for air pressure 1 atm=101.325 hPa [mb] 760 torr or 760 mmHg.
#' @param numeric rh Relative humidity in %.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' 
#' @references Wet-Bulb Temperature from Relative Humidity and Air Temperature Ronald Stull \link{http://journals.ametsoc.org/doi/pdf/10.1175/JAMC-D-11-0143.1}
#' @keywords  wet bulb temperature, stull, 
#' 
#' @export
#'
#'
#'
#'

twetbulb_s=function(t,rh) {return( t*atan(0.151977* sqrt((rh+8.313659)))
                              +atan(t+rh)-atan(rh-1.676331)
                              +0.00391838*(rh**(3/2))*atan(0.023101*rh)-4.686035)}
                              





