#' THI_kibler
#'
#' Calculate Temperature Humidity Index following Kliber equantions. Adopted by Sardinia ARPA.
#'
#' @param t numeric  Air temperature in Celsius degrees.
#' @param rh numeric  Relative humidity in percentage.
#' @return thi index
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @references Kibler, H.H. Thermal effects of various temperature-humidity combinations on Holstein cattle as measured by eight physiological responses. Res. Bull. 1964, 862, 1–42. 
#' @export
#'


THI_kibler=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=THI_kibler(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



