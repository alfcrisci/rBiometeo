#' radtheoricR
#'
#' @description R function to assess raw  solar irradiance parameter.
#' 
#' @param  timenow time "POSIXct" or "POSIXt" object.
#' @param  lat numeric latitude in decimal degrees.
#' @param  lon numeric longitude in decimal degrees.
#' @param  albedo numeric albedo of surface.
#' @return Theoretical radiation in W/mq
#' 
#' @author Istituto per la Bioeconomia CNR Firenze Italy  Alfonso Crisci \email{alfonso.crisci@@ibe.cnr.it}
#' 
#' 
#' 
#' @export

radtheoricR <- function(timenow,lat,lon,albedo){
 rho=albedo
 sunpar=sunposition(timenow,lat, lon)
 elev=sunpar$elevation
 timeday=as.POSIXlt(timenow, "GMT")
 nday=format(timeday,"%j")
 # Solar constant
 SC = 1.361 # kW/m2
 # ET solar radition I0 kW/m2
 I0 <- SC*(1+0.034*cos((nday)*2*pi/365)) 
 # atmospheric effect
 A <- 1.160 + 0.075 * sin((nday-274)*2*pi/365)
 opt.depth <- 0.174 + 0.035 * sin((nday-100)*2*pi/365)
 air.mass <- 1/sin(elev*2*pi/360)
 # Direct
 IB <- I0*exp(-opt.depth*air.mass)
 # diffuse
 IDH <- IB*(0.095 + 0.04*sin((nday-100)*2*pi/365))
 ID <- IDH*(1+cos(pi-elev*2*pi/360))/2
 # reflected
 IBH <- IB*sin(elev*2*pi/360)
 IR <-  rho*(IBH+IDH)*(1+cos(pi-elev*2*pi/360))/2
 # total
 IT <- IB+ID+IR
 I <- cbind(IB,ID,IR,IT)
 return(list(I0=I0,A=A,opt.depth=opt.depth, air.mass=air.mass,I=I,jd=nday,elev=elev,azimuth=sunpar$azimuth))
}
