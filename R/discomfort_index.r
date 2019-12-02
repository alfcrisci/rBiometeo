#' discomfort_index
#'
#' Given t air temperature (degC), rh relative humidity , wind speed in meters per second and air pressure ( hPa) gives  Discomfort index (DI).
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage.
#' @param wind numeric Windspeed in meters per second.
#' @param pair numeric Air pressure in hPa.
#' @return discomfort_index
#' @author    Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' @references Thom, E.C., 1959, The discomfort index. Weatherwise, 12, 57 60.
#' @export
#'
#'
#'
#'

discomfort_index=function(t,rh,wind=0.2,pair=1010){
                         ct$assign("t", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("wind", as.array(wind))
                         ct$assign("pair", as.array(pair))
                         ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=discomfort_index(t[i],rh[i],wind[0],pair[0])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}



