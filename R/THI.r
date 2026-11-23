#' THI
#'
#' Thom's discomfort index in the Celsius and relative humidity form of Giles et al. (1990): DI = t - 0.55 (1 - 0.01 rh) (t - 14.5).
#' Since version 0.4 the previous formula (0.8 t - 0.55 (0.01 rh)(t - 14.4) + 46.4, a mixture of livestock THI and Thom index
#' that decreased with humidity) has been replaced. For the livestock THI use THI_kibler. Classes: thi_class, thi_class_text.
#'
#' @param t numeric  Air temperature in Celsius degrees.
#' @param rh numeric Relative humidity in percentage.
#' @return Thom discomfort index in degC
#' @references Thom E.C. (1959). The discomfort index. Weatherwise 12(2): 57-61. doi:10.1080/00431672.1959.9926960
#' @references Giles B.D., Balafoutis C., Maheras P. (1990). Too hot for comfort: the heatwaves in Greece in 1987 and 1988. Int. J. Biometeorol. 34: 98-104.
#'
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@cnr.it}
#' @keywords  THI, Temperature Humidity Index 
#' 
#' @export
#'
#'
#'
#'

THI=function(t,rh) {
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=THI(t[i],rh[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



