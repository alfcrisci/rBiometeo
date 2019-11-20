#' viscosity
#'
#' Calculates  the viscosity of air [kg/(m s)] given air temperature in Kelvin degrees.
#'
#' @param numeric tk Air temperature in degK.
#' @return viscosity
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  viscosity 
#' @references Oke T R, Boundary Layer Climate,Routledge Atmosphere, Weather and Climate, 2th edition, p.373.
#' @export
#'
#'
#'
#'

viscosity=function(t) {
                         ct$assign("t", as.array(tk))
                         ct$eval("var res=[]; for(var i=0, len=Tair.length; i < len; i++){ res[i]=viscosity(t[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

