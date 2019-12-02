#' dayname_IT
#'
#' Give the name of day in italian languages.
#'
#' @param date Date in YYYY-MM-DD format.
#' @return italian name of day.
#'
#'
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @export
#' 
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

