#' pierceSET
#'
#' Calculates standard effective temperature of Pierce. The calculation procedure is taken from CBE Thermal Comfort Tool js library. 
#' The Original paper of idex Gagge, A.P., Fobelets, A.P., Berglund, L. G., “A Standard Predictive Index of Human Response to the Thermal Environment”, ASHRAE Trans., Vol.92, Pt 2, 1986.
#'
#' @param numeric t Air temperature in Celsius degrees.
#' @param numeric rh Air Relative humidity in %.
#' @param numeric wind Windspeed in meter per second.
#' @param numeric tr Mean radiant temperature in Celsius degrees.
#' @param numeric M metabolic rate in W/mq.
#' @param numeric W Workload in W/mq.Default is 0.
#' @param numeric clo Clothing level in clo value.
#' @param numeric patm Air pressure in hPa.
#' @return pierce SET in celsius degree.
#' @references Hoyt Tyler, Schiavon Stefano, Piccioli Alberto, Moon Dustin, and Steinfeld Kyle, 2013, CBE Thermal Comfort Tool.
#' Center for the Built Environment, University of California Berkeley, \link{http://cbe.berkeley.edu/comforttool/}. Code is licenced CC-BY-NC.
#'
#' @author  Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibimet.cnr.it}
#' @keywords pierceSET,CBE Thermal Comfort Tool.
#' 
#' @export
#'
#'
#'
#'

pierceSET=function(t,rh,vel,tr,M,W,clo,patm) {
                         if (length(M)==1) {M=rep(M,length(t))}
                         if (length(W)==1) {W=rep(W,length(t))}
                         ct$assign("ta", as.array(t))
                         ct$assign("rh", as.array(rh))
                         ct$assign("vel", as.array(vel))
                         ct$assign("tr", as.array(tr))
                         ct$assign("M", as.array(M))
                         ct$assign("W", as.array(W))
                         ct$assign("clo", as.array(clo))
                         ct$assign("patm", as.array(patm))
                         ct$eval("var res=[]; for(var i=0, len=ta.length; i < len; i++){ res[i]=pierceSET(ta[i],rh[i],vel[i],tr[i],M[i],W[i],clo[i],patm[i])};")
                         res=ct$get("res")
                         return(ifelse(res==9999,NA,res))
}

