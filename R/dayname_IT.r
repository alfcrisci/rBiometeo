#' dayname_IT
#'
#' Give the name of day in italian languages.
#'
#' @param date Date in YYYY-MM-DD format.
#' @return 
#'
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords  italian name of day. 
#' 
#' @export
#'
#'
#'
#'

dayname_IT=function (date)  {
                         ct$assign("date", as.array(date))
                         ct$eval("var res=[]; for(var i=0, len=date.length; i < len; i++){ res[i]=DAYNAME_IT(date[i])};")
                         res=ct$get("res")
                         return(ifelse(res=="null",NA,res))
}

