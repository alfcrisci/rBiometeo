#' projman
#'
#' Calculate the Human Body Projection Area factor in function to sun elevation. 
#'
#' @param numeric sunelev Sun elevation in degrees.
#'
#' @return Projection factor
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#'
#' @keywords  Area projection factor. 
#' @references Jendritzky G (1990) Bioklimatische Bewertungsgrundlage der Raume am Beispiel von. 27 mesoskaligen Bioklimakarten.
#' @export
#'
#'
#'
#'

projman=function(sunelev) {
                         ct$assign("sunelev", as.array(sunelev))
                         ct$eval("var res=[]; for(var i=0, len=sunelev.length; i < len; i++){ res[i]=proj(sunelev[i])};")
                          res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

