#' radtheoricR
#'
#' @description R function to assess raw  solar irradiance parameter.
#' 
#' @param  timenow "POSIXct" or "POSIXt" object.
#' @param  lat latitude in decimal degrees.
#' @param  lat longitude in decimal degrees.
#' @return List of solar and radiance parameters.
#' 
#' @author  Istituto per la Bioeconomia Firenze Italy  Alfonso Crisci \email{a.crisci@@ibe.cnr.it}
#' 
#' 
#' 
#' @export

radtheoricR <- function(timenow,lat,long,albedo){
 rho=albedo
 sunpar=sunposition(timenow,lat, long)
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
