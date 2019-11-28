#' mdi_index
#'
#' Modified discomfort index MDI.
#'
#' @param t numeric Air temperature in degC.
#' @param rh numeric Relative humidity in percentage (%).
#' @param wind numeric Windspeed in meters per second.
#' @param pair numeric Air pressure in hPa.
#' @return mdi_index 
#'
#'
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' @keywords  mdi_index 
#' @references Moran DS, Shitzer A, Pandolf KB , 1998, A physiological strain index to evaluate heat stress. Am J Physiol 275, R 129 34.
#'  
#'
#'
#'
#' @export

mdi_index<-function(t,rh,wind=0.2,pair=1010)  {
                          ct$assign("t", as.array(t))
                          ct$assign("rh", as.array(rh))
                          ct$assign("wind", as.array(wind))
                          ct$assign("pair", as.array(pair))
                          ct$eval("var res=[]; for(var i=0, len=t.length; i < len; i++){ res[i]=mdi_index(t[i],rh[i],wind[0],pair[0])};")
                          res=ct$get("res")
                          return(ifelse(res==9999,NA,res))
}



