#' wbgt
#'
#' Calculate wet bulb globe temperature index for outdoor environements.
#'
#' @param numeric t Air temperature in Celsius Degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param numeric tg Globe temperature in Celsius Degrees.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  wbgt 
#' 
#' @export
#'
#'
#'
#'

wbgt=function(t,rh,tg) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("tg", as.array(tg))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=wbgt(t[i],rh[i],tg[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

