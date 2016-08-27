#' viscosity
#'
#' Calculates  the viscosity of air [kg/(m s)] given air temperature in Kelvin degrees.
#'
#' @param numeric Ta Air temperature in Kelvin Degrees.
#' @return viscosity
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  viscosity 
#' @references Oke T R, Boundary Layer Climate,Routledge Atmosphere, Weather and Climate, 2th edition, p.373.
#' @export
#'
#'
#'
#'

viscosity=function(t) {
                         ct$assign("Tair", as.array(t))
                         ct$eval("var res=[]; for(var i=0, len=Tair.length; i < len; i++){ res[i]=viscosity(Tair[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

