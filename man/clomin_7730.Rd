% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/clomin_7730.r
\name{clomin_7730}
\alias{clomin_7730}
\title{clomin_7730}
\usage{
clomin_7730(t, rh, wind, tr, M)
}
\arguments{
\item{numeric}{t Air temperature in Celsius degrees.}

\item{numeric}{rh Air Relative humidity in percentage.}

\item{numeric}{wind Wind speed in meter per second.}

\item{numeric}{tr Mean radiant temperature in Celsius degrees.}

\item{numeric}{M Metabolic rate of subject in Watt per mq.}

\item{character}{outcome Type of outcome expected. Two parameters are available "clomax" and "clomin".}
}
\value{

}
\description{
Calculate minimal clothing insulation value needed for thermal comfort in moderate thermal environments based on PMV ISO 7730.
}
\author{
Istituto di Biometeorologia Firenze Italy  Alfonso Crisci \email{a.crisci@ibimet.cnr.it}
}
\keyword{ocir}