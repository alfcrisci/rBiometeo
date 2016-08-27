#' hi_index
#'
#' Given air temperature (Celsius), relative humidity (%) give a heat stress index in Celsius degree for primates animals. 
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in %.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  hi_index 
#' @references Hill et al (2004), Indices of environmental temperatures for primates in open habitats. Websource \link(https://community.dur.ac.uk/r.a.hill/Hill%20et%20al%202004.pdf)
#' @export
#'
#'
#'
#'

hi_index=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=hi_index(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



