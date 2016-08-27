#' fTmrt
#'
#' Calculate the mean radiant temperature by using Thorrson scheme.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric Tg Globe temperature in Celsius degrees. 
#' @param numeric wind Speed or wind velocity in meter per secons [m/s].
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  fTmrt 
#' @references Different methods for estimating the mean radiant temperature in an outdoor urban setting \link{http://onlinelibrary.wiley.com/doi/10.1002/joc.1537/full}
#' @export
#'
#'
#'
#'

fTmrt=function(t,Tg,wind) {
                         ct$assign("Ta", as.array(t))
                         ct$assign("Tg", as.array(Tg))
                         ct$assign("ws", as.array(wind))
                        
                         ct$eval("var res=[]; for(var i=0, len=Ta.length; i < len; i++){ res[i]=fTmrtB(Ta[i],Tg[i],ws[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

