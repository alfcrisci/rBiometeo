#' oxford_index
#'
#' Computes  the oxford index index of discomfort. 
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in percentage.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  oxford_index 
#' @references  Lind AR, Hallon RF,1957, Assessment of physiologic severity of hot climate. J Appl Physiol 11, 35–40.
#' @export
#'
#'
#'
#'

oxford_index=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=oxford_index(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



